# RFI Tracker - Agent Notes

> Last updated: December 12, 2025
> Status: Fully functional and deployed

## Overview

RFI Tracker is a construction RFI (Request for Information) management SaaS application. It allows contractors to track questions and answers across construction projects, assign them to contacts, and manage due dates.

**Live URL**: https://rfitracker.io
**GitHub**: https://github.com/elsakra/rfi-tracker

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Supabase | Database + Auth |
| Stripe | Payments |
| Vercel | Hosting |
| Lucide React | Icons |

---

## Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── (app)/              # Protected app routes (requires auth)
│   │   │   ├── dashboard/      # Main dashboard with stats
│   │   │   ├── projects/       # Project CRUD + RFI management
│   │   │   ├── rfis/           # All RFIs view
│   │   │   ├── contacts/       # Contact management
│   │   │   └── settings/       # User profile + subscription
│   │   ├── (auth)/             # Auth routes
│   │   │   ├── login/          # OTP + password login
│   │   │   └── signup/         # OTP signup flow
│   │   ├── (marketing)/        # Public landing pages
│   │   │   ├── pricing/
│   │   │   ├── construction-rfi-software/
│   │   │   └── procore-alternative/
│   │   ├── api/
│   │   │   ├── stripe/checkout/     # Create Stripe checkout session
│   │   │   └── webhooks/stripe/     # Handle Stripe webhooks
│   │   └── auth/callback/      # Supabase auth callback
│   ├── components/
│   │   ├── Logo.tsx            # Brand logo component
│   │   ├── analytics.tsx       # Google Analytics
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   ├── stripe.ts           # Stripe config + plans
│   │   ├── utils.ts            # Utility functions
│   │   └── supabase/
│   │       ├── client.ts       # Browser Supabase client
│   │       ├── server.ts       # Server Supabase client
│   │       └── middleware.ts   # Auth middleware helper
│   ├── middleware.ts           # Route protection
│   └── types/
│       └── database.ts         # TypeScript types for DB
├── public/
│   └── logo.svg                # App logo
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql  # Database schema
```

---

## Authentication Flow

The app uses **OTP (One-Time Password) authentication** via Supabase:

### Signup Flow:
1. User enters email on `/signup`
2. Supabase sends 6-digit OTP to email
3. User enters OTP code (shown in email subject)
4. On verification, user is prompted for name/company
5. Redirect to `/dashboard`

### Login Flow:
1. User can choose "Email Code" (OTP) or "Password"
2. For OTP: enter email → receive 6-digit code → enter code
3. For password: standard email/password login
4. Redirect to originally requested page or `/dashboard`

### Route Protection:
- Middleware in `src/middleware.ts` protects all `/dashboard`, `/projects`, `/rfis`, `/contacts`, `/settings` routes
- Unauthenticated users are redirected to `/login` with return URL
- Authenticated users on `/login` or `/signup` are redirected to `/dashboard`

---

## Database Schema

Tables in Supabase:

### `profiles`
- Extended user profile (linked to auth.users)
- Stores: full_name, company_name, stripe_customer_id, subscription_status, subscription_tier, trial_ends_at

### `projects`
- Construction projects
- Fields: name, description, client_name, address, status (active/completed/on_hold)

### `contacts`
- Project contacts (architects, engineers, owners)
- Fields: name, email, phone, company, role

### `rfis`
- Request for Information items
- Fields: rfi_number (auto-increment), subject, question, answer, status (open/pending/answered/closed), priority (low/medium/high/urgent), due_date, assigned_to_id

### `rfi_attachments`
- File attachments for RFIs (not fully implemented in UI yet)

All tables have Row Level Security (RLS) policies to ensure users can only access their own data.

---

## Stripe Integration

### Pricing Tiers:
| Plan | Price | Price ID Env Var |
|------|-------|------------------|
| Starter | $199/mo | STRIPE_PRICE_STARTER |
| Pro | $349/mo | STRIPE_PRICE_PRO |
| Team | $499/mo | STRIPE_PRICE_TEAM |

### Checkout Flow:
1. User clicks upgrade on `/settings`
2. Frontend calls `POST /api/stripe/checkout` with plan info
3. Backend creates Stripe Checkout session
4. User redirected to Stripe
5. On success, Stripe webhook updates profile subscription

### Webhook Events Handled:
- `checkout.session.completed` - Activate subscription
- `customer.subscription.updated` - Update status
- `customer.subscription.deleted` - Mark as canceled
- `invoice.payment_failed` - Mark as past_due

---

## Environment Variables

Required in Vercel (and `.env.local` for development):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_TEAM=price_xxx

# App
NEXT_PUBLIC_APP_URL=https://rfitracker.io

# Optional: Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-xxx
```

