'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  ArrowLeft,
  Save,
  Trash2,
  Building,
  Palette,
  Users,
  MessageSquare,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ProjectSchema, type ProjectInput } from '@/lib/validations'
import { ColorPicker } from '@/components/ui/color-picker'

const industries = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Entertainment',
  'Food & Beverage', 'Fashion', 'Real Estate', 'Automotive', 'Travel', 'Sports',
  'Non-Profit', 'B2B Services', 'Consumer Goods', 'Other'
]

const audienceTypes = [
  'Young Adults (18-24)', 'Millennials (25-40)', 'Gen X (41-56)', 'Baby Boomers (57+)',
  'Professionals', 'Students', 'Parents', 'Entrepreneurs', 'Small Business Owners',
  'Enterprise Decision Makers', 'Consumers', 'Other'
]

const toneStyles = [
  'Professional', 'Casual', 'Friendly', 'Authoritative', 'Playful', 'Sophisticated',
  'Energetic', 'Calm', 'Humorous', 'Inspirational', 'Educational', 'Conversational'
]

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
}

interface EditProjectFormProps {
  project: Project
}

export function EditProjectForm({ project }: EditProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const form = useForm<ProjectInput>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || '',
      productName: project.productName,
      productDescription: project.productDescription,
      industry: project.industry,
      targetAudience: project.targetAudience,
      toneStyle: project.toneStyle,
      primaryColor: project.primaryColor,
      secondaryColor: project.secondaryColor || '',
      logoUrl: project.logoUrl || '',
    },
  })

  const onSubmit = async (data: ProjectInput) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      toast.success('Project updated successfully!')
      router.push(`/dashboard/projects/${project.id}`)
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Failed to update project. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      toast.success('Project deleted successfully!')
      router.push('/dashboard/projects')
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/projects/${project.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
          <p className="text-muted-foreground">
            Update your project settings and brand information
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Update your project name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Summer Campaign 2024" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your project a memorable name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this project is about..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide context about your project goals and objectives
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Product Information
              </CardTitle>
              <CardDescription>
                Details about your product or brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Acme Corporation" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the product or brand you're marketing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Brand Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product or brand..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What does your product do? What makes it unique?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us tailor content for your market
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Audience & Messaging */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Audience & Messaging
              </CardTitle>
              <CardDescription>
                Define your target audience and communication style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your target audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {audienceTypes.map((audience) => (
                          <SelectItem key={audience} value={audience}>
                            {audience}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Who are you trying to reach with your content?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toneStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone & Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your brand tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {toneStyles.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How should your brand sound in communications?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Brand Style */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Brand Style
              </CardTitle>
              <CardDescription>
                Visual identity and brand colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Brand Color</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Your main brand color
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color (Optional)</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Supporting brand color
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/logo.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Link to your brand logo for visual content generation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project
                    and all associated generated content.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Project'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/projects/${project.id}`}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
