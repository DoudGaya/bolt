import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CreateProjectForm } from '@/components/dashboard/create-project-form'

export const metadata: Metadata = {
  title: 'Create Project | AI Marketing Creator',
  description: 'Create a new marketing project with AI-powered content generation.',
}

export default async function CreateProjectPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/signin')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground mt-2">
          Set up your marketing project to generate AI-powered content for your brand.
        </p>
      </div>
      
      <CreateProjectForm userId={session.user.id} />
    </div>
  )
}
