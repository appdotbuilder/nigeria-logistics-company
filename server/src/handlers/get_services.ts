import { db } from '../db';
import { serviceInfoTable } from '../db/schema';
import { type ServiceInfo } from '../schema';
import { asc } from 'drizzle-orm';

export const getServices = async (): Promise<ServiceInfo[]> => {
  try {
    // Fetch all services ordered by display_order
    const services = await db.select()
      .from(serviceInfoTable)
      .orderBy(asc(serviceInfoTable.display_order))
      .execute();

    // Return services as they are (no numeric conversions needed)
    return services;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};