import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/Logo'
import { PLANS } from '@/lib/stripe'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - RFI Tracker | Construction RFI Software',
  description: 'Simple, transparent pricing for construction RFI management software. Start with a 7-day free trial. Plans from $199/month.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">
              Log in
            </Link>
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Start with a 7-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card key={key} className={key === 'pro' ? 'border-blue-600 border-2 relative scale-105' : ''}>
              {key === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-slate-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full" size="lg" variant={key === 'pro' ? 'default' : 'outline'}>
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Questions about pricing?
          </h2>
          <p className="text-slate-600 mb-4">
            We're here to help. Contact us at support@rfitracker.io
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20 border-t">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="border-b pb-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-2">
              How does the free trial work?
            </h3>
            <p className="text-slate-600">
              You get full access to all features for 7 days. No credit card required. At the end of your trial, choose a plan to continue or your account will be paused.
            </p>
          </div>
          <div className="border-b pb-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-2">
              Can I change plans later?
            </h3>
            <p className="text-slate-600">
              Yes! You can upgrade or downgrade at any time. Changes take effect immediately and we'll prorate the difference.
            </p>
          </div>
          <div className="border-b pb-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-slate-600">
              We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.
            </p>
          </div>
          <div className="border-b pb-6">
            <h3 className="font-semibold text-lg text-slate-900 mb-2">
              Is there a long-term contract?
            </h3>
            <p className="text-slate-600">
              No contracts. All plans are month-to-month. Cancel anytime with no penalties.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Logo showText={false} size="sm" href={undefined} />
              <span className="text-sm text-slate-600">
                © {new Date().getFullYear()} RFI Tracker. All rights reserved.
              </span>
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-900">Terms</Link>
              <a href="mailto:support@rfitracker.io" className="hover:text-slate-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


