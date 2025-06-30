'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Download, 
  Copy, 
  ExternalLink,
  SkipBack,
  SkipForward,
  FileText
} from 'lucide-react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { format } from 'date-fns'

interface ContentPreviewModalProps {
  content: any
  isOpen: boolean
  onClose: () => void
}

interface AudioPlayerProps {
  src: string
  title: string
}

const contentTypeColors = {
  TEXT: 'text-blue-600 bg-blue-100',
  IMAGE: 'text-emerald-600 bg-emerald-100',
  VIDEO: 'text-orange-600 bg-orange-100',
  AUDIO: 'text-pink-600 bg-pink-100',
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Generate stable waveform pattern to avoid hydration issues
  const waveformHeights = Array.from({ length: 32 }, (_, i) => {
    // Use a deterministic pattern based on index instead of Math.random()
    const seed = i * 7 + 13 // Simple seed function
    return 20 + (seed % 41) // Height between 20 and 60
  })

  useEffect(() => {
    setMounted(true)
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const seekTime = parseFloat(e.target.value)
    audio.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Waveform visualization placeholder */}
      <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
        <div className="flex items-center space-x-1">
          {mounted && waveformHeights.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-blue-500 rounded-full transition-opacity duration-300"
              style={{
                height: `${height}px`,
                opacity: currentTime / duration > i / 32 ? 1 : 0.3
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => skip(-10)}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="default"
            size="lg"
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => skip(10)}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume control */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

export const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  content,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderPreview = () => {
    switch (content.type) {
      case 'IMAGE':
        return (
          <div className="space-y-4">
            {content.fileUrl ? (
              <div className="relative w-full max-h-[70vh] rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={content.fileUrl}
                  alt={content.title}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
            
            {content.content && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Description</h4>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )

      case 'VIDEO':
        return (
          <div className="space-y-4">
            {content.fileUrl ? (
              <div className="relative w-full rounded-lg overflow-hidden bg-black">
                <video
                  src={content.fileUrl}
                  controls
                  className="w-full h-80 object-contain"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No video available</p>
                </div>
              </div>
            )}
            
            {content.content && (
              <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                <h4 className="font-medium mb-2">Video Script</h4>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )

      case 'AUDIO':
        return (
          <div className="space-y-6">
            {content.fileUrl ? (
              <AudioPlayer src={content.fileUrl} title={content.title} />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Volume2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No audio file available</p>
                </div>
              </div>
            )}
            
            {content.content && (
              <div className="p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
                <h4 className="font-medium mb-2">Transcript</h4>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )

      case 'TEXT':
      default:
        return (
          <div className="space-y-4">
            <div className="p-6 bg-white border rounded-lg max-h-[70vh] overflow-y-auto">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.content || 'No content available'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl">{content.title}</DialogTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={contentTypeColors[content.type as keyof typeof contentTypeColors]}>
                  {content.type}
                </Badge>
                <Badge variant="outline">
                  {content.project?.name || 'Unknown Project'}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="flex-1 overflow-y-auto">
          {renderPreview()}
        </div>

        <Separator className="my-4" />

        {/* Action buttons */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Created {format(new Date(content.createdAt), 'MMM d, yyyy')}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {content.content && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(content.content)}
                disabled={copied}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            )}

            {content.fileUrl && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <a href={content.fileUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>

                <Button variant="outline" size="sm" asChild>
                  <a href={content.fileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
