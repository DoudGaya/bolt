'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Target,
  Palette,
  Volume2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  TrendingUp,
  Settings,
  Wand2,
  Lightbulb,
  BarChart3,
  Globe,
  Users,
  MessageSquare,
  Play,
  Pause,
  Download,
  RefreshCw,
  Brain,
  Rocket,
  Eye,
  AlertTriangle,
} from 'lucide-react'
import { generateAdvancedContent, type AdvancedContentGenerationInput } from '@/actions/content-generation'

// Professional content type definitions with enterprise-grade categories
const professionalContentTypes = {
  TEXT: {
    name: 'Text Content',
    icon: FileText,
    color: 'bg-blue-500',
    subcategories: [
      { id: 'blog-article', name: 'Blog Article', description: 'SEO-optimized long-form content for thought leadership', estimatedTime: '3-5 min' },
      { id: 'social-post', name: 'Social Media Post', description: 'Platform-optimized posts that drive engagement', estimatedTime: '1-2 min' },
      { id: 'email-campaign', name: 'Email Campaign', description: 'High-converting email sequences and newsletters', estimatedTime: '2-3 min' },
      { id: 'ad-copy', name: 'Advertisement Copy', description: 'Persuasive copy for paid advertising campaigns', estimatedTime: '1-2 min' },
      { id: 'product-description', name: 'Product Description', description: 'Compelling product details that convert browsers to buyers', estimatedTime: '1-2 min' },
      { id: 'landing-page', name: 'Landing Page Copy', description: 'Conversion-optimized page content and headlines', estimatedTime: '3-4 min' },
      { id: 'press-release', name: 'Press Release', description: 'Professional news announcements for media coverage', estimatedTime: '2-3 min' },
      { id: 'case-study', name: 'Case Study', description: 'Detailed success stories with metrics and testimonials', estimatedTime: '4-5 min' },
      { id: 'white-paper', name: 'White Paper', description: 'Authoritative research documents and industry insights', estimatedTime: '5-7 min' },
    ]
  },
  IMAGE: {
    name: 'Visual Content',
    icon: ImageIcon,
    color: 'bg-purple-500',
    subcategories: [
      { id: 'social-graphic', name: 'Social Media Graphic', description: 'Brand-consistent visuals optimized for each platform', estimatedTime: '2-3 min' },
      { id: 'blog-header', name: 'Blog Header Image', description: 'Eye-catching featured images that boost engagement', estimatedTime: '2-3 min' },
      { id: 'product-image', name: 'Product Visualization', description: 'Professional product presentations and mockups', estimatedTime: '3-4 min' },
      { id: 'ad-banner', name: 'Advertisement Banner', description: 'High-impact display ads for digital campaigns', estimatedTime: '2-3 min' },
      { id: 'infographic', name: 'Infographic', description: 'Data visualization and educational content design', estimatedTime: '4-5 min' },
      { id: 'brand-illustration', name: 'Brand Illustration', description: 'Custom illustrations that reinforce brand identity', estimatedTime: '3-4 min' },
      { id: 'logo-concept', name: 'Logo Concept', description: 'Professional logo design concepts and variations', estimatedTime: '3-4 min' },
      { id: 'presentation-slide', name: 'Presentation Graphics', description: 'Professional slides for business presentations', estimatedTime: '2-3 min' },
    ]
  },
  VIDEO: {
    name: 'Video Content',
    icon: Video,
    color: 'bg-red-500',
    subcategories: [
      { id: 'explainer-video', name: 'Explainer Video Script', description: 'Clear, engaging scripts that simplify complex concepts', estimatedTime: '3-4 min' },
      { id: 'social-video', name: 'Social Media Video', description: 'Platform-specific video content and concepts', estimatedTime: '2-3 min' },
      { id: 'product-demo', name: 'Product Demo Script', description: 'Compelling product demonstrations and walkthroughs', estimatedTime: '3-4 min' },
      { id: 'testimonial-video', name: 'Customer Testimonial', description: 'Authentic customer success story frameworks', estimatedTime: '2-3 min' },
      { id: 'brand-story', name: 'Brand Story Video', description: 'Emotional brand narratives that build connection', estimatedTime: '4-5 min' },
      { id: 'tutorial-video', name: 'Tutorial Content', description: 'Educational how-to videos and training content', estimatedTime: '3-4 min' },
      { id: 'ad-video', name: 'Video Advertisement', description: 'High-converting video ads for multiple platforms', estimatedTime: '3-4 min' },
      { id: 'webinar-script', name: 'Webinar Script', description: 'Professional presentation scripts for lead generation', estimatedTime: '5-6 min' },
    ]
  },
  AUDIO: {
    name: 'Audio Content',
    icon: Music,
    color: 'bg-green-500',
    subcategories: [
      { id: 'podcast-script', name: 'Podcast Episode', description: 'Engaging podcast content and interview frameworks', estimatedTime: '3-4 min' },
      { id: 'voiceover', name: 'Voiceover Script', description: 'Professional narration for videos and presentations', estimatedTime: '2-3 min' },
      { id: 'audio-ad', name: 'Audio Advertisement', description: 'Radio and streaming platform advertisements', estimatedTime: '2-3 min' },
      { id: 'brand-jingle', name: 'Brand Audio Logo', description: 'Memorable audio branding and sonic identity', estimatedTime: '3-4 min' },
      { id: 'interview-questions', name: 'Interview Questions', description: 'Strategic questions for thought leadership interviews', estimatedTime: '2-3 min' },
      { id: 'webinar-audio', name: 'Webinar Audio Script', description: 'Professional audio content for online events', estimatedTime: '4-5 min' },
    ]
  },
}

