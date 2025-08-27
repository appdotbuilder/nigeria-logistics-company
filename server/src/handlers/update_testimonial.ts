import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { type UpdateTestimonialInput, type Testimonial } from '../schema';
import { eq } from 'drizzle-orm';

export const updateTestimonial = async (input: UpdateTestimonialInput): Promise<Testimonial> => {
  try {
    // First verify that the testimonial exists
    const existingTestimonials = await db.select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.id, input.id))
      .execute();

    if (existingTestimonials.length === 0) {
      throw new Error(`Testimonial with id ${input.id} not found`);
    }

    // Build the update object with only provided fields
    const updateData: Partial<typeof testimonialsTable.$inferInsert> = {};
    
    if (input.client_name !== undefined) {
      updateData.client_name = input.client_name;
    }
    
    if (input.company !== undefined) {
      updateData.company = input.company;
    }
    
    if (input.quote !== undefined) {
      updateData.quote = input.quote;
    }
    
    if (input.is_active !== undefined) {
      updateData.is_active = input.is_active;
    }
    
    if (input.display_order !== undefined) {
      updateData.display_order = input.display_order;
    }

    // If no fields to update, return the existing testimonial
    if (Object.keys(updateData).length === 0) {
      return existingTestimonials[0];
    }

    // Update the testimonial
    const result = await db.update(testimonialsTable)
      .set(updateData)
      .where(eq(testimonialsTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Testimonial update failed:', error);
    throw error;
  }
};