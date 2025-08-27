import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { companyInfoTable } from '../db/schema';
import { type UpdateCompanyInfoInput } from '../schema';
import { updateCompanyInfo } from '../handlers/update_company_info';
import { eq } from 'drizzle-orm';

describe('updateCompanyInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper to create test company info record
  const createTestCompanyInfo = async () => {
    const result = await db.insert(companyInfoTable)
      .values({
        section: 'mission',
        title: 'Our Mission',
        content: 'Original mission statement content'
      })
      .returning()
      .execute();
    
    return result[0];
  };

  it('should update company info title only', async () => {
    const companyInfo = await createTestCompanyInfo();
    
    const updateInput: UpdateCompanyInfoInput = {
      id: companyInfo.id,
      title: 'Updated Mission Title'
    };

    const result = await updateCompanyInfo(updateInput);

    // Verify updated fields
    expect(result.id).toEqual(companyInfo.id);
    expect(result.section).toEqual('mission');
    expect(result.title).toEqual('Updated Mission Title');
    expect(result.content).toEqual('Original mission statement content'); // Should remain unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > companyInfo.updated_at).toBe(true);
  });

  it('should update company info content only', async () => {
    const companyInfo = await createTestCompanyInfo();
    
    const updateInput: UpdateCompanyInfoInput = {
      id: companyInfo.id,
      content: 'Updated mission statement with new goals and objectives'
    };

    const result = await updateCompanyInfo(updateInput);

    // Verify updated fields
    expect(result.id).toEqual(companyInfo.id);
    expect(result.section).toEqual('mission');
    expect(result.title).toEqual('Our Mission'); // Should remain unchanged
    expect(result.content).toEqual('Updated mission statement with new goals and objectives');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > companyInfo.updated_at).toBe(true);
  });

  it('should update both title and content', async () => {
    const companyInfo = await createTestCompanyInfo();
    
    const updateInput: UpdateCompanyInfoInput = {
      id: companyInfo.id,
      title: 'New Mission Statement',
      content: 'Completely rewritten mission with fresh perspective and clear direction'
    };

    const result = await updateCompanyInfo(updateInput);

    // Verify all updated fields
    expect(result.id).toEqual(companyInfo.id);
    expect(result.section).toEqual('mission');
    expect(result.title).toEqual('New Mission Statement');
    expect(result.content).toEqual('Completely rewritten mission with fresh perspective and clear direction');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > companyInfo.updated_at).toBe(true);
  });

  it('should save updates to database correctly', async () => {
    const companyInfo = await createTestCompanyInfo();
    
    const updateInput: UpdateCompanyInfoInput = {
      id: companyInfo.id,
      title: 'Database Test Title',
      content: 'Database test content verification'
    };

    await updateCompanyInfo(updateInput);

    // Query database to verify persistence
    const savedInfo = await db.select()
      .from(companyInfoTable)
      .where(eq(companyInfoTable.id, companyInfo.id))
      .execute();

    expect(savedInfo).toHaveLength(1);
    expect(savedInfo[0].title).toEqual('Database Test Title');
    expect(savedInfo[0].content).toEqual('Database test content verification');
    expect(savedInfo[0].updated_at).toBeInstanceOf(Date);
    expect(savedInfo[0].updated_at > companyInfo.updated_at).toBe(true);
  });

  it('should handle updates for different company info sections', async () => {
    // Create multiple company info sections
    const visionInfo = await db.insert(companyInfoTable)
      .values({
        section: 'vision',
        title: 'Our Vision',
        content: 'Original vision content'
      })
      .returning()
      .execute();

    const valuesInfo = await db.insert(companyInfoTable)
      .values({
        section: 'values',
        title: 'Our Values',
        content: 'Original values content'
      })
      .returning()
      .execute();

    // Update vision section
    const visionUpdateInput: UpdateCompanyInfoInput = {
      id: visionInfo[0].id,
      title: 'Updated Vision Title',
      content: 'Updated vision content for the future'
    };

    const updatedVision = await updateCompanyInfo(visionUpdateInput);

    // Update values section
    const valuesUpdateInput: UpdateCompanyInfoInput = {
      id: valuesInfo[0].id,
      content: 'Updated core values and principles'
    };

    const updatedValues = await updateCompanyInfo(valuesUpdateInput);

    // Verify vision updates
    expect(updatedVision.section).toEqual('vision');
    expect(updatedVision.title).toEqual('Updated Vision Title');
    expect(updatedVision.content).toEqual('Updated vision content for the future');

    // Verify values updates
    expect(updatedValues.section).toEqual('values');
    expect(updatedValues.title).toEqual('Our Values'); // Should remain unchanged
    expect(updatedValues.content).toEqual('Updated core values and principles');
  });

  it('should throw error when company info id does not exist', async () => {
    const nonExistentId = 99999;
    
    const updateInput: UpdateCompanyInfoInput = {
      id: nonExistentId,
      title: 'This should fail'
    };

    await expect(updateCompanyInfo(updateInput)).rejects.toThrow(/Company info with id 99999 not found/i);
  });

  it('should handle minimal update with only updated_at change', async () => {
    const companyInfo = await createTestCompanyInfo();
    const originalUpdatedAt = companyInfo.updated_at;
    
    // Update with no actual field changes (only updated_at should change)
    const updateInput: UpdateCompanyInfoInput = {
      id: companyInfo.id
    };

    const result = await updateCompanyInfo(updateInput);

    // Verify structure remains the same but updated_at changed
    expect(result.id).toEqual(companyInfo.id);
    expect(result.section).toEqual(companyInfo.section);
    expect(result.title).toEqual(companyInfo.title);
    expect(result.content).toEqual(companyInfo.content);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > originalUpdatedAt).toBe(true);
  });
});