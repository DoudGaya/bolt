'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  Download,
  Eye,
  Palette,
  Target,
  Users,
  Building,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  MessageSquare,
  Globe,
  Sparkles,
} from 'lucide-react'

interface GeneratedContent {
  id: string
  type: string
  title: string
  description: string | null
  content: string | null
  fileUrl: string | null
  fileName: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

interface Project {
  id: string
  name: string
  description: string | null
  productName: string
  productDescription: string
  industry: string
  targetAudience: string
  toneStyle: string
  primaryColor: string
  secondaryColor: string | null
  logoUrl: string | null
  createdAt: Date
  updatedAt: Date
  generatedContent: GeneratedContent[]
  _count: {
    generatedContent: number
  }
}

interface ProjectDetailViewProps {
  project: Project
}

const contentTypeIcons = {
  TEXT: FileText,
  IMAGE: Image,
  VIDEO: Video,
  AUDIO: Music,
}

const statusColors = {
  PENDING: 'bg-yellow-500',
  PROCESSING: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
  FAILED: 'bg-red-500',
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const contentByType = project.generatedContent.reduce((acc, content) => {
    if (!acc[content.type]) {
      acc[content.type] = []
    }
    acc[content.type].push(content)
    return acc
  }, {} as Record<string, GeneratedContent[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/projects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          <p className="text-muted-foreground">
            {project.productName} • {project.industry}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/projects/${project.id}/generate`}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Content
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/projects/${project.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content ({project._count.generatedContent})</TabsTrigger>
          <TabsTrigger value="brand">Brand Guide</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Project Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{project.description}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium mb-2">Product Description</h4>
                    <p className="text-muted-foreground">{project.productDescription}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Target Audience
                      </h4>
                      <Badge variant="secondary">{project.targetAudience}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Tone & Style
                      </h4>
                      <Badge variant="secondary">{project.toneStyle}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Recent Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {project.generatedContent.length === 0 ? (
                    <div className="text-center py-8">
                      <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No content generated yet</p>
                      <Button asChild className="mt-4">
                        <Link href={`/dashboard/projects/${project.id}/generate`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Generate First Content
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {project.generatedContent.slice(0, 5).map((content) => {
                        const Icon = contentTypeIcons[content.type as keyof typeof contentTypeIcons] || FileText
                        return (
                          <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-muted rounded-md">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <h5 className="font-medium">{content.title}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {content.type} • {formatDistanceToNow(new Date(content.createdAt))} ago
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${statusColors[content.status as keyof typeof statusColors]}`} />
                              <span className="text-sm text-muted-foreground capitalize">
                                {content.status.toLowerCase()}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                      {project.generatedContent.length > 5 && (
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab('content')}>
                          View All Content ({project._count.generatedContent})
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Content</span>
                      <span className="font-medium">{project._count.generatedContent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-medium">
                        {formatDistanceToNow(new Date(project.createdAt))} ago
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium">
                        {formatDistanceToNow(new Date(project.updatedAt))} ago
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Brand Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Primary Color</span>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-md border-2 border-border"
                        style={{ backgroundColor: project.primaryColor }}
                      />
                      <span className="font-mono text-sm">{project.primaryColor}</span>
                    </div>
                  </div>
                  {project.secondaryColor && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Secondary Color</span>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-md border-2 border-border"
                          style={{ backgroundColor: project.secondaryColor }}
                        />
                        <span className="font-mono text-sm">{project.secondaryColor}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Generated Content</h3>
            <Button asChild>
              <Link href={`/dashboard/projects/${project.id}/generate`}>
                <Plus className="h-4 w-4 mr-2" />
                Generate New Content
              </Link>
            </Button>
          </div>

          {Object.keys(contentByType).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">No content generated yet</h4>
                <p className="text-muted-foreground mb-6">
                  Start creating AI-powered marketing content for your project.
                </p>
                <Button asChild>
                  <Link href={`/dashboard/projects/${project.id}/generate`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Content
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(contentByType).map(([type, contents]) => {
                const Icon = contentTypeIcons[type as keyof typeof contentTypeIcons] || FileText
                return (
                  <Card key={type}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className="h-5 w-5" />
                        {type} Content ({contents.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contents.map((content) => (
                          <motion.div
                            key={content.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <h5 className="font-medium line-clamp-1">{content.title}</h5>
                              <div className={`w-2 h-2 rounded-full ${statusColors[content.status as keyof typeof statusColors]}`} />
                            </div>
                            {content.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {content.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{formatDistanceToNow(new Date(content.createdAt))} ago</span>
                              <span className="capitalize">{content.status.toLowerCase()}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1" asChild>
                                <Link href={`/dashboard/projects/${project.id}/content/${content.id}`}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Link>
                              </Button>
                              {content.fileUrl && (
                                <Button variant="outline" size="sm">
                                  <Download className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="brand" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Guidelines</CardTitle>
              <CardDescription>
                These settings influence how AI generates content for your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Product Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {project.productName}</div>
                      <div><strong>Industry:</strong> {project.industry}</div>
                      <div><strong>Description:</strong> {project.productDescription}</div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Audience & Messaging</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Target Audience:</strong> {project.targetAudience}</div>
                      <div><strong>Tone & Style:</strong> {project.toneStyle}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Visual Identity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-border"
                          style={{ backgroundColor: project.primaryColor }}
                        />
                        <div>
                          <div className="font-medium">Primary Color</div>
                          <div className="text-sm text-muted-foreground font-mono">{project.primaryColor}</div>
                        </div>
                      </div>
                      {project.secondaryColor && (
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg border-2 border-border"
                            style={{ backgroundColor: project.secondaryColor }}
                          />
                          <div>
                            <div className="font-medium">Secondary Color</div>
                            <div className="text-sm text-muted-foreground font-mono">{project.secondaryColor}</div>
                          </div>
                        </div>
                      )}
                      {project.logoUrl && (
                        <div>
                          <div className="font-medium mb-2">Logo</div>
                          <div className="text-sm text-muted-foreground break-all">{project.logoUrl}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Analytics Coming Soon</h4>
              <p className="text-muted-foreground">
                Track performance metrics and insights for your generated content.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