---

## Deployment

### Vercel:
- Auto-deploys from `main` branch
- Project: `rfi-tracker`
- Domain: `rfitracker.io`

### To Deploy:
```bash
cd app
git add -A
git commit -m "Your message"
git push origin main
```

Vercel will automatically build and deploy.

---

## Manual Configuration Required

### 1. Supabase Email Templates
For OTP codes to appear in email subject, configure in Supabase Dashboard:
- Go to Authentication > Email Templates
- For "Magic Link" and "Confirm Signup" templates
- Include `{{ .Token }}` in the subject line

Example subject: `Your RFI Tracker code is {{ .Token }}`

### 2. Stripe Webhook
If not already configured:
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://rfitracker.io/api/webhooks/stripe`
3. Select events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed
4. Copy signing secret to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## Key Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Auth (OTP) | ✅ Complete | Email OTP + password login |
| Projects CRUD | ✅ Complete | Create, view, list projects |
| RFI Management | ✅ Complete | Create, view, update, delete RFIs |
| Contact Management | ✅ Complete | Add contacts to projects |
| Dashboard Stats | ✅ Complete | Open, overdue, closed counts |
| Stripe Subscriptions | ✅ Complete | Checkout + webhooks |
| Marketing Pages | ✅ Complete | Pricing, landing pages |
| File Attachments | ⚠️ Partial | DB ready, UI not implemented |
| Email Notifications | ❌ Not done | Would need Resend integration |
| Team Members | ❌ Not done | Schema ready, UI not implemented |

---

## Common Tasks for Future Agents

### Add a new page:
1. Create file in `src/app/(app)/[page-name]/page.tsx`
2. Use `createClient` from `@/lib/supabase/server` for server components
3. Use `createClient` from `@/lib/supabase/client` for client components
4. Follow existing patterns for data fetching

### Modify database:
1. Create new migration in `supabase/migrations/`
2. Run SQL in Supabase Dashboard SQL editor
3. Update types in `src/types/database.ts`

### Update styling:
- Tailwind CSS classes inline
- No CSS modules or external CSS (except globals.css)
- Follow existing color scheme (blue-600 primary, slate grays)

### Debug auth issues:
1. Check browser console for Supabase errors
2. Verify env vars are set in Vercel
3. Check middleware.ts for route protection
4. Supabase Dashboard > Authentication > Users

---

## File Reference for Key Changes

| To change... | Edit file |
|--------------|-----------|
| Auth routes protection | `src/middleware.ts` |
| Supabase client config | `src/lib/supabase/client.ts` |
| Stripe plans/pricing | `src/lib/stripe.ts` |
| Database types | `src/types/database.ts` |
| App sidebar/nav | `src/app/(app)/layout.tsx` |
| Logo | `src/components/Logo.tsx` + `public/logo.svg` |
| Homepage | `src/app/page.tsx` |

---

## Testing Locally

```bash
cd app
npm install
cp env.example .env.local
# Fill in .env.local with your keys
npm run dev
```

Open http://localhost:3000

---

## Troubleshooting

### "Not authenticated" errors
- Check if cookies are being set
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Clear cookies and try again

### Stripe checkout not working
- Verify STRIPE_SECRET_KEY is correct
- Check browser console for errors
- Ensure price IDs match Stripe Dashboard

### Build errors on Vercel
- Check that all environment variables are set
- Run `npm run build` locally to see errors
- Verify tsconfig.json is valid

---

*This document is for Cursor AI agents. Keep it updated when making significant changes.*

