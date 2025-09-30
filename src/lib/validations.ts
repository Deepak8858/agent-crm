import { z } from 'zod'

// Contact schemas
export const createContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  alternatePhone: z.string().optional(),
  preferredLanguage: z.string().default("en"),
  status: z.enum(['LEAD', 'PROSPECT', 'CUSTOMER', 'INACTIVE', 'DO_NOT_CONTACT']).default('LEAD'),
  tags: z.array(z.string()).default([]),
  companyId: z.string().optional(),
  communicationConsent: z.boolean().default(true),
  recordingConsent: z.boolean().default(false),
})

export const updateContactSchema = createContactSchema.partial()

// Company schemas
export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  healthScore: z.number().int().min(0).max(100).optional(),
})

export const updateCompanySchema = createCompanySchema.partial()

// Deal schemas
export const createDealSchema = z.object({
  name: z.string().min(1, "Deal name is required"),
  amount: z.number().positive("Amount must be positive").optional(),
  stage: z.enum(['PROSPECTING', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).default('PROSPECTING'),
  probability: z.number().int().min(0).max(100).optional(),
  closeDate: z.string().datetime().optional(),
  nextAction: z.string().optional(),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
})

export const updateDealSchema = createDealSchema.partial()

// Activity schemas
export const createActivitySchema = z.object({
  type: z.enum(['CALL', 'EMAIL', 'MEETING', 'TASK', 'NOTE', 'VOICE_AGENT_CALL']),
  subject: z.string().min(1, "Subject is required"),
  summary: z.string().optional(),
  details: z.string().optional(),
  duration: z.number().int().min(0).optional(),
  outcome: z.string().optional(),
  transcriptUrl: z.string().url().optional(),
  recordingUrl: z.string().url().optional(),
  aiSentiment: z.string().optional(),
  aiIntent: z.string().optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.string().datetime().optional(),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
  dealId: z.string().optional(),
})

export const updateActivitySchema = createActivitySchema.partial()

// Ticket schemas
export const createTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  category: z.string().optional(),
  contactId: z.string().optional(),
  voiceSummary: z.string().optional(),
  aiTags: z.array(z.string()).default([]),
})

export const updateTicketSchema = createTicketSchema.partial().extend({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  assignedTo: z.string().optional(),
})

// API Key schemas
export const createApiKeySchema = z.object({
  name: z.string().min(1, "API key name is required"),
  scopes: z.array(z.string()).min(1, "At least one scope is required"),
  expiresAt: z.string().datetime().optional(),
})

// Search and filter schemas
export const contactSearchSchema = z.object({
  q: z.string().optional(),
  status: z.enum(['LEAD', 'PROSPECT', 'CUSTOMER', 'INACTIVE', 'DO_NOT_CONTACT']).optional(),
  companyId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['firstName', 'lastName', 'email', 'createdAt', 'lastInteractionDate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const dealSearchSchema = z.object({
  q: z.string().optional(),
  stage: z.enum(['PROSPECTING', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).optional(),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'amount', 'probability', 'createdAt', 'closeDate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Voice Agent API schemas
export const voiceAgentLookupSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
}).refine(data => data.phone || data.email, {
  message: "Either phone or email must be provided",
})

export const voiceAgentCallLogSchema = z.object({
  contactId: z.string(),
  duration: z.number().int().min(0).optional(),
  subject: z.string().min(1, "Subject is required"),
  summary: z.string().optional(),
  details: z.string().optional(),
  outcome: z.string().optional(),
  transcriptUrl: z.string().url().optional(),
  recordingUrl: z.string().url().optional(),
  aiSentiment: z.string().optional(),
  aiIntent: z.string().optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.string().datetime().optional(),
})

export const voiceAgentUpdateContactSchema = z.object({
  contactId: z.string(),
  status: z.enum(['LEAD', 'PROSPECT', 'CUSTOMER', 'INACTIVE', 'DO_NOT_CONTACT']).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

export const voiceAgentUpdateDealSchema = z.object({
  dealId: z.string(),
  stage: z.enum(['PROSPECTING', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).optional(),
  probability: z.number().int().min(0).max(100).optional(),
  nextAction: z.string().optional(),
})