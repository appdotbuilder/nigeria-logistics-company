import { db } from '../db';
import { serviceInfoTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type UpdateServiceInfoInput, type ServiceInfo } from '../schema';

export const updateServiceInfo = async (input: UpdateServiceInfoInput): Promise<ServiceInfo> => {
  try {
    // First, verify the service info record exists
    const existingRecord = await db.select()
      .from(serviceInfoTable)
      .where(eq(serviceInfoTable.id, input.id))
      .execute();

    if (existingRecord.length === 0) {
      throw new Error(`Service info with id ${input.id} not found`);
    }

    // Build the update object with only provided fields
    const updateData: Partial<typeof serviceInfoTable.$inferInsert> = {
      updated_at: new Date()
    };

    if (input.title !== undefined) {
      updateData.title = input.title;
    }

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    if (input.icon !== undefined) {
      updateData.icon = input.icon;
    }

    if (input.is_featured !== undefined) {
      updateData.is_featured = input.is_featured;
    }

    if (input.display_order !== undefined) {
      updateData.display_order = input.display_order;
    }

    // Update the service info record
    const result = await db.update(serviceInfoTable)
      .set(updateData)
      .where(eq(serviceInfoTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Service info update failed:', error);
    throw error;
  }
};