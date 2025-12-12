import Link from 'next/link'
import { CheckCircle, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/Logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Procore Alternative for RFIs | Simple & Affordable',
  description: 'Looking for a Procore alternative? RFI Tracker offers simple RFI management at a fraction of the cost. No enterprise complexity.',
}

export default function ProcoreAlternativePage() {
  const comparison = [
    { feature: 'RFI tracking', rfiTracker: true, procore: true },
    { feature: 'Photo attachments', rfiTracker: true, procore: true },
    { feature: 'Due date reminders', rfiTracker: true, procore: true },
    { feature: 'Mobile access', rfiTracker: true, procore: true },
    { feature: 'Set up in 5 minutes', rfiTracker: true, procore: false },
    { feature: 'No long-term contracts', rfiTracker: true, procore: false },
    { feature: 'Transparent pricing', rfiTracker: true, procore: false },
    { feature: 'Works without training', rfiTracker: true, procore: false },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <Link href="/signup">
            <Button>Start Free Trial</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-6">
              Procore Alternative
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              All the RFI tracking you need.
              <span className="text-blue-400"> None of the complexity.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Procore is built for enterprise. RFI Tracker is built for contractors who want simple, 
              affordable RFI management without the overhead.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 border-slate-600 text-white hover:bg-slate-700">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Compare RFI Tracker vs Procore
        </h2>
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="bg-slate-50">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="text-left font-semibold">Feature</div>
                <div className="font-semibold text-blue-600">RFI Tracker</div>
                <div className="font-semibold text-slate-600">Procore</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {comparison.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 gap-4 p-4 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <div className="text-slate-700">{row.feature}</div>
                  <div className="text-center">
                    {row.rfiTracker ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    {row.procore ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Simple, transparent pricing
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="border-blue-600 border-2">
              <CardHeader>
                <CardTitle className="text-blue-600">RFI Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">$199-$499<span className="text-lg font-normal text-slate-600">/month</span></div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ All RFI features included</li>
                  <li>✓ No setup fees</li>
                  <li>✓ No long-term contracts</li>
                  <li>✓ Cancel anytime</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-600">Procore</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">$$$$$<span className="text-lg font-normal text-slate-600">/month</span></div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✗ Custom pricing (often $500+/month)</li>
                  <li>✗ Implementation fees</li>
                  <li>✗ Annual contracts required</li>
                  <li>✗ Pay for features you don't need</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Switch to simpler RFI tracking
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Get all the RFI features you need without the enterprise complexity. Start your free trial today.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 text-sm text-slate-500">
          <Logo showText={false} size="sm" href={undefined} />
          <span>© {new Date().getFullYear()} RFI Tracker. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}


