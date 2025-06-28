import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { ProjectDetailView } from '@/components/dashboard/project-detail-view'

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions)
  const resolvedParams = await params
  
  if (!session?.user) {
    return { title: 'Project | AI Marketing Creator' }
  }

  const project = await prisma.project.findFirst({
    where: {
      id: resolvedParams.id,
      userId: session.user.id,
    },
  })

  return {
    title: project ? `${project.name} | AI Marketing Creator` : 'Project Not Found',
    description: project?.description || 'AI-powered marketing project details',
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
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
    include: {
      generatedContent: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          generatedContent: true,
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  return <ProjectDetailView project={project} />
}
