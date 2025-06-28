import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { ProjectsView } from '@/components/dashboard/projects-view'

export const metadata: Metadata = {
  title: 'Projects | AI Marketing Creator',
  description: 'Manage your marketing projects and generated content.',
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/signin')
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      generatedContent: true,
      _count: {
        select: {
          generatedContent: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return <ProjectsView projects={projects} />
}