// Advanced generation schema with professional validation
const advancedGenerationSchema = z.object({
  contentType: z.string().min(1, 'Please select a content type'),
  contentSubtype: z.string().min(1, 'Please select a content subcategory'),
  requirements: z.object({
    goal: z.string().min(20, 'Please provide a detailed goal (minimum 20 characters)'),
    platform: z.string().default(''),
    contentLength: z.enum(['short', 'medium', 'long']).default('medium'),
    keyMessages: z.array(z.string()).default([]),
    callToAction: z.string().default(''),
    additionalContext: z.string().default(''),
  }),
  visualRequirements: z.object({
    style: z.string().default('professional'),
    mood: z.string().default('engaging'),
    composition: z.string().default('dynamic'),
    dimensions: z.enum(['1024x1024', '1792x1024', '1024x1792']).default('1024x1024'),
  }).optional(),
  audioRequirements: z.object({
    duration: z.string().default('60 seconds'),
    voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).default('nova'),
    speed: z.number().min(0.25).max(4.0).default(1.0),
    purpose: z.string().default(''),
  }).optional(),
  optimization: z.object({
    seoKeywords: z.array(z.string()).default([]),
    competitorAnalysis: z.string().default(''),
    seasonality: z.string().default(''),
    abTestVariations: z.number().min(1).max(5).default(1),
    accessibilityNeeds: z.boolean().default(false),
  }).default({}),
})

// Enterprise platform specifications
const enterprisePlatforms = [
  { id: 'linkedin', name: 'LinkedIn', specs: '1200x627px', audience: 'B2B Professionals', engagement: 'High' },
  { id: 'facebook', name: 'Facebook', specs: '1200x630px', audience: 'General Consumer', engagement: 'Medium' },
  { id: 'instagram', name: 'Instagram', specs: '1080x1080px', audience: 'Visual-First Users', engagement: 'High' },
  { id: 'twitter', name: 'Twitter/X', specs: '1200x675px', audience: 'News & Discussion', engagement: 'Medium' },
  { id: 'youtube', name: 'YouTube', specs: '1280x720px', audience: 'Video Content Viewers', engagement: 'High' },
  { id: 'tiktok', name: 'TikTok', specs: '1080x1920px', audience: 'Young Demographics', engagement: 'Very High' },
  { id: 'website', name: 'Website', specs: 'Responsive', audience: 'Targeted Visitors', engagement: 'Variable' },
  { id: 'email', name: 'Email Marketing', specs: '600px width', audience: 'Subscribers', engagement: 'High' },
  { id: 'print', name: 'Print Media', specs: 'High-DPI', audience: 'Traditional Media', engagement: 'Medium' },
]

