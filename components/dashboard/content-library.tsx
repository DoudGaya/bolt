'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Copy, 
  Edit,
  Trash2,
  Star,
  Clock,
  Tag,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'

interface ContentLibraryProps {
  projects: any[]
  generatedContent: any[]
}

const contentTypeIcons = {
  TEXT: FileText,
  IMAGE: ImageIcon,
  VIDEO: Video,
  AUDIO: Music,
}

const contentTypeColors = {
  TEXT: 'text-blue-600 bg-blue-100',
  IMAGE: 'text-emerald-600 bg-emerald-100',
  VIDEO: 'text-orange-600 bg-orange-100',
  AUDIO: 'text-pink-600 bg-pink-100',
}

export function ContentLibrary({ projects, generatedContent }: ContentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredContent = useMemo(() => {
    let filtered = generatedContent

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(content => 
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.project.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by content type
    if (selectedType !== 'all') {
      filtered = filtered.filter(content => content.type === selectedType)
    }

    // Filter by project
    if (selectedProject !== 'all') {
      filtered = filtered.filter(content => content.projectId === selectedProject)
    }

    // Sort content
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'project':
        filtered.sort((a, b) => a.project.name.localeCompare(b.project.name))
        break
    }

    return filtered
  }, [generatedContent, searchQuery, selectedType, selectedProject, sortBy])

  const handleCopyContent = async (content: string) => {
    await navigator.clipboard.writeText(content)
    // toast('Content copied to clipboard!')
  }

  const ContentCard = ({ content }: { content: any }) => {
    const IconComponent = contentTypeIcons[content.type as keyof typeof contentTypeIcons]
    const typeColor = contentTypeColors[content.type as keyof typeof contentTypeColors]

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${typeColor}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{content.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {content.project.productName}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {content.type}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Content Preview */}
            <div className="mb-4">
              {content.type === 'IMAGE' && content.fileUrl ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={content.fileUrl}
                    alt={content.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : content.type === 'VIDEO' ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center">
                  <Video className="h-8 w-8 text-white" />
                  <span className="text-white text-sm ml-2">Video Content</span>
                </div>
              ) : content.type === 'AUDIO' ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <Music className="h-8 w-8 text-white" />
                  <span className="text-white text-sm ml-2">Audio Content</span>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 h-32 overflow-hidden">
                  <p className="text-sm text-gray-700 line-clamp-5">
                    {content.content?.substring(0, 150)}...
                  </p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{format(new Date(content.createdAt), 'MMM d, yyyy')}</span>
                </div>
                {content.metadata?.platform && (
                  <div className="flex items-center space-x-1">
                    <Tag className="h-3 w-3" />
                    <span>{content.metadata.platform}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{content.title}</DialogTitle>
                      <DialogDescription>
                        Generated on {format(new Date(content.createdAt), 'MMMM d, yyyy')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {content.type === 'IMAGE' && content.fileUrl ? (
                        <div className="relative w-full h-96 rounded-lg overflow-hidden">
                          <Image
                            src={content.fileUrl}
                            alt={content.title}
                            fill
                            className="object-contain"
                            sizes="100vw"
                          />
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-sm">
                          {content.content}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {content.content && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleCopyContent(content.content)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}

                {content.fileUrl && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                    <a href={content.fileUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="IMAGE">Images</SelectItem>
                  <SelectItem value="VIDEO">Videos</SelectItem>
                  <SelectItem value="AUDIO">Audio</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredContent.length} of {generatedContent.length} items
          </p>
        </div>

        <AnimatePresence mode="wait">
          {filteredContent.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredContent.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No content found</p>
              <p className="text-muted-foreground">
                Try adjusting your filters or create some new content.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
