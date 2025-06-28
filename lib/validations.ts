import { z } from 'zod'

export const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  productName: z.string().min(1, 'Product name is required'),
  productDescription: z.string().min(10, 'Product description must be at least 10 characters'),
  industry: z.string().min(1, 'Industry is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  toneStyle: z.string().min(1, 'Tone/style is required'),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')),
})

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  productName: z.string().min(1, 'Product name is required'),
  productDescription: z.string().min(10, 'Product description must be at least 10 characters'),
  industry: z.string().min(1, 'Industry is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  toneStyle: z.string().min(1, 'Tone/style is required'),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')),
  contentTypes: z.array(z.string()).min(1, 'Select at least one content type'),
})

export const UserRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const ContentGenerationSchema = z.object({
  type: z.enum(['TEXT', 'IMAGE', 'AUDIO', 'VIDEO']),
  prompt: z.string().min(1, 'Prompt is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  parameters: z.record(z.any()).optional(),
})

export type ProjectInput = z.infer<typeof ProjectSchema>
export type CreateProjectData = z.infer<typeof createProjectSchema>
export type UserRegisterInput = z.infer<typeof UserRegisterSchema>
export type UserLoginInput = z.infer<typeof UserLoginSchema>
export type ContentGenerationInput = z.infer<typeof ContentGenerationSchema>