import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { ContentGenerationForm } from '@/components/dashboard/content-generation-form'

interface GenerateContentPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: GenerateContentPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions)
  const resolvedParams = await params
  
  if (!session?.user) {
    return { title: 'Generate Content | AI Marketing Creator' }
  }

  const project = await prisma.project.findFirst({
    where: {
      id: resolvedParams.id,
      userId: session.user.id,
    },
  })

  return {
    title: project ? `Generate Content - ${project.name} | AI Marketing Creator` : 'Generate Content',
    description: 'Generate AI-powered marketing content for your project.',
  }
}

export default async function GenerateContentPage({ params }: GenerateContentPageProps) {
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

  return <ContentGenerationForm project={project} />
}
