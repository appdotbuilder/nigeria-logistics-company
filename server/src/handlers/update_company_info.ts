import { db } from '../db';
import { companyInfoTable } from '../db/schema';
import { type UpdateCompanyInfoInput, type CompanyInfo } from '../schema';
import { eq } from 'drizzle-orm';

export async function updateCompanyInfo(input: UpdateCompanyInfoInput): Promise<CompanyInfo> {
  try {
    // Build the update object with only provided fields
    const updateData: Partial<typeof companyInfoTable.$inferInsert> = {
      updated_at: new Date()
    };

    if (input.title !== undefined) {
      updateData.title = input.title;
    }

    if (input.content !== undefined) {
      updateData.content = input.content;
    }

    // Update the company info record
    const result = await db.update(companyInfoTable)
      .set(updateData)
      .where(eq(companyInfoTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Company info with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Company info update failed:', error);
    throw error;
  }
}