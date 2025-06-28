import type { Metadata } from 'next'
import { PublicNavigation } from '@/components/public/public-navigation'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Authentication - DoudAI',
  description: 'Sign in or create an account to access DoudAI',
  robots: 'noindex, nofollow', // Don't index auth pages
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <PublicNavigation />
      <main>{children}</main>
      <Toaster />
    </div>
  )
}
