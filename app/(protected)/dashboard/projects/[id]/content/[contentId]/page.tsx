import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { ContentDetailView } from '@/components/dashboard/content-detail-view'

interface ContentPageProps {
  params: Promise<{
    id: string
    contentId: string
  }>
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions)
  const resolvedParams = await params
  
  if (!session?.user) {
    return { title: 'Content | AI Marketing Creator' }
  }

  const content = await prisma.generatedContent.findFirst({
    where: {
      id: resolvedParams.contentId,
      project: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
    },
    include: {
      project: true,
    },
  })

  return {
    title: content ? `${content.title} | AI Marketing Creator` : 'Content Not Found',
    description: content?.description || 'AI-generated marketing content',
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const session = await getServerSession(authOptions)
  const resolvedParams = await params

  if (!session?.user) {
    redirect('/signin')
  }

  const content = await prisma.generatedContent.findFirst({
    where: {
      id: resolvedParams.contentId,
      project: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
    },
    include: {
      project: true,
    },
  })

  if (!content) {
    notFound()
  }

  return <ContentDetailView content={content} />
}
