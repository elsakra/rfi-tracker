'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PLANS } from '@/lib/stripe'
import type { Profile } from '@/types/database'

function SettingsContent() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for success/canceled query params from Stripe redirect
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')
    
    if (success === 'true') {
      setMessage('Subscription updated successfully!')
    } else if (canceled === 'true') {
      setMessage('Checkout was canceled.')
    }
  }, [searchParams])

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) {
          const typedData = data as unknown as Profile
          setProfile(typedData)
          setFullName(typedData.full_name || '')
          setCompanyName(typedData.company_name || '')
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    
    setSaving(true)
    setMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          company_name: companyName,
        } as never)
        .eq('id', profile.id)

      if (error) throw error
      setMessage('Settings saved successfully')
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleUpgrade = async (tier: string) => {
    const plan = PLANS[tier as keyof typeof PLANS]
    if (!plan?.priceId) {
      setMessage('Price not configured for this plan')
      return
    }

    setUpgradingPlan(tier)
    setMessage('')

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          plan: tier,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to start checkout')
    } finally {
      setUpgradingPlan(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const currentPlan = profile?.subscription_tier || 'starter'
  const isTrialing = profile?.subscription_status === 'trialing'
  const trialEndsAt = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null
  const daysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Manage your account and subscription.</p>
      </div>

      <div className="space-y-6">
        {/* Message Banner */}
        {message && (
          <div className={`text-sm p-3 rounded-md ${
            message.includes('success') 
              ? 'bg-green-50 text-green-600' 
              : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}

        {/* Trial Banner */}
        {isTrialing && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Free Trial</p>
                  <p className="text-sm text-blue-700">
                    {daysLeft > 0 
                      ? `${daysLeft} days remaining in your trial`
                      : 'Your trial has ended'
                    }
                  </p>
                </div>
                <Button onClick={() => handleUpgrade('pro')}>
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <Input
                label="Email"
                value={profile?.email || ''}
                disabled
              />

              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(PLANS).map(([key, plan]) => (
                <div 
                  key={key}
                  className={`p-4 rounded-lg border-2 ${
                    currentPlan === key 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <h3 className="font-medium">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-1">${plan.price}<span className="text-sm font-normal text-slate-500">/mo</span></p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-600">
                    {plan.features.slice(0, 3).map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                  {currentPlan === key ? (
                    <Button variant="outline" className="w-full mt-4" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => handleUpgrade(key)}
                      loading={upgradingPlan === key}
                      disabled={upgradingPlan !== null}
                    >
                      {PLANS[key as keyof typeof PLANS].price > PLANS[currentPlan as keyof typeof PLANS].price ? 'Upgrade' : 'Downgrade'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SettingsFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsFallback />}>
      <SettingsContent />
    </Suspense>
  )
}
