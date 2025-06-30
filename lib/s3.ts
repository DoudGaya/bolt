import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Readable } from 'stream'

// Validate environment variables
const validateS3Config = () => {
  const required = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('Missing required S3 environment variables:', missing)
    throw new Error(`Missing S3 configuration: ${missing.join(', ')}`)
  }
  
  console.log('S3 configuration validated successfully')
  console.log('S3 Bucket:', process.env.AWS_BUCKET_NAME)
  console.log('AWS Region:', process.env.AWS_REGION)
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export class S3Service {
  static async uploadFile(
    key: string,
    body: Buffer | Uint8Array | string,
    contentType: string
  ): Promise<string> {
    try {
      // Validate configuration before attempting upload
      validateS3Config()
      
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: body,
        ContentType: contentType,
      })

      console.log('Uploading to S3:', { bucket: process.env.AWS_BUCKET_NAME, key, contentType })
      await s3Client.send(command)
      
      const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
      console.log('S3 upload successful:', url)
      return url
    } catch (error) {
      console.error('S3 upload error:', error)
      throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async uploadStream(
    key: string,
    stream: Readable,
    contentType: string
  ): Promise<string> {
    try {
      // Validate configuration before attempting upload
      validateS3Config()
      
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: stream,
        ContentType: contentType,
      })

      console.log('Uploading stream to S3:', { bucket: process.env.AWS_BUCKET_NAME, key, contentType })
      await s3Client.send(command)
      
      const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
      console.log('S3 stream upload successful:', url)
      return url
    } catch (error) {
      console.error('S3 stream upload error:', error)
      throw new Error(`Failed to upload stream to S3: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async getSignedDownloadUrl(key: string): Promise<string> {
    try {
      validateS3Config()
      
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      })

      return await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
    } catch (error) {
      console.error('S3 signed URL generation error:', error)
      throw new Error(`Failed to generate download URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async deleteFile(key: string): Promise<void> {
    try {
      validateS3Config()
      
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      })

      await s3Client.send(command)
      console.log('S3 file deleted successfully:', key)
    } catch (error) {
      console.error('S3 delete error:', error)
      throw new Error(`Failed to delete file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}