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
import { Textarea } from '@/components/ui/textarea'
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
  Download,
  Copy,
  Share,
  MoreVertical,
  FileText,
  Image,
  Video,
  Music,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'

interface GeneratedContent {
  id: string
  type: string
  title: string
  description: string | null
  content: string | null
  fileUrl: string | null
  fileName: string | null
  status: string
  prompt: string | null
  aiModel: string | null
  parameters: any
  createdAt: Date
  updatedAt: Date
  project: {
    id: string
    name: string
    productName: string
    industry: string
    targetAudience: string
    toneStyle: string
    primaryColor: string
    secondaryColor: string | null
  }
}

interface ContentDetailViewProps {
  content: GeneratedContent
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

const statusLabels = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
}

export function ContentDetailView({ content }: ContentDetailViewProps) {
  const [activeTab, setActiveTab] = useState('content')
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null)

  const Icon = contentTypeIcons[content.type as keyof typeof contentTypeIcons] || FileText

  const copyToClipboard = async () => {
    if (content.content) {
      try {
        await navigator.clipboard.writeText(content.content)
        toast.success('Content copied to clipboard!')
      } catch (error) {
        console.error('Failed to copy:', error)
        toast.error('Failed to copy content')
      }
    }
  }

  const downloadContent = () => {
    if (content.content) {
      const blob = new Blob([content.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Content downloaded!')
    }
  }

  const regenerateContent = async () => {
    try {
      const response = await fetch(`/api/projects/${content.project.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: content.type,
          title: content.title,
          description: content.description,
          prompt: content.prompt,
          parameters: content.parameters,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate content')
      }

      toast.success('Content regeneration started!')
    } catch (error) {
      console.error('Error regenerating content:', error)
      toast.error('Failed to regenerate content')
    }
  }

  const submitFeedback = async (type: 'positive' | 'negative') => {
    setFeedback(type)
    toast.success(`Feedback submitted! This helps improve our AI models.`)
    // In production, you would send this feedback to your analytics service
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/projects/${content.project.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold text-foreground">{content.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{content.project.name}</span>
            <span>•</span>
            <span>{content.type}</span>
            <span>•</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusColors[content.status as keyof typeof statusColors]}`} />
              <span>{statusLabels[content.status as keyof typeof statusLabels]}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {content.status === 'COMPLETED' && (
            <>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadContent}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={regenerateContent}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Generated Content
                </CardTitle>
                {content.status === 'COMPLETED' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Was this helpful?</span>
                    <Button
                      variant={feedback === 'positive' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => submitFeedback('positive')}
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={feedback === 'negative' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => submitFeedback('negative')}
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              {content.description && (
                <CardDescription>{content.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {content.status === 'PENDING' && (
                <div className="text-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Generation Pending</h4>
                  <p className="text-muted-foreground">
                    Your content is queued for generation. This may take a few moments.
                  </p>
                </div>
              )}

              {content.status === 'PROCESSING' && (
                <div className="text-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Generating Content</h4>
                  <p className="text-muted-foreground">
                    AI is creating your content. Please wait...
                  </p>
                </div>
              )}

              {content.status === 'FAILED' && (
                <div className="text-center py-12">
                  <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Generation Failed</h4>
                  <p className="text-muted-foreground mb-4">
                    There was an error generating your content. Please try again.
                  </p>
                  <Button onClick={regenerateContent}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Generation
                  </Button>
                </div>
              )}

              {content.status === 'COMPLETED' && content.content && (
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={content.content}
                      readOnly
                      className="min-h-[400px] font-mono text-sm resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Generated {formatDistanceToNow(new Date(content.createdAt))} ago
                      {content.aiModel && ` using ${content.aiModel}`}
                    </span>
                    <span>{content.content.length} characters</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generation Prompt</CardTitle>
              <CardDescription>
                The prompt used to generate this content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {content.prompt ? (
                <div className="space-y-4">
                  <Textarea
                    value={content.prompt}
                    readOnly
                    className="min-h-[200px] resize-none"
                  />
                  <div className="text-sm text-muted-foreground">
                    This prompt was used with the {content.aiModel || 'AI model'} to generate the content above.
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No prompt available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generation Settings</CardTitle>
              <CardDescription>
                Parameters used for this content generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Content Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="secondary">{content.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">AI Model:</span>
                        <span>{content.aiModel || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={content.status === 'COMPLETED' ? 'default' : 'secondary'}>
                          {statusLabels[content.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Project Context</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Product:</span>
                        <span>{content.project.productName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Industry:</span>
                        <span>{content.project.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Audience:</span>
                        <span>{content.project.targetAudience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tone:</span>
                        <span>{content.project.toneStyle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {content.parameters && Object.keys(content.parameters).length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3">Advanced Parameters</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {Object.entries(content.parameters).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Content History
              </CardTitle>
              <CardDescription>
                Timeline of this content's generation process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Content Generated</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(content.updatedAt))} ago
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI successfully generated the content based on your prompt
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Generation Started</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(content.createdAt))} ago
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Content generation request was submitted to the AI model
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
