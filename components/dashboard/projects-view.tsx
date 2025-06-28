'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  FolderOpen,
  Calendar,
  Sparkles,
} from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string | null
  productName: string
  industry: string
  targetAudience: string
  createdAt: Date
  updatedAt: Date
  _count: {
    generatedContent: number
  }
  generatedContent: Array<{
    id: string
    type: string
    title: string
    status: string
    createdAt: Date
  }>
}

interface ProjectsViewProps {
  projects: Project[]
}

export function ProjectsView({ projects }: ProjectsViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest')
  const [filterBy, setFilterBy] = useState<string>('all')

  const industries = Array.from(new Set(projects.map(p => p.industry)))

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.industry.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterBy === 'all' || project.industry === filterBy
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            Manage your marketing projects and generated content
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest' | 'name') => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map(industry => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">No projects yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Create your first marketing project to get started with AI-powered content generation.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Search className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg leading-6">{project.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {project.productName}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/projects/${project.id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
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
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{project.industry}</Badge>
                    <Badge variant="outline">{project.targetAudience}</Badge>
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      <span>{project._count.generatedContent} content items</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Updated {formatDistanceToNow(new Date(project.updatedAt))} ago</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      View Project
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
