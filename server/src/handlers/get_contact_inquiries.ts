import { db } from '../db';
import { contactInquiriesTable } from '../db/schema';
import { type ContactInquiry } from '../schema';
import { desc } from 'drizzle-orm';

export const getContactInquiries = async (): Promise<ContactInquiry[]> => {
  try {
    // Fetch all contact inquiries ordered by creation date (newest first)
    const results = await db.select()
      .from(contactInquiriesTable)
      .orderBy(desc(contactInquiriesTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch contact inquiries:', error);
    throw error;
  }
};