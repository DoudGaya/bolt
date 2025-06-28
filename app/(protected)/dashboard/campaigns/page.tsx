import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
// import { CampaignBuilder } from '@/components/dashboard/campaign-builder'
import { CampaignBuilder } from '@/components/dashboard/campaign-builder'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, Target, TrendingUp, Plus, BarChart3, Users, Calendar } from 'lucide-react'

export default async function CampaignsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/signin')
  }

  // Get user's projects for campaign creation
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      generatedContent: {
        select: {
          id: true,
          type: true,
          title: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Mock campaign data (in real app, this would come from a campaigns table)
  const campaigns = [
    {
      id: 'camp_1',
      name: 'Q4 Holiday Campaign',
      status: 'active',
      contentCount: 24,
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      startDate: '2024-11-01',
      endDate: '2024-12-31',
      performance: { engagement: 4.2, reach: 125000, conversions: 842 }
    },
    {
      id: 'camp_2',
      name: 'Product Launch Series',
      status: 'draft',
      contentCount: 12,
      platforms: ['LinkedIn', 'YouTube'],
      startDate: '2024-12-15',
      endDate: '2025-01-15',
      performance: { engagement: 0, reach: 0, conversions: 0 }
    },
  ]

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Campaigns</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage multi-platform marketing campaigns with AI-generated content.
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Campaign</span>
        </Button>
      </div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.contentCount, 0)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">
                  {(campaigns.reduce((acc, c) => acc + c.performance.reach, 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.performance.conversions, 0)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Campaign Builder
          </CardTitle>
          <CardDescription>
            Create comprehensive marketing campaigns with AI-generated content across multiple platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignBuilder projects={projects} />
        </CardContent>
      </Card>

      {/* Existing Campaigns */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Campaigns</h2>
        
        <div className="grid gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{campaign.startDate} - {campaign.endDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>{campaign.contentCount} pieces</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {campaign.platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    {campaign.status === 'active' && (
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{campaign.performance.engagement}%</span>
                          <span className="text-muted-foreground ml-1">engagement</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{(campaign.performance.reach / 1000).toFixed(0)}K</span>
                          <span className="text-muted-foreground ml-1">reach</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{campaign.performance.conversions}</span>
                          <span className="text-muted-foreground ml-1">conversions</span>
                        </div>
                      </div>
                    )}
                    <Button variant="outline" size="sm">
                      {campaign.status === 'active' ? 'View Details' : 'Edit Campaign'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {campaigns.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first marketing campaign to get started with batch content generation.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
