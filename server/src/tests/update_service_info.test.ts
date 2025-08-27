import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { serviceInfoTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type UpdateServiceInfoInput } from '../schema';
import { updateServiceInfo } from '../handlers/update_service_info';

describe('updateServiceInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper function to create a test service info record
  const createTestServiceInfo = async () => {
    const result = await db.insert(serviceInfoTable)
      .values({
        service_type: 'customs_clearance',
        title: 'Original Title',
        description: 'Original description for testing',
        icon: 'original-icon',
        is_featured: false,
        display_order: 1
      })
      .returning()
      .execute();

    return result[0];
  };

  it('should update service info title', async () => {
    const testRecord = await createTestServiceInfo();

    const updateInput: UpdateServiceInfoInput = {
      id: testRecord.id,
      title: 'Updated Title'
    };

    const result = await updateServiceInfo(updateInput);

    expect(result.id).toEqual(testRecord.id);
    expect(result.title).toEqual('Updated Title');
    expect(result.description).toEqual('Original description for testing'); // Unchanged
    expect(result.service_type).toEqual('customs_clearance');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update service info description', async () => {
    const testRecord = await createTestServiceInfo();

    const updateInput: UpdateServiceInfoInput = {
      id: testRecord.id,
      description: 'Updated description with new information'
    };

    const result = await updateServiceInfo(updateInput);

    expect(result.description).toEqual('Updated description with new information');
    expect(result.title).toEqual('Original Title'); // Unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update is_featured status', async () => {
    const testRecord = await createTestServiceInfo();

    const updateInput: UpdateServiceInfoInput = {
      id: testRecord.id,
      is_featured: true
    };

    const result = await updateServiceInfo(updateInput);

    expect(result.is_featured).toBe(true);
    expect(result.title).toEqual('Original Title'); // Unchanged
  });

  it('should update display_order', async () => {
    const testRecord = await createTestServiceInfo();

    const updateInput: UpdateServiceInfoInput = {
      id: testRecord.id,
      display_order: 5
    };

    const result = await updateServiceInfo(updateInput);

    expect(result.display_order).toEqual(5);
    expect(result.title).toEqual('Original Title'); // Unchanged
  });

  it('should update icon field', async () => {
    const testRecord = await createTestServiceInfo();

    const updateInput: UpdateServiceInfoInput = {
      id: testRecord.id,
      icon: 'new-icon-name'
    };

    const result = await updateServiceInfo(updateInput);

    expect(result.icon).toEqual('new-icon-name');
    expect(result.title).toEqual('Original Title'); // Unchanged
  });

  it('should set icon to null', async () => {
    const testRecord = await createTestServiceInfo();

    const updateInput: UpdateServiceInfoInput = {
      id: testRecord.id,
      icon: null
    };

    const result = await updateServiceInfo(updateInput);

    expect(result.icon).toBeNull();
    expect(result.title).toEqual('Original Title'); // Unchanged
  });

  it('should update multiple fields at once', async () => {
    const testRecord = await createTestServiceInfo();

    const updateInput: UpdateServiceInfoInput = {
      id: testRecord.id,
      title: 'Multi-Update Title',
      description: 'Multi-update description',
      is_featured: true,
      display_order: 10,
      icon: 'multi-update-icon'
    };

    const result = await updateServiceInfo(updateInput);

    expect(result.title).toEqual('Multi-Update Title');
    expect(result.description).toEqual('Multi-update description');
    expect(result.is_featured).toBe(true);
    expect(result.display_order).toEqual(10);
    expect(result.icon).toEqual('multi-update-icon');
    expect(result.service_type).toEqual('customs_clearance'); // Unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should persist changes to database', async () => {
    const testRecord = await createTestServiceInfo();

    const updateInput: UpdateServiceInfoInput = {
      id: testRecord.id,
      title: 'Database Persistence Test',
      is_featured: true
    };

    await updateServiceInfo(updateInput);

    // Query database directly to verify persistence
    const persisted = await db.select()
      .from(serviceInfoTable)
      .where(eq(serviceInfoTable.id, testRecord.id))
      .execute();

    expect(persisted).toHaveLength(1);
    expect(persisted[0].title).toEqual('Database Persistence Test');
    expect(persisted[0].is_featured).toBe(true);
    expect(persisted[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update the updated_at timestamp', async () => {
    const testRecord = await createTestServiceInfo();
    const originalTimestamp = testRecord.updated_at;

    // Small delay to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdateServiceInfoInput = {
      id: testRecord.id,
      title: 'Timestamp Test'
    };

    const result = await updateServiceInfo(updateInput);

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalTimestamp.getTime());
  });

  it('should throw error for non-existent service info id', async () => {
    const updateInput: UpdateServiceInfoInput = {
      id: 999999, // Non-existent ID
      title: 'This should fail'
    };

    await expect(updateServiceInfo(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should handle empty update gracefully', async () => {
    const testRecord = await createTestServiceInfo();

    const updateInput: UpdateServiceInfoInput = {
      id: testRecord.id
      // No other fields provided
    };

    const result = await updateServiceInfo(updateInput);

    // Should still update the updated_at field
    expect(result.id).toEqual(testRecord.id);
    expect(result.title).toEqual('Original Title'); // Unchanged
    expect(result.description).toEqual('Original description for testing'); // Unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(testRecord.updated_at.getTime());
  });
});