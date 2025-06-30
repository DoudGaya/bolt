'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { S3Service } from '@/lib/s3'

export interface DeleteContentResult {
  success: boolean
  message: string
}

/**
 * Delete generated content and associated S3 files
 */
export async function deleteGeneratedContent(contentId: string): Promise<DeleteContentResult> {
  try {
    // Verify user session
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return {
        success: false,
        message: 'Authentication required'
      }
    }

    // Get the content to verify ownership and get S3 info
    const content = await prisma.generatedContent.findFirst({
      where: {
        id: contentId,
        project: {
          userId: session.user.id
        }
      },
      include: {
        project: true
      }
    })

    if (!content) {
      return {
        success: false,
        message: 'Content not found or access denied'
      }
    }

    // Delete from S3 if file exists
    if (content.fileName) {
      try {
        await S3Service.deleteFile(content.fileName)
        console.log('S3 file deleted:', content.fileName)
      } catch (s3Error) {
        console.error('Failed to delete S3 file:', s3Error)
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete from database
    await prisma.generatedContent.delete({
      where: {
        id: contentId
      }
    })

    console.log('Content deleted successfully:', contentId)

    // Revalidate the content page to refresh the UI
    revalidatePath('/dashboard/content')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: 'Content deleted successfully'
    }

  } catch (error) {
    console.error('Delete content error:', error)
    return {
      success: false,
      message: 'Failed to delete content. Please try again.'
    }
  }
}

/**
 * Bulk delete multiple content items
 */
export async function bulkDeleteContent(contentIds: string[]): Promise<DeleteContentResult> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return {
        success: false,
        message: 'Authentication required'
      }
    }

    // Get all content items to verify ownership
    const contents = await prisma.generatedContent.findMany({
      where: {
        id: { in: contentIds },
        project: {
          userId: session.user.id
        }
      }
    })

    if (contents.length !== contentIds.length) {
      return {
        success: false,
        message: 'Some content items not found or access denied'
      }
    }

    // Delete S3 files
    const s3Deletions = contents
      .filter(content => content.fileName)
      .map(content => S3Service.deleteFile(content.fileName!))

    await Promise.allSettled(s3Deletions)

    // Delete from database
    await prisma.generatedContent.deleteMany({
      where: {
        id: { in: contentIds }
      }
    })

    // Revalidate pages
    revalidatePath('/dashboard/content')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: `${contents.length} content items deleted successfully`
    }

  } catch (error) {
    console.error('Bulk delete error:', error)
    return {
      success: false,
      message: 'Failed to delete content items. Please try again.'
    }
  }
}
