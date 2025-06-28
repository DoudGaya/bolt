import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Metadata } from 'next'
import { SettingsView } from '@/components/dashboard/settings-view'

export const metadata: Metadata = {
  title: 'Settings | AI Marketing Creator',
  description: 'Manage your account settings and preferences.',
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/signin')
  }

  return <SettingsView user={session.user} />
}
