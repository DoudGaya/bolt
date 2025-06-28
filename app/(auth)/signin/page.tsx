import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SignInForm } from '@/components/auth/signin-form'

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <SignInForm />
    </div>
  )
}