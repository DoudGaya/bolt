import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
// import { EditProjectForm } from '@/components/dashboard/edit-project-form'
import { EditProjectForm } from '@/components/dashboard/edit-project-form'

interface EditProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: EditProjectPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions)
  const resolvedParams = await params
  
  if (!session?.user) {
    return { title: 'Edit Project | AI Marketing Creator' }
  }

  const project = await prisma.project.findFirst({
    where: {
      id: resolvedParams.id,
      userId: session.user.id,
    },
  })

  return {
    title: project ? `Edit ${project.name} | AI Marketing Creator` : 'Edit Project',
    description: 'Edit your marketing project settings and information.',
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await getServerSession(authOptions)
  const resolvedParams = await params

  if (!session?.user) {
    redirect('/signin')
  }

  const project = await prisma.project.findFirst({
    where: {
      id: resolvedParams.id,
      userId: session.user.id,
    },
  })

  if (!project) {
    notFound()
  }

  return <EditProjectForm project={project} />
}
