'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Image,
  Video,
  Music,
  MessageSquare,
  Globe,
  Target,
  Wand2,
  Settings,
  RefreshCw,
} from 'lucide-react'
import { ContentGenerationSchema } from '@/lib/validations'
import { z } from 'zod'

const contentTypes = [
  { 
    id: 'TEXT', 
    label: 'Text Content', 
    icon: FileText,
    description: 'Blog posts, articles, social media captions',
    subcategories: ['Blog Article', 'Social Media Post', 'Product Description', 'Email Content', 'Ad Copy']
  },
  { 
    id: 'IMAGE', 
    label: 'Visual Content', 
    icon: Image,
    description: 'Graphics, illustrations, marketing visuals',
    subcategories: ['Social Media Graphic', 'Blog Header', 'Product Image', 'Ad Banner', 'Infographic']
  },
  { 
    id: 'VIDEO', 
    label: 'Video Content', 
    icon: Video,
    description: 'Video scripts, storyboards, video concepts',
    subcategories: ['Video Script', 'Storyboard', 'Video Concept', 'YouTube Description', 'Video Ad Script']
  },
  { 
    id: 'AUDIO', 
    label: 'Audio Content', 
    icon: Music,
    description: 'Podcast scripts, voiceover scripts',
    subcategories: ['Podcast Script', 'Voiceover Script', 'Audio Ad Script', 'Radio Commercial']
  },
]

const toneOptions = [
  'Professional', 'Casual', 'Friendly', 'Authoritative', 'Playful', 'Sophisticated',
  'Energetic', 'Calm', 'Humorous', 'Inspirational', 'Educational', 'Conversational'
]

const lengthOptions = [
  { value: 'short', label: 'Short', description: 'Concise and to the point' },
  { value: 'medium', label: 'Medium', description: 'Balanced length with good detail' },
  { value: 'long', label: 'Long', description: 'Comprehensive and detailed' },
]

interface Project {
  id: string
  name: string
  productName: string
  productDescription: string
  industry: string
  targetAudience: string
  toneStyle: string
  primaryColor: string
  secondaryColor: string | null
}

interface ContentGenerationFormProps {
  project: Project
}

const generationSchema = ContentGenerationSchema.extend({
  subcategory: z.string().optional(),
  tone: z.string().optional(),
  length: z.string().optional(),
  keywords: z.string().optional(),
  callToAction: z.string().optional(),
  creativityLevel: z.number().min(0).max(100).optional(),
})

type GenerationFormData = z.infer<typeof generationSchema>

export function ContentGenerationForm({ project }: ContentGenerationFormProps) {
  const [selectedType, setSelectedType] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const router = useRouter()

  const form = useForm<GenerationFormData>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      type: 'TEXT',
      title: '',
      description: '',
      prompt: '',
      subcategory: '',
      tone: project.toneStyle,
      length: 'medium',
      keywords: '',
      callToAction: '',
      creativityLevel: 70,
      parameters: {},
    },
  })

  const watchedType = form.watch('type')
  const selectedTypeData = contentTypes.find(t => t.id === watchedType)

  const onSubmit = async (data: GenerationFormData) => {
    setIsGenerating(true)
    
    try {
      const response = await fetch(`/api/projects/${project.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          parameters: {
            ...data.parameters,
            tone: data.tone,
            length: data.length,
            keywords: data.keywords,
            callToAction: data.callToAction,
            creativityLevel: data.creativityLevel,
            subcategory: data.subcategory,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const result = await response.json()
      toast.success('Content generation started!')
      router.push(`/dashboard/projects/${project.id}`)
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to start content generation. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePromptSuggestion = () => {
    const suggestions = {
      'TEXT': [
        `Write a ${form.getValues('length')} blog post about ${project.productName} for ${project.targetAudience}`,
        `Create social media content promoting ${project.productName} in the ${project.industry} industry`,
        `Draft product descriptions for ${project.productName} targeting ${project.targetAudience}`,
      ],
      'IMAGE': [
        `Design a modern social media graphic for ${project.productName} using ${project.primaryColor}`,
        `Create a professional header image for a blog about ${project.productName}`,
        `Design an infographic showing the benefits of ${project.productName}`,
      ],
      'VIDEO': [
        `Write a script for a 60-second promotional video about ${project.productName}`,
        `Create a storyboard for an explainer video about ${project.productName}`,
        `Draft a YouTube video description for content about ${project.productName}`,
      ],
      'AUDIO': [
        `Write a podcast script discussing ${project.productName} for ${project.targetAudience}`,
        `Create a voiceover script for a commercial about ${project.productName}`,
        `Draft a radio ad script promoting ${project.productName}`,
      ],
    }

    const typeSuggestions = suggestions[watchedType as keyof typeof suggestions] || suggestions.TEXT
    const randomSuggestion = typeSuggestions[Math.floor(Math.random() * typeSuggestions.length)]
    form.setValue('prompt', randomSuggestion)
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
          <h1 className="text-3xl font-bold text-foreground">Generate Content</h1>
          <p className="text-muted-foreground">
            Create AI-powered marketing content for {project.name}
          </p>
        </div>
      </div>

      {/* Project Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Product:</span>
              <p className="text-muted-foreground">{project.productName}</p>
            </div>
            <div>
              <span className="font-medium">Industry:</span>
              <p className="text-muted-foreground">{project.industry}</p>
            </div>
            <div>
              <span className="font-medium">Audience:</span>
              <p className="text-muted-foreground">{project.targetAudience}</p>
            </div>
            <div>
              <span className="font-medium">Tone:</span>
              <p className="text-muted-foreground">{project.toneStyle}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Content Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Content Type</CardTitle>
              <CardDescription>
                Choose the type of content you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {contentTypes.map((type) => {
                          const Icon = type.icon
                          const isSelected = field.value === type.id
                          return (
                            <motion.div
                              key={type.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card
                                className={`cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'ring-2 ring-primary bg-primary/5' 
                                    : 'hover:shadow-md'
                                }`}
                                onClick={() => field.onChange(type.id)}
                              >
                                <CardContent className="p-4 text-center space-y-2">
                                  <Icon className={`h-8 w-8 mx-auto ${
                                    isSelected ? 'text-primary' : 'text-muted-foreground'
                                  }`} />
                                  <h4 className="font-medium">{type.label}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {type.description}
                                  </p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Content Details */}
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>
                Provide details about the content you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Summer Sale Announcement" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A descriptive title for your content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedTypeData && (
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedTypeData.subcategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this content should accomplish..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional context about the content's purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span>Generation Prompt</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generatePromptSuggestion}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Suggest
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe exactly what you want the AI to create..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about what you want the AI to generate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Advanced Settings</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {showAdvanced ? 'Hide' : 'Show'} Advanced
                </Button>
              </CardTitle>
            </CardHeader>
            {showAdvanced && (
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone Override</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Use project default" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {toneOptions.map((tone) => (
                              <SelectItem key={tone} value={tone}>
                                {tone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Override the project's default tone
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Length</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {lengthOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {option.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="keyword1, keyword2, keyword3"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords to include in the content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="callToAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call to Action (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Sign up today, Learn more, Shop now"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Specific action you want readers to take
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="creativityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creativity Level: {field.value}%</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={10}
                          value={[field.value || 70]}
                          onValueChange={(values) => field.onChange(values[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>
                        Lower values are more conservative, higher values are more creative
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/projects/${project.id}`}>
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={isGenerating} className="min-w-[160px]">
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Generating...
                </div>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
