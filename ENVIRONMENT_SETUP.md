# Environment Configuration Guide

This application requires several environment variables to be configured for full functionality. Create a `.env.local` file in the root directory with the following variables:

## Required Environment Variables

### OpenAI Configuration (for AI content generation)
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### AWS S3 Configuration (for file storage)
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_S3_BUCKET=your-bucket-name
```

### NextAuth Configuration
```bash
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### Database Configuration
```bash
DATABASE_URL=your_database_connection_string
```

## Service Configuration Status

The application includes fallback functionality:

- **OpenAI not configured**: Will generate placeholder text content
- **S3 not configured**: Will use mock URLs for file storage
- **Full configuration**: All AI features work normally

## Getting API Keys

### OpenAI API Key
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env.local` file

### AWS Configuration
1. Create an AWS account
2. Create an S3 bucket
3. Create IAM user with S3 permissions
4. Add credentials to `.env.local` file

## Troubleshooting

### Common Issues
- **"No value provided for input HTTP label: Bucket"**: Check AWS_S3_BUCKET is set
- **"OpenAI API key is not configured"**: Check OPENAI_API_KEY is set
- **"Missing S3 configuration"**: Ensure all AWS_* variables are set

### Testing Configuration
The application will automatically detect missing configuration and provide fallback content with helpful messages indicating what needs to be configured.
