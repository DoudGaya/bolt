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
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
  AlertTriangle
} from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ContentPreviewModal } from './content-preview-modal'
import { deleteGeneratedContent } from '@/actions/content-management'
import { useToast } from '@/hooks/use-toast'

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
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirmContent, setDeleteConfirmContent] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

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
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    })
  }

  const handleDeleteContent = async (content: any) => {
    setIsDeleting(true)
    try {
      const result = await deleteGeneratedContent(content.id)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // The page will refresh due to revalidatePath
        window.location.reload()
      } else {
        toast({
          title: "Error", 
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
      setDeleteConfirmContent(null)
    }
  }

  const openPreviewModal = (content: any) => {
    setSelectedContent(content)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedContent(null)
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
        <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden group cursor-pointer"
              onClick={() => openPreviewModal(content)}>
          {/* Content Preview - fills most of the card */}
          <div className="relative h-64 overflow-hidden">
            {/* Type icon overlay */}
            <div className="absolute top-3 left-3 z-10">
              <div className={`p-2 rounded-lg backdrop-blur-sm ${typeColor.replace('bg-', 'bg-opacity-90 bg-')}`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </div>

            {/* Badge overlay */}
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="secondary" className="backdrop-blur-sm bg-white/90">
                {content.type}
              </Badge>
            </div>

            {/* Content Preview */}
            {content.type === 'IMAGE' && content.fileUrl ? (
              <div className="relative w-full h-full bg-gray-100">
                <Image
                  src={content.fileUrl}
                  alt={content.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : content.type === 'VIDEO' ? (
              <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-12 w-12 mx-auto mb-3 opacity-80" />
                  <p className="text-sm font-medium">Video Content</p>
                  <p className="text-xs opacity-70 mt-1">Click to preview</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ) : content.type === 'AUDIO' ? (
              <div className="relative w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
                <div className="text-center text-white">
                  <Music className="h-12 w-12 mx-auto mb-3 opacity-90" />
                  <p className="text-sm font-medium">Audio Content</p>
                  <p className="text-xs opacity-80 mt-1">Click to play</p>
                </div>
                {/* Animated audio waves with stable heights */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {[24, 32, 28, 36, 30].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-white/60 rounded-full animate-pulse"
                      style={{
                        height: `${height}px`,
                        animationDelay: `${i * 200}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 overflow-hidden">
                <div className="h-full overflow-hidden">
                  <div className="text-gray-700 text-sm leading-relaxed line-clamp-8">
                    {content.content?.substring(0, 300).split('\n').map((line: string, index: number) => (
                      <p key={index} className="mb-1">{line}</p>
                    ))}
                    {content.content?.length > 300 && (
                      <p className="text-gray-500 font-medium">...</p>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-50 to-transparent" />
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full">
                  <Eye className="h-6 w-6 text-gray-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1 mb-1">{content.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {content.project.productName}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{format(new Date(content.createdAt), 'MMM d')}</span>
                </div>
                {content.metadata?.platform && (
                  <div className="flex items-center space-x-1">
                    <Tag className="h-3 w-3" />
                    <span className="truncate max-w-16">{content.metadata.platform}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-1">
                {content.content && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyContent(content.content)
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}

                {content.fileUrl && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a href={content.fileUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteConfirmContent(content)
                  }}
                >
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
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
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

      {/* Content Preview Modal */}
      {selectedContent && (
        <ContentPreviewModal
          content={selectedContent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmContent} onOpenChange={() => setDeleteConfirmContent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Delete Content</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirmContent?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmContent(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmContent && handleDeleteContent(deleteConfirmContent)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
