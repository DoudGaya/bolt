import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfessionalContentGenerationForm } from '@/components/dashboard/professional-content-generation-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Zap, Target, TrendingUp } from 'lucide-react'

export default async function ContentGenerationPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; type?: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/signin')
  }

  // Await searchParams for Next.js 15 compatibility
  const resolvedSearchParams = await searchParams

  // Get user's projects for project selection
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      productName: true,
      industry: true,
      productDescription: true,
      targetAudience: true,
      toneStyle: true,
      primaryColor: true,
      secondaryColor: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  // If a specific project is selected, get its details
  const selectedProject = resolvedSearchParams.projectId 
    ? projects.find(p => p.id === resolvedSearchParams.projectId) 
    : projects[0] || null

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Professional Content Generation
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Create world-class marketing content with AI-powered precision. Generate text, images, videos, and audio 
          that drive engagement and conversions for your brand.
        </p>
        
        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Zap className="h-4 w-4" />
            <span>Lightning Fast</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Target className="h-4 w-4" />
            <span>Precision Targeting</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span>Performance Optimized</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Sparkles className="h-4 w-4" />
            <span>Brand Consistent</span>
          </Badge>
        </div>
      </div>

      {/* Main Content Generation Form */}
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Generate Content</CardTitle>
          <CardDescription>
            Use our advanced AI system to create professional marketing content tailored to your brand and goals.
            {selectedProject && (
              <span className="block mt-2 text-sm font-medium text-purple-600">
                Generating for: {selectedProject.productName}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedProject ? (
            <ProfessionalContentGenerationForm 
              project={{
                ...selectedProject,
                secondaryColor: selectedProject.secondaryColor || undefined,
              }}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Please create a project first to generate content.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">📝 Text Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Generate blog articles, social media posts, ad copy, email campaigns, and more with advanced persuasion techniques.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">🎨 Visual Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create stunning images, logos, banners, and graphics that align perfectly with your brand identity.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">🎬 Video Scripts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Develop engaging video scripts and concepts for ads, tutorials, testimonials, and brand stories.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">🎵 Audio Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Produce professional voiceovers, jingles, and audio ads with perfect voice matching for your brand.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
