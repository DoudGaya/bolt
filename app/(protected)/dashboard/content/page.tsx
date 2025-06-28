import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ContentLibrary } from '@/components/dashboard/content-library'
import { ContentAnalytics } from '@/components/dashboard/content-analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BarChart3, FileText, Image, Video, Music, TrendingUp, Download } from 'lucide-react'

export default async function ContentPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/signin')
  }

  // Get all generated content for the user
  const [projects, generatedContent] = await Promise.all([
    prisma.project.findMany({
      where: { userId: session.user.id },
      include: {
        generatedContent: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.generatedContent.findMany({
      where: {
        project: {
          userId: session.user.id,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            productName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  // Calculate content statistics
  const contentStats = {
    total: generatedContent.length,
    text: generatedContent.filter(c => c.type === 'TEXT').length,
    image: generatedContent.filter(c => c.type === 'IMAGE').length,
    video: generatedContent.filter(c => c.type === 'VIDEO').length,
    audio: generatedContent.filter(c => c.type === 'AUDIO').length,
  }

  const recentContent = generatedContent.slice(0, 10)

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Library</h1>
          <p className="text-muted-foreground mt-2">
            Manage and analyze all your generated marketing content.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <BarChart3 className="h-4 w-4" />
            <span>{contentStats.total} Total Assets</span>
          </Badge>
        </div>
      </div>

      {/* Content Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold">{contentStats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Text Content</p>
                <p className="text-2xl font-bold">{contentStats.text}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">{contentStats.image}</p>
              </div>
              <Image className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Videos</p>
                <p className="text-2xl font-bold">{contentStats.video}</p>
              </div>
              <Video className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Audio</p>
                <p className="text-2xl font-bold">{contentStats.audio}</p>
              </div>
              <Music className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Content Library</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="exports" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          <ContentLibrary 
            projects={projects}
            generatedContent={generatedContent}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ContentAnalytics 
            generatedContent={generatedContent}
            contentStats={contentStats}
          />
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Content</CardTitle>
              <CardDescription>
                Download your generated content in various formats for use across different platforms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Export functionality will be available soon. Content can be individually downloaded from the library.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
