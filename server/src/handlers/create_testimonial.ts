import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { type CreateTestimonialInput, type Testimonial } from '../schema';

export const createTestimonial = async (input: CreateTestimonialInput): Promise<Testimonial> => {
  try {
    // Insert testimonial record
    const result = await db.insert(testimonialsTable)
      .values({
        client_name: input.client_name,
        company: input.company,
        quote: input.quote,
        is_active: input.is_active ?? true, // Default to true if not provided
        display_order: input.display_order ?? 1 // Default to 1 if not provided
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Testimonial creation failed:', error);
    throw error;
  }
};