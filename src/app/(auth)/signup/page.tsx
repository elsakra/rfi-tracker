'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/Logo'

type Step = 'email' | 'otp' | 'profile'

export default function SignupPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email')
      return
    }
    
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Send OTP email - Supabase will include the code in the email
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // This ensures we get a 6-digit code
          shouldCreateUser: true,
          data: {
            full_name: fullName || undefined,
          }
        },
      })

      if (error) throw error
      setStep('otp')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }
    
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })

      if (error) throw error
      
      // Move to profile step or redirect
      setStep('profile')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      // Update profile with name and company
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          company_name: companyName || null,
        })
        .eq('id', user.id)

      if (error) throw error
      
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  // Email Step
  if (step === 'email') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle>Start your free trial</CardTitle>
            <CardDescription>
              7 days free, no credit card required
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendOTP} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <Input
                label="Work Email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <Button type="submit" className="w-full" loading={loading}>
                Continue with Email
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>

            <p className="mt-4 text-center text-xs text-slate-500">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="underline">Terms</Link> and{' '}
              <Link href="/privacy" className="underline">Privacy Policy</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // OTP Verification Step
  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a 6-digit code to <strong>{email}</strong>
              <br />
              <span className="text-slate-500">Check your email subject line for the code</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <Input
                label="Verification Code"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                autoComplete="one-time-code"
                inputMode="numeric"
                className="text-center text-2xl tracking-widest"
                required
              />

              <Button type="submit" className="w-full" loading={loading}>
                Verify Code
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setStep('email')}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Use a different email
              </button>
            </div>

            <div className="mt-4 text-center">
              <button 
                onClick={handleSendOTP}
                disabled={loading}
                className="text-sm text-blue-600 hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Profile Step
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle>Complete your profile</CardTitle>
          <CardDescription>
            Tell us a bit about yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCompleteProfile} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            
            <Input
              label="Full Name"
              type="text"
              placeholder="John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />

            <Input
              label="Company Name"
              type="text"
              placeholder="Smith Construction"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoComplete="organization"
            />

            <Button type="submit" className="w-full" loading={loading}>
              Start Using RFI Tracker
            </Button>
          </form>

          <button 
            onClick={() => {
              router.push('/dashboard')
              router.refresh()
            }}
            className="mt-4 w-full text-sm text-slate-600 hover:text-slate-900"
          >
            Skip for now
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