const professionalStyles = [
  'Photorealistic', 'Minimalist', 'Corporate', 'Creative', 'Modern', 'Luxury', 
  'Tech-Forward', 'Vintage', 'Bold', 'Elegant', 'Futuristic', 'Hand-crafted'
]

const brandMoods = [
  'Professional', 'Energetic', 'Trustworthy', 'Innovative', 'Sophisticated', 'Approachable',
  'Dynamic', 'Calm', 'Inspiring', 'Confident', 'Warm', 'Authoritative'
]

const voicePersonalities = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and versatile', tone: 'Professional' },
  { id: 'echo', name: 'Echo', description: 'Clear and articulate', tone: 'Corporate' },
  { id: 'fable', name: 'Fable', description: 'Warm storytelling voice', tone: 'Engaging' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative', tone: 'Leadership' },
  { id: 'nova', name: 'Nova', description: 'Bright and friendly', tone: 'Approachable' },
  { id: 'shimmer', name: 'Shimmer', description: 'Smooth and confident', tone: 'Premium' },
]

interface ProfessionalProject {
  id: string
  name: string
  productName: string
  productDescription: string
  industry: string
  targetAudience: string
  toneStyle: string
  primaryColor: string
  secondaryColor?: string
}

interface ProfessionalContentGenerationFormProps {
  project: ProfessionalProject
}

