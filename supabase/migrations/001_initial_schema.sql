-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  company_name text,
  stripe_customer_id text unique,
  subscription_status text check (subscription_status in ('trialing', 'active', 'canceled', 'past_due')),
  subscription_tier text check (subscription_tier in ('starter', 'pro', 'team')),
  trial_ends_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  client_name text,
  address text,
  status text default 'active' check (status in ('active', 'completed', 'on_hold')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Contacts table
create table public.contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  email text,
  phone text,
  company text,
  role text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RFIs table
create table public.rfis (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  rfi_number serial,
  subject text not null,
  question text not null,
  answer text,
  status text default 'open' check (status in ('open', 'pending', 'answered', 'closed')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assigned_to_id uuid references public.contacts(id) on delete set null,
  due_date timestamptz,
  answered_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RFI attachments table
create table public.rfi_attachments (
  id uuid default uuid_generate_v4() primary key,
  rfi_id uuid references public.rfis(id) on delete cascade not null,
  file_name text not null,
  file_url text not null,
  file_type text not null,
  file_size integer not null,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_projects_user_id on public.projects(user_id);
create index idx_contacts_user_id on public.contacts(user_id);
create index idx_contacts_project_id on public.contacts(project_id);
create index idx_rfis_user_id on public.rfis(user_id);
create index idx_rfis_project_id on public.rfis(project_id);
create index idx_rfis_status on public.rfis(status);
create index idx_rfi_attachments_rfi_id on public.rfi_attachments(rfi_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.contacts enable row level security;
alter table public.rfis enable row level security;
alter table public.rfi_attachments enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Projects policies
create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Contacts policies
create policy "Users can view their own contacts"
  on public.contacts for select
  using (auth.uid() = user_id);

create policy "Users can create contacts"
  on public.contacts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own contacts"
  on public.contacts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own contacts"
  on public.contacts for delete
  using (auth.uid() = user_id);

-- RFIs policies
create policy "Users can view their own RFIs"
  on public.rfis for select
  using (auth.uid() = user_id);

create policy "Users can create RFIs"
  on public.rfis for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own RFIs"
  on public.rfis for update
  using (auth.uid() = user_id);

create policy "Users can delete their own RFIs"
  on public.rfis for delete
  using (auth.uid() = user_id);

-- RFI attachments policies
create policy "Users can view attachments of their RFIs"
  on public.rfi_attachments for select
  using (
    exists (
      select 1 from public.rfis
      where rfis.id = rfi_attachments.rfi_id
      and rfis.user_id = auth.uid()
    )
  );

create policy "Users can create attachments for their RFIs"
  on public.rfi_attachments for insert
  with check (
    exists (
      select 1 from public.rfis
      where rfis.id = rfi_attachments.rfi_id
      and rfis.user_id = auth.uid()
    )
  );

create policy "Users can delete attachments of their RFIs"
  on public.rfi_attachments for delete
  using (
    exists (
      select 1 from public.rfis
      where rfis.id = rfi_attachments.rfi_id
      and rfis.user_id = auth.uid()
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, subscription_status, trial_ends_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'trialing',
    now() + interval '7 days'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger update_projects_updated_at
  before update on public.projects
  for each row execute procedure public.update_updated_at();

create trigger update_contacts_updated_at
  before update on public.contacts
  for each row execute procedure public.update_updated_at();

create trigger update_rfis_updated_at
  before update on public.rfis
  for each row execute procedure public.update_updated_at();


