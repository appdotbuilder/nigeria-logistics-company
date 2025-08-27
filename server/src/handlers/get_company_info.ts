import { db } from '../db';
import { companyInfoTable } from '../db/schema';
import { type CompanyInfo } from '../schema';
import { asc } from 'drizzle-orm';

export const getCompanyInfo = async (): Promise<CompanyInfo[]> => {
  try {
    // Fetch all company information sections ordered by enum definition order for consistency
    const result = await db.select()
      .from(companyInfoTable)
      .orderBy(asc(companyInfoTable.section))
      .execute();

    return result;
  } catch (error) {
    console.error('Failed to fetch company information:', error);
    throw error;
  }
};