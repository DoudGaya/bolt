'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function VerifyEmailForm() {
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail()
    }
  }, [token])

  const verifyEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setVerified(true)
        toast.success('Email verified successfully!')
        setTimeout(() => {
          router.push('/signin')
        }, 3000)
      } else {
        setError(data.error || data.message || 'Verification failed')
        toast.error(data.error || data.message || 'Verification failed')
      }
    } catch (error) {
      setError('Network error occurred')
      toast.error('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const verifyWithCode = async () => {
    if (!verificationCode) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      })

      const data = await response.json()

      if (response.ok) {
        setVerified(true)
        toast.success('Email verified successfully!')
        setTimeout(() => {
          router.push('/signin')
        }, 3000)
      } else {
        setError(data.error || data.message || 'Verification failed')
        toast.error(data.error || data.message || 'Verification failed')
      }
    } catch (error) {
      setError('Network error occurred')
      toast.error('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Verification email sent!')
      } else {
        toast.error(data.error || data.message || 'Failed to send verification email')
      }
    } catch (error) {
      toast.error('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-md bg-gray-800/80 backdrop-blur-md border border-gray-700 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              {verified ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : error ? (
                <XCircle className="h-6 w-6 text-white" />
              ) : (
                <Mail className="h-6 w-6 text-white" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {verified ? 'Email Verified!' : error ? 'Verification Failed' : 'Verify Your Email'}
          </CardTitle>
          <p className="text-gray-300 mt-2">
            {verified
              ? 'Your email has been successfully verified. Redirecting to sign in...'
              : error
              ? error
              : token
              ? 'Verifying your email...'
              : 'Please check your email for a verification link or enter the verification code below.'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && !verified && !error && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          )}

          {verified && (
            <div className="text-center">
              <Button
                onClick={() => router.push('/signin')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Go to Sign In
              </Button>
            </div>
          )}

          {error && !verified && (
            <div className="space-y-4">
              <Button
                onClick={verifyEmail}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Try Again
              </Button>
            </div>
          )}

          {!token && !verified && !error && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-300">Verification Code (Optional)</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={loading}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <Button
                onClick={verifyWithCode}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={loading || !verificationCode}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Code
              </Button>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">
              Didn't receive the email?
            </p>
            <Button
              variant="ghost"
              onClick={resendVerification}
              disabled={loading}
              className="text-purple-400 hover:text-purple-300 hover:bg-gray-700/50"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Resend Verification Email
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push('/signin')}
              className="text-gray-400 hover:text-gray-300"
            >
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
