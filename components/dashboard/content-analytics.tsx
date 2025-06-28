'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Zap,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Calendar,
  Globe
} from 'lucide-react'
import { format, subDays, isAfter } from 'date-fns'

interface ContentAnalyticsProps {
  generatedContent: any[]
  contentStats: {
    total: number
    text: number
    image: number
    video: number
    audio: number
  }
}

export function ContentAnalytics({ generatedContent, contentStats }: ContentAnalyticsProps) {
  // Calculate time-based analytics
  const now = new Date()
  const last7Days = subDays(now, 7)
  const last30Days = subDays(now, 30)

  const recentContent = generatedContent.filter(content => 
    isAfter(new Date(content.createdAt), last7Days)
  )

  const monthlyContent = generatedContent.filter(content => 
    isAfter(new Date(content.createdAt), last30Days)
  )

  // Calculate platform distribution
  const platformStats = generatedContent.reduce((acc, content) => {
    const platform = content.metadata?.platform || 'general'
    acc[platform] = (acc[platform] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate content performance metrics (mock data for demo)
  const performanceMetrics = {
    averageEngagement: 4.2,
    conversionRate: 12.8,
    clickThroughRate: 3.5,
    averageReach: 15420,
  }

  // Calculate productivity metrics
  const avgContentPerDay = monthlyContent.length / 30
  const contentGrowth = recentContent.length > 0 ? 
    ((recentContent.length / 7) - (monthlyContent.length / 30)) / (monthlyContent.length / 30) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Output</p>
                <p className="text-2xl font-bold">{recentContent.length}</p>
                <p className="text-xs text-emerald-600 font-medium">
                  +{Math.round(contentGrowth)}% from last week
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Engagement</p>
                <p className="text-2xl font-bold">{performanceMetrics.averageEngagement}%</p>
                <p className="text-xs text-blue-600 font-medium">
                  Above industry avg.
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics.conversionRate}%</p>
                <p className="text-xs text-purple-600 font-medium">
                  CTR: {performanceMetrics.clickThroughRate}%
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
                <p className="text-sm font-medium text-muted-foreground">Daily Productivity</p>
                <p className="text-2xl font-bold">{avgContentPerDay.toFixed(1)}</p>
                <p className="text-xs text-orange-600 font-medium">
                  Content per day
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Type Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Content Type Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of your generated content by type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Text Content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{contentStats.text}</span>
                  <Badge variant="outline" className="text-xs">
                    {((contentStats.text / contentStats.total) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={(contentStats.text / contentStats.total) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Images</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{contentStats.image}</span>
                  <Badge variant="outline" className="text-xs">
                    {((contentStats.image / contentStats.total) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={(contentStats.image / contentStats.total) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Videos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{contentStats.video}</span>
                  <Badge variant="outline" className="text-xs">
                    {((contentStats.video / contentStats.total) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={(contentStats.video / contentStats.total) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-pink-600" />
                  <span className="text-sm">Audio</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{contentStats.audio}</span>
                  <Badge variant="outline" className="text-xs">
                    {((contentStats.audio / contentStats.total) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={(contentStats.audio / contentStats.total) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Platform Distribution
            </CardTitle>
            <CardDescription>
              Where your content is being optimized for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(platformStats).length > 0 ? (
              Object.entries(platformStats)
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 6)
                .map(([platform, count]) => (
                  <div key={platform} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{platform}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{count as number}</span>
                      <Badge variant="outline" className="text-xs">
                        {(((count as number) / contentStats.total) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No platform data available yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Insights
          </CardTitle>
          <CardDescription>
            AI-powered analysis of your content performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Content Strengths</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    High Engagement
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Your visual content performs 23% above average
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Strong CTR
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Text content drives excellent click-through rates
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Brand Consistency
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    95% brand alignment across all content
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Optimization Opportunities</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Video Content
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Increase video content for better engagement
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    A/B Testing
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Test more variations for optimization
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-cyan-600 border-cyan-200">
                    Mobile Optimization
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Optimize content for mobile platforms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest content generation activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentContent.slice(0, 5).map((content, index) => {
              const contentTypeIcons = {
                TEXT: FileText,
                IMAGE: ImageIcon,
                VIDEO: Video,
                AUDIO: Music,
              }
              
              const IconComponent = contentTypeIcons[content.type as keyof typeof contentTypeIcons] || FileText

              return (
                <div key={content.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    content.type === 'TEXT' ? 'bg-blue-100 text-blue-600' :
                    content.type === 'IMAGE' ? 'bg-emerald-100 text-emerald-600' :
                    content.type === 'VIDEO' ? 'bg-orange-100 text-orange-600' :
                    'bg-pink-100 text-pink-600'
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{content.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {content.project.productName} • {format(new Date(content.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {content.type}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
