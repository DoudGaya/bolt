import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentProjects } from '@/components/dashboard/recent-projects'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/signin')
  }

  const [projects, generatedContent] = await Promise.all([
    prisma.project.findMany({
      where: { userId: session.user.id },
      include: {
        generatedContent: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.generatedContent.count({
      where: {
        project: {
          userId: session.user.id,
        },
      },
    }),
  ])

  const stats = {
    totalProjects: projects.length,
    totalContent: generatedContent,
    recentActivity: projects.reduce((acc, project) => acc + project.generatedContent.length, 0),
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your marketing projects.
        </p>
      </div>

      <DashboardStats stats={stats} />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentProjects projects={projects} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}