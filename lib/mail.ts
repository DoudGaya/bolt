import { Resend } from 'resend'

// Validate API key
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set in environment variables')
}

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Email templates
const emailTemplates = {
  welcome: (name: string, verificationUrl: string) => ({
    subject: '🎉 Welcome to AI Marketing Assistant!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to AI Marketing Assistant</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Welcome to AI Marketing Assistant!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Thank you for joining AI Marketing Assistant! We're excited to help you create stunning marketing content with the power of AI.</p>
              
              <p>To get started, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Once verified, you'll be able to:</p>
              <ul>
                <li>🎨 Generate professional marketing images</li>
                <li>✍️ Create compelling ad copy and content</li>
                <li>🎵 Produce high-quality audio content</li>
                <li>🎬 Generate engaging video content</li>
                <li>🎯 Target your ideal audience</li>
              </ul>
              
              <p>If you have any questions, feel free to reach out to our support team.</p>
              
              <p>Best regards,<br>The AI Marketing Assistant Team</p>
            </div>
            <div class="footer">
              <p>© 2024 AI Marketing Assistant. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  emailVerification: (name: string, verificationCode: string) => ({
    subject: '🔐 Verify Your Email - AI Marketing Assistant',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { background: #fff; border: 2px dashed #8B5CF6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #8B5CF6; letter-spacing: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Email Verification</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Please use the verification code below to verify your email address:</p>
              
              <div class="code">${verificationCode}</div>
              
              <p>This code will expire in 10 minutes for security reasons.</p>
              
              <p>If you didn't request this verification, you can safely ignore this email.</p>
              
              <p>Best regards,<br>The AI Marketing Assistant Team</p>
            </div>
            <div class="footer">
              <p>© 2024 AI Marketing Assistant. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  twoFactorAuth: (name: string, code: string) => ({
    subject: '🔒 Two-Factor Authentication Code - AI Marketing Assistant',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Two-Factor Authentication</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { background: #fff; border: 2px solid #8B5CF6; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; color: #8B5CF6; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Two-Factor Authentication</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Someone is trying to sign in to your AI Marketing Assistant account. Please use the authentication code below:</p>
              
              <div class="code">${code}</div>
              
              <div class="warning">
                <strong>Security Notice:</strong> This code will expire in 5 minutes. If you didn't request this code, please secure your account immediately.
              </div>
              
              <p>For your security, never share this code with anyone.</p>
              
              <p>Best regards,<br>The AI Marketing Assistant Team</p>
            </div>
            <div class="footer">
              <p>© 2024 AI Marketing Assistant. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: '🔑 Password Reset Request - AI Marketing Assistant',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fee; border: 1px solid #fcc; color: #c33; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔑 Password Reset</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>We received a request to reset your password for your AI Marketing Assistant account.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <div class="warning">
                <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email and your password will remain unchanged.
              </div>
              
              <p>For security reasons, we recommend using a strong password that includes a mix of letters, numbers, and special characters.</p>
              
              <p>Best regards,<br>The AI Marketing Assistant Team</p>
            </div>
            <div class="footer">
              <p>© 2024 AI Marketing Assistant. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}

// Email sending functions
export async function sendWelcomeEmail(email: string, name: string, verificationUrl: string) {
  try {
    const { subject, html } = emailTemplates.welcome(name, verificationUrl)
    
    await resend.emails.send({
      from: 'AI Marketing Assistant <onboarding@resend.dev>',
      to: email,
      subject,
      html,
    })
    
    console.log(`Welcome email sent to: ${email}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}

export async function sendEmailVerification(email: string, name: string, code: string) {
  try {
    const { subject, html } = emailTemplates.emailVerification(name, code)
    
    await resend.emails.send({
      from: 'AI Marketing Assistant <onboarding@resend.dev>',
      to: email,
      subject,
      html,
    })
    
    console.log(`Email verification sent to: ${email}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending email verification:', error)
    return { success: false, error }
  }
}

export async function sendTwoFactorCode(email: string, name: string, code: string) {
  try {
    const { subject, html } = emailTemplates.twoFactorAuth(name, code)
    
    await resend.emails.send({
      from: 'AI Marketing Assistant <security@resend.dev>',
      to: email,
      subject,
      html,
    })
    
    console.log(`2FA code sent to: ${email}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending 2FA code:', error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(email: string, name: string, resetUrl: string) {
  try {
    const { subject, html } = emailTemplates.passwordReset(name, resetUrl)
    
    await resend.emails.send({
      from: 'AI Marketing Assistant <security@resend.dev>',
      to: email,
      subject,
      html,
    })
    
    console.log(`Password reset email sent to: ${email}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error }
  }
}

// Utility functions
export function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function generateTwoFactorCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function createVerificationUrl(baseUrl: string, token: string): string {
  return `${baseUrl}/auth/verify-email?token=${token}`
}

export function createPasswordResetUrl(baseUrl: string, token: string): string {
  return `${baseUrl}/auth/reset-password?token=${token}`
}
