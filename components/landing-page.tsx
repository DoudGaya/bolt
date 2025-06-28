'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Sparkles, 
  Image, 
  MessageSquare, 
  Music, 
  Video, 
  Target, 
  Palette, 
  Zap,
  ArrowRight,
  Star,
  Users,
  Award,
  Play,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { PublicNavigation } from './public/public-navigation'

const features = [
  {
    icon: MessageSquare,
    title: 'AI-Powered Text Generation',
    description: 'Create compelling ad copy, captions, emails, and taglines that convert.'
  },
  {
    icon: Image,
    title: 'Stunning Visual Content',
    description: 'Generate professional banners, posters, and branded images instantly.'
  },
  {
    icon: Music,
    title: 'Voice & Audio',
    description: 'Produce high-quality voiceovers and audio content for your campaigns.'
  },
  {
    icon: Video,
    title: 'Video Marketing',
    description: 'Create engaging video ads with AI-powered editing and effects.'
  },
  {
    icon: Target,
    title: 'Audience Targeting',
    description: 'Tailor content specifically for your target demographic.'
  },
  {
    icon: Palette,
    title: 'Brand Consistency',
    description: 'Maintain your brand colors, tone, and style across all content.'
  }
]

const stats = [
  { value: '10,000+', label: 'Content Pieces Generated' },
  { value: '95%', label: 'Customer Satisfaction' },
  { value: '5x', label: 'Faster Than Traditional Methods' },
  { value: '50+', label: 'Industries Served' }
]

const marketingImages = [
  {
    src: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&crop=edges',
    alt: 'AI Marketing Dashboard',
    title: 'Smart Analytics'
  },
  {
    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&crop=edges',
    alt: 'Content Creation',
    title: 'Content Creation'
  },
  {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=edges',
    alt: 'Brand Strategy',
    title: 'Brand Strategy'
  },
  {
    src: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=400&fit=crop&crop=edges',
    alt: 'Digital Marketing',
    title: 'Digital Marketing'
  },
  {
    src: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop&crop=edges',
    alt: 'Social Media',
    title: 'Social Media'
  }
]

export function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Add landing-page class to body
    document.body.classList.add('landing-page')
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % marketingImages.length)
    }, 4000)
    
    // Cleanup function
    return () => {
      clearInterval(timer)
      document.body.classList.remove('landing-page')
    }
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % marketingImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + marketingImages.length) % marketingImages.length)
  }

  return (
    <div className="relative">
      {/* Fixed Video Background */}
      <PublicNavigation />
      <div className="fixed inset-0 z-0">
        {mounted && (
          <video
            key="hero-video"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
            <source
              src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
              type="video/mp4"
            />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
        )}
        {/* Fallback background for SSR */}
        {!mounted && (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
        )}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 dark:from-black/80 dark:via-black/60 dark:to-black/95"></div>
      </div>

      {/* Hero Section with Fixed Positioning */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden z-10">
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white dark:text-white mb-6 leading-tight">
              Create{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Stunning Marketing
              </span>{' '}
              Content with AI
            </h1>
            <p className="text-xl md:text-2xl text-white/90 dark:text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your marketing strategy with AI-powered content generation. 
              Create professional text, images, audio, and video content that engages your audience and drives results.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white dark:text-white px-8 py-4 text-lg font-semibold">
                  Start Creating for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-purple-500 dark:text-black hover:bg-white/10 dark:hover:bg-white/10 px-8 py-4 text-lg"
                onClick={() => setIsVideoModalOpen(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Marketing Images Carousel */}
        {mounted && (
          <div className="absolute bottom-8 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="relative">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevSlide}
                    className="text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/10 p-2"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <div className="flex space-x-4 overflow-hidden">
                    {marketingImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0.6, scale: 0.9 }}
                        animate={{ 
                          opacity: index === currentSlide ? 1 : 0.6,
                          scale: index === currentSlide ? 1 : 0.9
                        }}
                        transition={{ duration: 0.3 }}
                        className="relative group cursor-pointer"
                        onClick={() => setCurrentSlide(index)}
                      >
                        <div className="w-32 h-20 md:w-48 md:h-32 rounded-lg overflow-hidden border-2 border-white/20 hover:border-purple-400/50 transition-all">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-2 left-2 text-white dark:text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {image.title}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextSlide}
                    className="text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/10 p-2"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center mt-4 space-x-2">
                  {marketingImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-purple-400 w-8' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Scrollable Content */}
      <div className="relative z-10 bg-background">

        {/* Stats Section */}
        <section className="py-16 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-300 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted via-background to-muted">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Scale Your Marketing
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform provides all the tools you need to create, manage, and optimize your marketing content.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-border bg-card/50 backdrop-blur-sm hover:bg-card/70">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white dark:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white dark:text-white mb-6">
              Ready to Transform Your Marketing?
            </h2>
            <p className="text-xl text-white/90 dark:text-white/90 mb-8">
              Join thousands of marketers who are already creating amazing content with AI.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
                Start Your Free Trial
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border text-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-xl font-bold">DoudAI</span>
            </div>
            <div className="text-muted-foreground">
              © 2024 DoudAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      </div>

      {/* YouTube Video Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 ">
          <DialogHeader className="sr-only">
            <DialogTitle>Demo Video</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white dark:text-black"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            {isVideoModalOpen && (
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                title="DoudAI Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}