import { serial, text, pgTable, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';

// Enum for service types
export const serviceTypeEnum = pgEnum('service_type', [
  'customs_clearance',
  'shipping_agency',
  'port_to_door_delivery',
  'truck_fleet_management',
  'warehousing',
  'inventory_solutions',
  'ecommerce_delivery',
  'logistics_consulting'
]);

// Enum for inquiry status
export const inquiryStatusEnum = pgEnum('inquiry_status', [
  'new',
  'in_progress',
  'resolved'
]);

// Enum for company info sections
export const companyInfoSectionEnum = pgEnum('company_info_section', [
  'mission',
  'vision',
  'values',
  'history'
]);

// Contact inquiries table
export const contactInquiriesTable = pgTable('contact_inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone_number: text('phone_number').notNull(),
  company: text('company'), // Nullable by default
  service_of_interest: serviceTypeEnum('service_of_interest').notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  status: inquiryStatusEnum('status').default('new').notNull()
});

// Client testimonials table
export const testimonialsTable = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  client_name: text('client_name').notNull(),
  company: text('company').notNull(),
  quote: text('quote').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  display_order: integer('display_order').notNull()
});

// Company information table (for About Us sections)
export const companyInfoTable = pgTable('company_info', {
  id: serial('id').primaryKey(),
  section: companyInfoSectionEnum('section').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Service information table
export const serviceInfoTable = pgTable('service_info', {
  id: serial('id').primaryKey(),
  service_type: serviceTypeEnum('service_type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon'), // Nullable by default
  is_featured: boolean('is_featured').default(false).notNull(),
  display_order: integer('display_order').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// TypeScript types for the table schemas
export type ContactInquiry = typeof contactInquiriesTable.$inferSelect;
export type NewContactInquiry = typeof contactInquiriesTable.$inferInsert;

export type Testimonial = typeof testimonialsTable.$inferSelect;
export type NewTestimonial = typeof testimonialsTable.$inferInsert;

export type CompanyInfo = typeof companyInfoTable.$inferSelect;
export type NewCompanyInfo = typeof companyInfoTable.$inferInsert;

export type ServiceInfo = typeof serviceInfoTable.$inferSelect;
export type NewServiceInfo = typeof serviceInfoTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  contactInquiries: contactInquiriesTable,
  testimonials: testimonialsTable,
  companyInfo: companyInfoTable,
  serviceInfo: serviceInfoTable
};