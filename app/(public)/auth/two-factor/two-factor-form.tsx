'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function TwoFactorForm() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || code.length !== 6) {
      toast.error('Please enter a 6-digit code')
      return
    }

    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        twoFactorCode: code,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid 2FA code')
      } else {
        toast.success('Successfully authenticated!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/resend-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast.success('New 2FA code sent to your email!')
      } else {
        toast.error('Failed to send 2FA code')
      }
    } catch (error) {
      toast.error('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Two-Factor Authentication
          </CardTitle>
          <p className="text-gray-600 mt-2">
            We've sent a 6-digit code to{' '}
            <span className="font-medium">{email}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-wider"
                maxLength={6}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading || code.length !== 6}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="ghost"
              onClick={resendCode}
              disabled={loading}
              className="text-purple-600 hover:text-purple-700"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Resend Code
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push('/auth/signin')}
              className="text-gray-600 hover:text-gray-700"
            >
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
