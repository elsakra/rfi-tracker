import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.subscription 
          ? (await stripe.subscriptions.retrieve(session.subscription as string)).metadata.supabase_user_id
          : null

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: 'active',
              subscription_tier: session.metadata?.plan || 'starter',
            } as Record<string, unknown>)
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: subscription.status === 'active' ? 'active' : 
                                   subscription.status === 'trialing' ? 'trialing' :
                                   subscription.status === 'past_due' ? 'past_due' : 'canceled',
              subscription_tier: subscription.metadata.plan || 'starter',
            } as Record<string, unknown>)
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: 'canceled',
            } as Record<string, unknown>)
            .eq('id', userId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as { subscription?: string }).subscription
        
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const userId = subscription.metadata.supabase_user_id

          if (userId) {
            await supabaseAdmin
              .from('profiles')
              .update({
                subscription_status: 'past_due',
              } as Record<string, unknown>)
              .eq('id', userId)
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
