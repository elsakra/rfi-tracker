import Link from 'next/link'
import { CheckCircle, FileQuestion, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/Logo'
import { PLANS } from '@/lib/stripe'

export default function HomePage() {
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

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 max-w-4xl mx-auto leading-tight">
          Stop losing RFIs in email.
          <span className="text-blue-600"> Track every question and answer in one place.</span>
        </h1>
        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
          RFI tracking built for contractors who don't need Procore. 
          Simple, affordable, and fast to set up. 7-day free trial.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#pricing">
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Pricing
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          No credit card required • 7-day free trial • Cancel anytime
        </p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Everything you need to manage RFIs
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardHeader>
              <FileQuestion className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Create & Track RFIs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create RFIs in seconds. Track status from open to closed. Never lose a question again.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Assign to Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Assign RFIs to architects, engineers, or owners. Everyone knows who's responsible.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Due Date Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Set due dates and get notified. Stop chasing people for answers.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Project Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                See all open RFIs across projects at a glance. Know exactly what needs attention.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Start with a 7-day free trial. No credit card required. Cancel anytime.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card key={key} className={key === 'pro' ? 'border-blue-600 border-2 relative' : ''}>
              {key === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-slate-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button className="w-full" variant={key === 'pro' ? 'default' : 'outline'}>
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to stop losing RFIs?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join hundreds of contractors who track their RFIs with us. Start your free trial today.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial
            </Button>
          </Link>
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
