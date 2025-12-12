# RFI Tracker

Construction RFI (Request for Information) management software for contractors.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **Payments**: Stripe
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql` in the SQL editor
3. Copy your project URL and anon key

### 3. Set up Stripe

1. Create products in Stripe Dashboard:
   - **Starter**: $199/month
   - **Pro**: $349/month  
   - **Team**: $499/month
2. Copy the price IDs

### 4. Configure environment

Copy `env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_TEAM=price_xxx

RESEND_API_KEY=re_xxx

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Stripe Webhooks

After deployment, set up the webhook endpoint:

```
https://your-domain.com/api/webhooks/stripe
```

Events to listen for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

## Features

- ✅ Project management
- ✅ RFI creation and tracking
- ✅ Contact management
- ✅ Status and priority tracking
- ✅ Due date reminders
- ✅ User authentication (email/magic link)
- ✅ 7-day free trial
- ✅ Stripe subscriptions

## Pricing

- **Starter** ($199/mo): 1 team member, unlimited projects
- **Pro** ($349/mo): Up to 5 team members, PDF export
- **Team** ($499/mo): Unlimited team members, custom branding

## License

MIT
