import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 199,
    priceId: process.env.STRIPE_PRICE_STARTER,
    features: [
      '1 team member',
      'Unlimited projects',
      'RFI tracking',
      'Basic reports',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 349,
    priceId: process.env.STRIPE_PRICE_PRO,
    features: [
      'Up to 5 team members',
      'Unlimited projects',
      'RFI tracking',
      'Photo attachments',
      'PDF export',
      'Priority support',
    ],
  },
  team: {
    name: 'Team',
    price: 499,
    priceId: process.env.STRIPE_PRICE_TEAM,
    features: [
      'Unlimited team members',
      'Unlimited projects',
      'RFI tracking',
      'Photo attachments',
      'PDF export',
      'Custom branding',
      'API access',
      'Dedicated support',
    ],
  },
} as const

export type PlanType = keyof typeof PLANS
