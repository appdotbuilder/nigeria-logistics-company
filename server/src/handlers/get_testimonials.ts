import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { type Testimonial } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    // Fetch active testimonials ordered by display_order
    const results = await db.select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.is_active, true))
      .orderBy(asc(testimonialsTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    throw error;
  }
};