export function ProfessionalContentGenerationForm({ project }: ProfessionalContentGenerationFormProps) {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<keyof typeof professionalContentTypes | ''>('')
  const [selectedSubtype, setSelectedSubtype] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [keyMessageInput, setKeyMessageInput] = useState('')
  const [seoKeywordInput, setSeoKeywordInput] = useState('')

  const form = useForm<z.infer<typeof advancedGenerationSchema>>({
    resolver: zodResolver(advancedGenerationSchema),
    defaultValues: {
      contentType: '',
      contentSubtype: '',
      requirements: {
        goal: '',
        platform: '',
        contentLength: 'medium',
        keyMessages: [],
        callToAction: '',
        additionalContext: '',
      },
      optimization: {
        seoKeywords: [],
        competitorAnalysis: '',
        seasonality: '',
        abTestVariations: 1,
        accessibilityNeeds: false,
      },
      audioRequirements: {
        voice: 'nova',
        speed: 1.0,
        duration: '60 seconds',
        purpose: '',
      },
      visualRequirements: {
        style: 'professional',
        mood: 'engaging',
        composition: 'dynamic',
        dimensions: '1024x1024',
      },
    },
  })

  const watchedType = form.watch('contentType')
  const watchedSubtype = form.watch('contentSubtype')
  const watchedKeyMessages = form.watch('requirements.keyMessages')
  const watchedSeoKeywords = form.watch('optimization.seoKeywords')

  // Check configuration status
  const [configStatus, setConfigStatus] = useState<{
    openai: boolean
    s3: boolean
    message: string
  }>({
    openai: false,
    s3: false,
    message: 'Checking configuration...'
  })

  // Check configuration on component mount
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const response = await fetch('/api/config-status')
        const data = await response.json()
        
        setConfigStatus({
          openai: data.openai,
          s3: data.s3,
          message: data.message
        })
      } catch (error) {
        console.error('Failed to check configuration:', error)
        setConfigStatus({
          openai: false,
          s3: false,
          message: 'Configuration check failed'
        })
      }
    }
    
    checkConfig()
  }, [])

  // Intelligent content suggestions based on project context
  const generateContextualSuggestions = (type: string, subtype: string) => {
    const suggestions = {
      'blog-article': [
        `The Future of ${project.industry}: How ${project.productName} is Leading Innovation`,
        `Ultimate Guide to ${project.productDescription} for ${project.targetAudience}`,
        `5 Ways ${project.productName} Transforms ${project.industry} Operations`,
        `Case Study: How Companies Use ${project.productName} to Drive Growth`,
      ],
      'social-post': [
        `Spotlight ${project.productName} benefits for ${project.targetAudience} with compelling visuals`,
        `Behind-the-scenes content showcasing ${project.productName} development process`,
        `Customer success story featuring measurable results from ${project.productName}`,
        `Industry trend discussion relevant to ${project.targetAudience} with ${project.productName} insights`,
      ],
      'email-campaign': [
        `Welcome series for new ${project.productName} customers with onboarding tips`,
        `Exclusive feature announcement for ${project.productName} with early access offer`,
        `Re-engagement campaign highlighting ${project.productName} success stories`,
        `Product update newsletter showcasing latest ${project.productName} improvements`,
      ],
      'ad-copy': [
        `Performance-driven ad copy highlighting ${project.productName} ROI for ${project.targetAudience}`,
        `Emotional appeal advertisement focusing on ${project.productName} life improvements`,
        `Competitive advantage campaign positioning ${project.productName} vs alternatives`,
        `Limited-time offer advertisement with compelling ${project.productName} value proposition`,
      ],
      'social-graphic': [
        `${project.productName} feature highlight with branded design and key statistics`,
        `Industry insights infographic featuring ${project.productName} data`,
        `Customer testimonial quote graphic with ${project.primaryColor} branding`,
        `Product comparison chart showcasing ${project.productName} advantages`,
      ],
      'explainer-video': [
        `60-second ${project.productName} overview explaining core value proposition`,
        `Problem-solution narrative featuring ${project.productName} benefits`,
        `Step-by-step ${project.productName} workflow demonstration`,
        `Customer journey video showing ${project.productName} impact`,
      ],
      'podcast-script': [
        `Industry expert interview discussing ${project.productName} innovation`,
        `${project.targetAudience} success stories using ${project.productName}`,
        `Future trends in ${project.industry} featuring ${project.productName} insights`,
        `Founder story: Building ${project.productName} to solve real problems`,
      ],
    }
    return suggestions[subtype as keyof typeof suggestions] || [
      `Professional content showcasing ${project.productName} value for ${project.targetAudience}`,
      `Engaging ${project.targetAudience} with ${project.productName} benefits and features`,
      `Industry-leading content positioning ${project.productName} as the solution`,
    ]
  }

  const addKeyMessage = () => {
    if (keyMessageInput.trim()) {
      const currentMessages = form.getValues('requirements.keyMessages') || []
      form.setValue('requirements.keyMessages', [...currentMessages, keyMessageInput.trim()])
      setKeyMessageInput('')
    }
  }

  const removeKeyMessage = (index: number) => {
    const currentMessages = form.getValues('requirements.keyMessages') || []
    form.setValue('requirements.keyMessages', currentMessages.filter((_, i) => i !== index))
  }

  const addSeoKeyword = () => {
    if (seoKeywordInput.trim()) {
      const currentKeywords = form.getValues('optimization.seoKeywords') || []
      form.setValue('optimization.seoKeywords', [...currentKeywords, seoKeywordInput.trim()])
      setSeoKeywordInput('')
    }
  }

  const removeSeoKeyword = (index: number) => {
    const currentKeywords = form.getValues('optimization.seoKeywords') || []
    form.setValue('optimization.seoKeywords', currentKeywords.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: z.infer<typeof advancedGenerationSchema>) => {
    if (!selectedType || !selectedSubtype) {
      toast.error('Please select both content type and subcategory')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    // Realistic progress simulation
    const progressSteps = [
      { step: 'Analyzing project context...', progress: 15 },
      { step: 'Generating advanced prompts...', progress: 30 },
      { step: 'Creating professional content...', progress: 60 },
      { step: 'Optimizing for platform...', progress: 80 },
      { step: 'Finalizing and uploading...', progress: 95 },
    ]

    let currentStep = 0
    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setGenerationProgress(progressSteps[currentStep].progress)
        toast.loading(progressSteps[currentStep].step)
        currentStep++
      }
    }, 800)

    try {
      const input: AdvancedContentGenerationInput = {
        projectId: project.id,
        contentType: selectedType,
        contentSubtype: selectedSubtype,
        requirements: data.requirements,
        visualRequirements: selectedType === 'IMAGE' ? data.visualRequirements : undefined,
        audioRequirements: selectedType === 'AUDIO' ? data.audioRequirements : undefined,
        optimization: data.optimization,
      }

      const result = await generateAdvancedContent(input)

      clearInterval(progressInterval)
      setGenerationProgress(100)

      if (result.success) {
        toast.success('Professional content generated successfully!', {
          description: 'Your content is ready for review and use.',
          duration: 5000,
        })
        
        // Navigate to the generated content with a smooth transition
        setTimeout(() => {
          router.push(`/dashboard/projects/${project.id}/content/${result.content?.id}`)
        }, 1500)
      } else {
        toast.error('Generation failed', {
          description: result.error || 'Please try again with different parameters.',
        })
      }
    } catch (error) {
      clearInterval(progressInterval)
      console.error('Generation error:', error)
      toast.error('Unexpected error occurred', {
        description: 'Please check your connection and try again.',
      })
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress(0)
      }, 2000)
    }
  }

  const currentSuggestions = selectedSubtype ? generateContextualSuggestions(selectedType, selectedSubtype) : []
  const selectedSubcategory = selectedType && selectedSubtype 
    ? professionalContentTypes[selectedType].subcategories.find(sub => sub.id === selectedSubtype)
    : null

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Professional Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </Button>
            <Badge variant="outline" className="text-xs">
              AI-Powered
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Professional Content Studio</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Generate enterprise-grade marketing content with advanced AI optimization for <span className="text-primary font-medium">{project.name}</span>
          </p>
        </div>
        <div className="text-right space-y-2">
          <div className="text-sm text-muted-foreground">Project</div>
          <div className="font-semibold">{project.productName}</div>
          <div className="text-sm text-muted-foreground">{project.industry}</div>
        </div>
      </div>

      {/* Configuration Status */}
      <AnimatePresence>
        {!configStatus.openai && (
          <motion.div
            key="openai-config-warning"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">
                      OpenAI API Key Not Configured
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please configure your OpenAI API key in the settings to enable content generation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {!configStatus.s3 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">
                      S3 Bucket Not Configured
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please configure your S3 bucket settings in the dashboard to enable media uploads.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration Status Alert */}
      {(!configStatus.openai || !configStatus.s3) && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Configuration Notice
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {configStatus.message}
                </p>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${configStatus.openai ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span>OpenAI API {configStatus.openai ? 'Configured' : 'Not Configured'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${configStatus.s3 ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span>S3 Storage {configStatus.s3 ? 'Configured' : 'Not Configured'}</span>
                  </div>
                </div>
                {(!configStatus.openai || !configStatus.s3) && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Missing services will use fallback content. See ENVIRONMENT_SETUP.md for configuration instructions.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Progress */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            key="generation-progress"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary animate-pulse" />
                      <span className="font-medium">Generating Professional Content</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Using advanced AI models to create high-quality, brand-consistent content...
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Content Type Selection */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Content Type Selection
              </CardTitle>
              <CardDescription>
                Choose the type of professional content you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(professionalContentTypes).map(([key, type]) => {
                  const Icon = type.icon
                  const isSelected = selectedType === key
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                            : 'border-border hover:border-primary/50 hover:bg-accent/50'
                        }`}
                        onClick={() => {
                          setSelectedType(key as keyof typeof professionalContentTypes)
                          setSelectedSubtype('')
                          form.setValue('contentType', key)
                          form.setValue('contentSubtype', '')
                        }}
                      >
                        <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${isSelected ? type.color : 'bg-muted'}`} />
                        <Icon className={`h-10 w-10 mb-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {type.subcategories.length} professional formats
                        </p>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1 text-primary text-sm font-medium"
                          >
                            <Zap className="h-3 w-3" />
                            Selected
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Subcategory Selection */}
          <AnimatePresence>
            {selectedType && (
              <motion.div
                key={`subcategory-selection-${selectedType}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Professional {professionalContentTypes[selectedType].name} Formats</span>
                      <Badge variant="secondary">{professionalContentTypes[selectedType].subcategories.length} options</Badge>
                    </CardTitle>
                    <CardDescription>
                      Select the specific format that best matches your marketing objectives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {professionalContentTypes[selectedType].subcategories.map((subcat) => {
                        const isSelected = selectedSubtype === subcat.id
                        return (
                          <motion.div
                            key={subcat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-border hover:border-primary/50 hover:bg-accent/30'
                            }`}
                            onClick={() => {
                              setSelectedSubtype(subcat.id)
                              form.setValue('contentSubtype', subcat.id)
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-base">{subcat.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {subcat.estimatedTime}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {subcat.description}
                            </p>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-3 flex items-center gap-1 text-primary text-sm font-medium"
                              >
                                <Target className="h-3 w-3" />
                                Ready to generate
                              </motion.div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Requirements */}
          <AnimatePresence>
            {selectedSubtype && (
              <motion.div
                key={`content-strategy-${selectedSubtype}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Content Strategy & Requirements
                    </CardTitle>
                    <CardDescription>
                      Define your content objectives and strategic parameters for optimal results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Strategic Brief */}
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="requirements.goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Strategic Content Brief</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your content objectives, target outcomes, key messages, and success metrics..."
                                className="min-h-[120px] text-base leading-relaxed"
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormDescription className="text-sm">
                              Provide comprehensive details about what you want to achieve. Include target audience pain points, desired actions, and competitive positioning.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* AI-Generated Suggestions */}
                      {currentSuggestions.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            <Label className="text-sm font-medium">AI-Generated Content Ideas</Label>
                            <Badge variant="secondary" className="text-xs">Personalized for {project.productName}</Badge>
                          </div>
                          <div className="grid gap-3">
                            {currentSuggestions.map((suggestion, index) => (
                              <motion.div
                                key={`suggestion-${selectedType}-${index}-${(suggestion || '').slice(0, 20).replace(/\s+/g, '-') || 'empty'}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-gradient-to-r from-accent/50 to-accent/20 rounded-lg cursor-pointer hover:from-accent/70 hover:to-accent/30 transition-all duration-200 border border-accent"
                                onClick={() => form.setValue('requirements.goal', suggestion)}
                              >
                                <div className="flex items-start gap-3">
                                  <Rocket className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  <p className="text-sm leading-relaxed">{suggestion}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Strategic Parameters */}
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Platform & Distribution */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Platform & Distribution
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="requirements.platform"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Platform</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select primary platform" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {enterprisePlatforms.map((platform) => (
                                    <SelectItem key={platform.id} value={platform.id}>
                                      <div className="flex flex-col items-start">
                                        <div className="font-medium">{platform.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {platform.specs} • {platform.audience} • {platform.engagement} engagement
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Platform-specific optimization for maximum performance
                              </FormDescription>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="requirements.contentLength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content Depth</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="short">
                                    <div>
                                      <div className="font-medium">Concise</div>
                                      <div className="text-xs text-muted-foreground">Quick impact, high engagement</div>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="medium">
                                    <div>
                                      <div className="font-medium">Balanced</div>
                                      <div className="text-xs text-muted-foreground">Optimal detail and engagement</div>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="long">
                                    <div>
                                      <div className="font-medium">Comprehensive</div>
                                      <div className="text-xs text-muted-foreground">In-depth, authoritative content</div>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Messaging & CTA */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Messaging & Call-to-Action
                        </h3>

                        <FormField
                          control={form.control}
                          name="requirements.callToAction"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Call-to-Action</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Start free trial, Download guide, Schedule demo..."
                                  {...field}
                                  value={field.value ?? ''}
                                />
                              </FormControl>
                              <FormDescription>
                                Specific action you want your audience to take
                              </FormDescription>
                            </FormItem>
                          )}
                        />

                        {/* Key Messages */}
                        <div className="space-y-3">
                          <Label>Key Messages & Value Props</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add key message..."
                              value={keyMessageInput}
                              onChange={(e) => setKeyMessageInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyMessage())}
                            />
                            <Button type="button" variant="outline" onClick={addKeyMessage}>
                              Add
                            </Button>
                          </div>
                          {watchedKeyMessages && watchedKeyMessages.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {watchedKeyMessages.map((message, index) => (
                                <Badge key={`key-message-${index}-${(message || '').slice(0, 15).replace(/\s+/g, '-').toLowerCase() || 'empty'}`} variant="secondary" className="pr-1">
                                  {message}
                                  <button
                                    type="button"
                                    onClick={() => removeKeyMessage(index)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Add 2-5 key points you want emphasized in the content
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Context */}
                    <FormField
                      control={form.control}
                      name="requirements.additionalContext"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Context & Guidelines</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brand guidelines, compliance requirements, specific mentions, style preferences..."
                              className="min-h-[80px]"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormDescription>
                            Any specific requirements, constraints, or additional context for content creation
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Format-Specific Options */}
          <AnimatePresence>
            {selectedSubtype && (
              <motion.div
                key={`format-options-${selectedSubtype}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {/* Visual Content Options */}
                {selectedType === 'IMAGE' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Visual Design Specifications
                      </CardTitle>
                      <CardDescription>
                        Configure visual style and composition for professional brand consistency
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="visualRequirements.style"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Visual Style</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {professionalStyles.map((style) => (
                                    <SelectItem key={style} value={style.toLowerCase()}>
                                      {style}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="visualRequirements.mood"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand Mood</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {brandMoods.map((mood) => (
                                    <SelectItem key={mood} value={mood.toLowerCase()}>
                                      {mood}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="visualRequirements.dimensions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image Dimensions</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1024x1024">
                                    <div>
                                      <div className="font-medium">Square (1:1)</div>
                                      <div className="text-xs text-muted-foreground">Social media posts</div>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="1792x1024">
                                    <div>
                                      <div className="font-medium">Landscape (16:9)</div>
                                      <div className="text-xs text-muted-foreground">Headers, banners</div>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="1024x1792">
                                    <div>
                                      <div className="font-medium">Portrait (9:16)</div>
                                      <div className="text-xs text-muted-foreground">Stories, mobile</div>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="p-4 bg-accent/30 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Eye className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium mb-1">Brand Integration</h4>
                            <p className="text-sm text-muted-foreground">
                              Visual content will automatically incorporate your brand colors ({project.primaryColor}
                              {project.secondaryColor && `, ${project.secondaryColor}`}) and align with your {project.toneStyle} brand personality.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Audio Content Options */}
                {selectedType === 'AUDIO' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5" />
                        Audio Production Specifications
                      </CardTitle>
                      <CardDescription>
                        Configure voice characteristics and audio parameters for professional delivery
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="audioRequirements.voice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Voice Personality</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {voicePersonalities.map((voice) => (
                                    <SelectItem key={voice.id} value={voice.id}>
                                      <div>
                                        <div className="font-medium">{voice.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {voice.description} • {voice.tone}
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="audioRequirements.duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Duration</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 30 seconds, 2 minutes, 5-10 minutes"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Specify desired length for optimal platform performance
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="audioRequirements.speed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Speech Speed: {field.value}x</FormLabel>
                            <FormControl>
                              <Slider
                                min={0.25}
                                max={2.0}
                                step={0.25}
                                value={[field.value || 1.0]}
                                onValueChange={(values) => field.onChange(values[0])}
                                className="w-full"
                              />
                            </FormControl>
                            <FormDescription>
                              Adjust delivery speed for optimal comprehension and engagement
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Optimization */}
          <AnimatePresence>
            {selectedSubtype && (
              <motion.div
                key={`advanced-optimization-${selectedSubtype}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Advanced Optimization Settings
                        </CardTitle>
                        <CardDescription>
                          Fine-tune content for maximum performance and reach
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                      >
                        {showAdvanced ? 'Hide' : 'Show'} Advanced
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        key="advanced-seo-options"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <CardContent className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* SEO & Performance */}
                            <div className="space-y-4">
                              <h4 className="font-medium flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                SEO & Performance
                              </h4>

                              {/* SEO Keywords */}
                              <div className="space-y-3">
                                <Label>Target Keywords</Label>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Add SEO keyword..."
                                    value={seoKeywordInput}
                                    onChange={(e) => setSeoKeywordInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSeoKeyword())}
                                  />
                                  <Button type="button" variant="outline" onClick={addSeoKeyword}>
                                    Add
                                  </Button>
                                </div>
                                {watchedSeoKeywords && watchedSeoKeywords.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {watchedSeoKeywords.map((keyword, index) => (
                                      <Badge key={`seo-keyword-${index}-${(keyword || '').slice(0, 10).replace(/\s+/g, '-') || 'empty'}`} variant="outline" className="pr-1">
                                        {keyword}
                                        <button
                                          type="button"
                                          onClick={() => removeSeoKeyword(index)}
                                          className="ml-1 hover:text-destructive"
                                        >
                                          ×
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <FormField
                                control={form.control}
                                name="optimization.seasonality"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Seasonal Context</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="e.g., Holiday season, Back-to-school, Q4..."
                                        {...field}
                                        value={field.value ?? ''}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Seasonal relevance for timely content
                                    </FormDescription>
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Testing & Analytics */}
                            <div className="space-y-4">
                              <h4 className="font-medium flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Testing & Analytics
                              </h4>

                              <FormField
                                control={form.control}
                                name="optimization.abTestVariations"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>A/B Test Variations: {field.value}</FormLabel>
                                    <FormControl>
                                      <Slider
                                        min={1}
                                        max={5}
                                        step={1}
                                        value={[field.value || 1]}
                                        onValueChange={(values) => field.onChange(values[0])}
                                        className="w-full"
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Generate multiple versions for testing
                                    </FormDescription>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="optimization.competitorAnalysis"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Competitive Intelligence</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Competitor insights, market positioning, differentiation strategies..."
                                        className="min-h-[80px]"
                                        {...field}
                                        value={field.value ?? ''}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Competitive context for positioning
                                    </FormDescription>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="optimization.accessibilityNeeds"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">
                                        Accessibility Optimization
                                      </FormLabel>
                                      <FormDescription>
                                        Ensure content meets WCAG guidelines
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generation Controls */}
          <AnimatePresence>
            {selectedSubtype && (
              <motion.div
                key={`generation-controls-${selectedSubtype}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">Ready to Generate</h3>
                        <p className="text-muted-foreground">
                          {selectedSubcategory?.name} for {project.productName} • Estimated time: {selectedSubcategory?.estimatedTime}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            // Reset form to allow configuration changes
                            setSelectedSubtype('')
                            form.setValue('contentSubtype', '')
                          }}
                          disabled={isGenerating}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reconfigure
                        </Button>
                        <Button
                          type="submit"
                          disabled={isGenerating || !selectedType || !selectedSubtype}
                          className="min-w-[180px] relative"
                        >
                          {isGenerating ? (
                            <>
                              <Brain className="h-4 w-4 mr-2 animate-pulse" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Content
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </div>
  )
}
