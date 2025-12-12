import Link from 'next/link'
import { CheckCircle, FileQuestion, Clock, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Logo } from '@/components/Logo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Construction RFI Software | Track RFIs in One Place',
  description: 'Simple RFI management software for contractors. Stop losing RFIs in email. Track every question and answer. 7-day free trial.',
}

export default function ConstructionRFISoftwarePage() {
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

      {/* Hero - Optimized for "construction RFI software" */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
              RFI Management Made Simple
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Construction RFI Software That Actually Works
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Stop losing RFIs in email chains. Track every question and answer in one place. 
              Built for contractors who need results, not complexity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              7-day free trial • No credit card required • Set up in 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
          Sound familiar?
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Most contractors struggle with the same RFI problems
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-red-600 font-semibold mb-2">❌ Lost in email</div>
              <p className="text-slate-700">RFIs get buried in email threads. You can't find answers when you need them.</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-red-600 font-semibold mb-2">❌ No accountability</div>
              <p className="text-slate-700">Nobody knows who's responsible for answering. Questions go unanswered for weeks.</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-red-600 font-semibold mb-2">❌ Disputes</div>
              <p className="text-slate-700">Without a paper trail, you can't prove what was asked or answered.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            There's a better way
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            RFI Tracker gives you everything you need to manage construction RFIs
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Create RFIs Fast</h3>
              <p className="text-sm text-slate-600">Add questions in seconds. Attach photos and documents.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Assign & Track</h3>
              <p className="text-sm text-slate-600">Know who's responsible. Track status from open to closed.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Due Date Alerts</h3>
              <p className="text-sm text-slate-600">Never miss a deadline. Get reminders before RFIs are overdue.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Complete Records</h3>
              <p className="text-sm text-slate-600">Full history of every RFI. Perfect for disputes and audits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to stop losing RFIs?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join hundreds of contractors who manage their RFIs with RFI Tracker. Start your free trial today.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-blue-200">
            Plans from $199/month • No contracts
          </p>
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


