# Video Generation Setup

This application supports real video generation using multiple AI video services. To enable video generation, you'll need to set up at least one of the following services:

## Supported Video Generation Services

### 1. D-ID (Recommended for talking head videos)
- **Service**: Text-to-talking-head video
- **Best for**: Corporate presentations, spokesperson videos
- **Setup**:
  1. Sign up at [D-ID](https://www.d-id.com/)
  2. Get your API key from the dashboard
  3. Add to your `.env.local`:
     ```
     D_ID_API_KEY=your_d_id_api_key_here
     ```

### 2. Pika Labs
- **Service**: Text-to-video generation
- **Best for**: Creative, artistic videos
- **Setup**:
  1. Sign up at [Pika Labs](https://pika.art/)
  2. Get your API key
  3. Add to your `.env.local`:
     ```
     PIKA_API_KEY=your_pika_api_key_here
     ```

### 3. Runway ML
- **Service**: AI video generation
- **Best for**: High-quality, professional videos
- **Setup**:
  1. Sign up at [Runway ML](https://runwayml.com/)
  2. Get your API key
  3. Add to your `.env.local`:
     ```
     RUNWAY_API_KEY=your_runway_api_key_here
     ```

## Fallback Behavior

If no video generation services are configured, the system will:
1. Generate a comprehensive video script
2. Create an HTML video template
3. Use a demo video URL for preview purposes

## Testing Video Generation

To test video generation:
1. Set up at least one video service API key
2. Go to Dashboard → Generate Content
3. Select "Video" as content type
4. Fill out the form and generate
5. The system will attempt real video generation and fall back to script if needed

## Important Notes

- Video generation can take 2-10 minutes depending on the service
- Costs vary by service - check their pricing pages
- All generated videos are automatically uploaded to your S3 bucket
- The content library will show video previews with playback controls

## Environment Variables Summary

Add these to your `.env.local` file:

```env
# Required for all functionality
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
OPENAI_API_KEY=your_openai_api_key

# Optional video generation services
D_ID_API_KEY=your_d_id_api_key_here
PIKA_API_KEY=your_pika_api_key_here
RUNWAY_API_KEY=your_runway_api_key_here
```

## Troubleshooting

- **Videos not generating**: Check that at least one video service API key is configured
- **Upload errors**: Verify S3 credentials and bucket permissions
- **Playback issues**: Ensure video URLs are accessible and S3 bucket has proper CORS settings
