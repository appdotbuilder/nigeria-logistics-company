import { z } from 'zod';

// Service types enum for dropdown
export const serviceTypeSchema = z.enum([
  'customs_clearance',
  'shipping_agency',
  'port_to_door_delivery',
  'truck_fleet_management',
  'warehousing',
  'inventory_solutions',
  'ecommerce_delivery',
  'logistics_consulting'
]);

export type ServiceType = z.infer<typeof serviceTypeSchema>;

// Contact inquiry schema
export const contactInquirySchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  company: z.string().nullable(), // Optional company field
  service_of_interest: serviceTypeSchema,
  message: z.string(),
  created_at: z.coerce.date(),
  status: z.enum(['new', 'in_progress', 'resolved']).default('new')
});

export type ContactInquiry = z.infer<typeof contactInquirySchema>;

// Input schema for creating contact inquiries
export const createContactInquiryInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  company: z.string().nullable().optional(), // Can be null or omitted
  service_of_interest: serviceTypeSchema,
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export type CreateContactInquiryInput = z.infer<typeof createContactInquiryInputSchema>;

// Client testimonial schema
export const testimonialSchema = z.object({
  id: z.number(),
  client_name: z.string(),
  company: z.string(),
  quote: z.string(),
  is_active: z.boolean().default(true), // To control which testimonials are displayed
  created_at: z.coerce.date(),
  display_order: z.number().int() // For ordering testimonials on the website
});

export type Testimonial = z.infer<typeof testimonialSchema>;

// Input schema for creating testimonials
export const createTestimonialInputSchema = z.object({
  client_name: z.string().min(1, 'Client name is required'),
  company: z.string().min(1, 'Company is required'),
  quote: z.string().min(10, 'Quote must be at least 10 characters'),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional()
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialInputSchema>;

// Update testimonial schema
export const updateTestimonialInputSchema = z.object({
  id: z.number(),
  client_name: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  quote: z.string().min(10).optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().optional()
});

export type UpdateTestimonialInput = z.infer<typeof updateTestimonialInputSchema>;

// Company information schema (for About Us section)
export const companyInfoSchema = z.object({
  id: z.number(),
  section: z.enum(['mission', 'vision', 'values', 'history']),
  title: z.string(),
  content: z.string(),
  updated_at: z.coerce.date()
});

export type CompanyInfo = z.infer<typeof companyInfoSchema>;

// Input schema for updating company information
export const updateCompanyInfoInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional()
});

export type UpdateCompanyInfoInput = z.infer<typeof updateCompanyInfoInputSchema>;

// Service information schema
export const serviceInfoSchema = z.object({
  id: z.number(),
  service_type: serviceTypeSchema,
  title: z.string(),
  description: z.string(),
  icon: z.string().nullable(), // Icon name or path
  is_featured: z.boolean().default(false), // For homepage highlighting
  display_order: z.number().int(),
  updated_at: z.coerce.date()
});

export type ServiceInfo = z.infer<typeof serviceInfoSchema>;

// Input schema for updating service information
export const updateServiceInfoInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  icon: z.string().nullable().optional(),
  is_featured: z.boolean().optional(),
  display_order: z.number().int().optional()
});

export type UpdateServiceInfoInput = z.infer<typeof updateServiceInfoInputSchema>;