import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Toaster } from '@/components/ui/sonner'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

export const metadata: Metadata = {
  title: 'Dashboard - AI Marketing Assistant',
  description: 'Create stunning marketing content with AI - manage your projects and generate content',
  robots: 'noindex, nofollow', // Don't index protected pages
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin')
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>
        {children}
      </DashboardLayout>
      <Toaster />
    </div>
  )
}
