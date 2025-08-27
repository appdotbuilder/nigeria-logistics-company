import { db } from '../db';
import { serviceInfoTable } from '../db/schema';
import { type ServiceInfo } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getFeaturedServices = async (): Promise<ServiceInfo[]> => {
  try {
    // Fetch featured services ordered by display_order
    const results = await db.select()
      .from(serviceInfoTable)
      .where(eq(serviceInfoTable.is_featured, true))
      .orderBy(asc(serviceInfoTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch featured services:', error);
    throw error;
  }
};