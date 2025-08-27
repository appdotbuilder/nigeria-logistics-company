import { db } from '../db';
import { contactInquiriesTable } from '../db/schema';
import { type CreateContactInquiryInput, type ContactInquiry } from '../schema';

export const createContactInquiry = async (input: CreateContactInquiryInput): Promise<ContactInquiry> => {
  try {
    // Insert contact inquiry record
    const result = await db.insert(contactInquiriesTable)
      .values({
        name: input.name,
        email: input.email,
        phone_number: input.phone_number,
        company: input.company || null, // Handle optional company field
        service_of_interest: input.service_of_interest,
        message: input.message
        // created_at and status have defaults in the schema
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Contact inquiry creation failed:', error);
    throw error;
  }
};