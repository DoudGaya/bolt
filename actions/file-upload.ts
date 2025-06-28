'use server'

import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { S3Service } from '@/lib/s3'
import { revalidatePath } from 'next/cache'

// File upload schemas
const fileUploadSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  mimeType: z.string().min(1),
  projectId: z.string().optional(),
  uploadType: z.enum(['logo', 'brand-asset', 'reference-image', 'document', 'media']),
  description: z.string().optional(),
})

const signedUrlSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().positive().max(100 * 1024 * 1024), // 100MB limit
  mimeType: z.string().min(1),
  uploadType: z.enum(['logo', 'brand-asset', 'reference-image', 'document', 'media']),
  projectId: z.string().optional(),
})

// Allowed file types for different upload categories
const allowedMimeTypes = {
  logo: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
  'brand-asset': ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'application/pdf'],
  'reference-image': ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  media: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'audio/mpeg', 'audio/wav'],
}

export async function generateUploadUrl(input: z.infer<typeof signedUrlSchema>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const validatedInput = signedUrlSchema.parse(input)

    // Validate file type for upload category
    const allowedTypes = allowedMimeTypes[validatedInput.uploadType]
    if (!allowedTypes.includes(validatedInput.mimeType)) {
      throw new Error(`File type ${validatedInput.mimeType} not allowed for ${validatedInput.uploadType} uploads`)
    }

    // If projectId is provided, verify user owns the project
    if (validatedInput.projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: validatedInput.projectId,
          userId: session.user.id,
        },
      })
      
      if (!project) {
        throw new Error('Project not found or access denied')
      }
    }

    // Generate unique file key with organized structure
    const fileExtension = validatedInput.fileName.split('.').pop() || ''
    const sanitizedFileName = validatedInput.fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    
    const fileKey = validatedInput.projectId 
      ? `uploads/${session.user.id}/${validatedInput.projectId}/${validatedInput.uploadType}/${timestamp}_${randomId}_${sanitizedFileName}`
      : `uploads/${session.user.id}/general/${validatedInput.uploadType}/${timestamp}_${randomId}_${sanitizedFileName}`

    // Generate presigned URL for direct upload to S3
    const { PutObjectCommand } = await import('@aws-sdk/client-s3')
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')
    const { S3Client } = await import('@aws-sdk/client-s3')

    const s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
      ContentType: validatedInput.mimeType,
      ContentLength: validatedInput.fileSize,
      // Add metadata for better file management
      Metadata: {
        userId: session.user.id,
        uploadType: validatedInput.uploadType,
        originalFileName: validatedInput.fileName,
        ...(validatedInput.projectId && { projectId: validatedInput.projectId }),
      },
    })

    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600, // 1 hour
    })

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`

    return {
      success: true,
      uploadUrl,
      fileKey,
      fileUrl,
      expiresIn: 3600,
    }

  } catch (error) {
    console.error('Generate upload URL error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate upload URL',
    }
  }
}

export async function confirmFileUpload(input: z.infer<typeof fileUploadSchema> & { fileKey: string; fileUrl: string }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const validatedInput = fileUploadSchema.extend({
      fileKey: z.string(),
      fileUrl: z.string().url(),
    }).parse(input)

    // Save file record to database
    const uploadRecord = await prisma.userUpload.create({
      data: {
        userId: session.user.id,
        fileName: validatedInput.fileName,
        fileUrl: validatedInput.fileUrl,
        fileSize: validatedInput.fileSize,
        mimeType: validatedInput.mimeType,
      },
    })

    // If this is a project-related upload, associate it
    if (validatedInput.projectId) {
      // Update project with logo URL if it's a logo upload
      if (validatedInput.uploadType === 'logo') {
        await prisma.project.update({
          where: {
            id: validatedInput.projectId,
            userId: session.user.id,
          },
          data: {
            logoUrl: validatedInput.fileUrl,
          },
        })
        
        revalidatePath(`/dashboard/projects/${validatedInput.projectId}`)
      }
    }

    return {
      success: true,
      upload: uploadRecord,
    }

  } catch (error) {
    console.error('Confirm file upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to confirm file upload',
    }
  }
}

export async function deleteFile(fileId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    // Get file record and verify ownership
    const fileRecord = await prisma.userUpload.findFirst({
      where: {
        id: fileId,
        userId: session.user.id,
      },
    })

    if (!fileRecord) {
      throw new Error('File not found or access denied')
    }

    // Extract S3 key from URL
    const url = new URL(fileRecord.fileUrl)
    const fileKey = url.pathname.substring(1) // Remove leading slash

    // Delete from S3
    await S3Service.deleteFile(fileKey)

    // Delete from database
    await prisma.userUpload.delete({
      where: {
        id: fileId,
      },
    })

    return {
      success: true,
      message: 'File deleted successfully',
    }

  } catch (error) {
    console.error('Delete file error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    }
  }
}

export async function getUserUploads(projectId?: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    // Get user's uploads, optionally filtered by project
    const uploads = await prisma.userUpload.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      uploads,
    }

  } catch (error) {
    console.error('Get user uploads error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get uploads',
    }
  }
}

// Batch file operations
export async function generateMultipleUploadUrls(
  files: Array<{
    fileName: string
    fileSize: number
    mimeType: string
    uploadType: 'logo' | 'brand-asset' | 'reference-image' | 'document' | 'media'
  }>,
  projectId?: string
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const results = []
    for (const file of files) {
      const result = await generateUploadUrl({
        ...file,
        projectId,
      })
      results.push({ ...file, ...result })
    }

    return {
      success: true,
      results,
    }

  } catch (error) {
    console.error('Generate multiple upload URLs error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate upload URLs',
    }
  }
}

// Image optimization for different use cases
export async function optimizeImageForPlatform(
  imageUrl: string, 
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'pinterest',
  contentType: 'profile' | 'cover' | 'post' | 'story' | 'ad'
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    // Platform-specific dimensions
    const platformSpecs = {
      facebook: {
        profile: { width: 180, height: 180 },
        cover: { width: 820, height: 312 },
        post: { width: 1200, height: 630 },
        story: { width: 1080, height: 1920 },
        ad: { width: 1200, height: 628 },
      },
      instagram: {
        profile: { width: 320, height: 320 },
        post: { width: 1080, height: 1080 },
        story: { width: 1080, height: 1920 },
        ad: { width: 1080, height: 1080 },
      },
      twitter: {
        profile: { width: 400, height: 400 },
        cover: { width: 1500, height: 500 },
        post: { width: 1200, height: 675 },
        ad: { width: 1200, height: 628 },
      },
      linkedin: {
        profile: { width: 400, height: 400 },
        cover: { width: 1584, height: 396 },
        post: { width: 1200, height: 627 },
        ad: { width: 1200, height: 627 },
      },
      youtube: {
        profile: { width: 800, height: 800 },
        cover: { width: 2560, height: 1440 },
        post: { width: 1280, height: 720 },
      },
      pinterest: {
        profile: { width: 280, height: 280 },
        post: { width: 1000, height: 1500 },
        ad: { width: 1000, height: 1500 },
      },
    }

    const specs = platformSpecs[platform as keyof typeof platformSpecs]?.[contentType as keyof typeof platformSpecs[typeof platform]]
    if (!specs) {
      throw new Error(`Unsupported platform/content type combination: ${platform}/${contentType}`)
    }

    // In a real implementation, you would use an image processing service
    // For now, we'll return the optimization specs
    return {
      success: true,
      originalUrl: imageUrl,
      platform,
      contentType,
      recommendedSpecs: specs,
      optimizationNotes: [
        `Optimize for ${platform} ${contentType}`,
        `Target dimensions: ${specs.width}x${specs.height}px`,
        'Use high-quality JPEG or PNG format',
        'Ensure text is readable at target size',
        'Follow platform-specific brand guidelines',
      ],
    }

  } catch (error) {
    console.error('Image optimization error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to optimize image',
    }
  }
}
