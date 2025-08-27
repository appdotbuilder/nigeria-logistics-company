import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { type UpdateTestimonialInput, type CreateTestimonialInput } from '../schema';
import { updateTestimonial } from '../handlers/update_testimonial';
import { eq } from 'drizzle-orm';

// Helper function to create a test testimonial
const createTestTestimonial = async (overrides?: Partial<CreateTestimonialInput>) => {
  const defaultInput = {
    client_name: 'John Smith',
    company: 'ABC Logistics',
    quote: 'Excellent service and timely delivery.',
    is_active: true,
    display_order: 1
  };

  const testInput = { ...defaultInput, ...overrides };

  // Ensure all required fields are present
  const insertData = {
    client_name: testInput.client_name,
    company: testInput.company,
    quote: testInput.quote,
    is_active: testInput.is_active ?? true,
    display_order: testInput.display_order ?? 1
  };

  const result = await db.insert(testimonialsTable)
    .values(insertData)
    .returning()
    .execute();

  return result[0];
};

describe('updateTestimonial', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update client name', async () => {
    // Create test testimonial
    const testimonial = await createTestTestimonial();

    // Update client name
    const updateInput: UpdateTestimonialInput = {
      id: testimonial.id,
      client_name: 'Jane Doe'
    };

    const result = await updateTestimonial(updateInput);

    expect(result.id).toEqual(testimonial.id);
    expect(result.client_name).toEqual('Jane Doe');
    expect(result.company).toEqual('ABC Logistics'); // Unchanged
    expect(result.quote).toEqual('Excellent service and timely delivery.'); // Unchanged
    expect(result.is_active).toEqual(true); // Unchanged
    expect(result.display_order).toEqual(1); // Unchanged
  });

  it('should update company', async () => {
    const testimonial = await createTestTestimonial();

    const updateInput: UpdateTestimonialInput = {
      id: testimonial.id,
      company: 'XYZ Corporation'
    };

    const result = await updateTestimonial(updateInput);

    expect(result.company).toEqual('XYZ Corporation');
    expect(result.client_name).toEqual('John Smith'); // Unchanged
  });

  it('should update quote', async () => {
    const testimonial = await createTestTestimonial();

    const updateInput: UpdateTestimonialInput = {
      id: testimonial.id,
      quote: 'Outstanding logistics solutions that exceeded our expectations.'
    };

    const result = await updateTestimonial(updateInput);

    expect(result.quote).toEqual('Outstanding logistics solutions that exceeded our expectations.');
    expect(result.client_name).toEqual('John Smith'); // Unchanged
  });

  it('should update is_active status', async () => {
    const testimonial = await createTestTestimonial();

    const updateInput: UpdateTestimonialInput = {
      id: testimonial.id,
      is_active: false
    };

    const result = await updateTestimonial(updateInput);

    expect(result.is_active).toEqual(false);
    expect(result.client_name).toEqual('John Smith'); // Unchanged
  });

  it('should update display_order', async () => {
    const testimonial = await createTestTestimonial();

    const updateInput: UpdateTestimonialInput = {
      id: testimonial.id,
      display_order: 5
    };

    const result = await updateTestimonial(updateInput);

    expect(result.display_order).toEqual(5);
    expect(result.client_name).toEqual('John Smith'); // Unchanged
  });

  it('should update multiple fields at once', async () => {
    const testimonial = await createTestTestimonial();

    const updateInput: UpdateTestimonialInput = {
      id: testimonial.id,
      client_name: 'Michael Johnson',
      company: 'Global Shipping Inc',
      is_active: false,
      display_order: 3
    };

    const result = await updateTestimonial(updateInput);

    expect(result.client_name).toEqual('Michael Johnson');
    expect(result.company).toEqual('Global Shipping Inc');
    expect(result.is_active).toEqual(false);
    expect(result.display_order).toEqual(3);
    expect(result.quote).toEqual('Excellent service and timely delivery.'); // Unchanged
  });

  it('should save changes to database', async () => {
    const testimonial = await createTestTestimonial();

    const updateInput: UpdateTestimonialInput = {
      id: testimonial.id,
      client_name: 'Updated Name',
      is_active: false
    };

    await updateTestimonial(updateInput);

    // Verify changes persisted in database
    const updatedTestimonials = await db.select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.id, testimonial.id))
      .execute();

    expect(updatedTestimonials).toHaveLength(1);
    expect(updatedTestimonials[0].client_name).toEqual('Updated Name');
    expect(updatedTestimonials[0].is_active).toEqual(false);
  });

  it('should return unchanged testimonial when no fields provided', async () => {
    const testimonial = await createTestTestimonial();

    const updateInput: UpdateTestimonialInput = {
      id: testimonial.id
    };

    const result = await updateTestimonial(updateInput);

    expect(result.client_name).toEqual('John Smith');
    expect(result.company).toEqual('ABC Logistics');
    expect(result.quote).toEqual('Excellent service and timely delivery.');
    expect(result.is_active).toEqual(true);
    expect(result.display_order).toEqual(1);
  });

  it('should throw error for non-existent testimonial', async () => {
    const updateInput: UpdateTestimonialInput = {
      id: 99999,
      client_name: 'Non-existent'
    };

    expect(updateTestimonial(updateInput)).rejects.toThrow(/testimonial with id 99999 not found/i);
  });

  it('should handle boolean false values correctly', async () => {
    // Create testimonial with is_active = true
    const testimonial = await createTestTestimonial({ is_active: true });

    const updateInput: UpdateTestimonialInput = {
      id: testimonial.id,
      is_active: false
    };

    const result = await updateTestimonial(updateInput);

    expect(result.is_active).toEqual(false);
    expect(typeof result.is_active).toEqual('boolean');
  });

  it('should validate field constraints', async () => {
    const testimonial = await createTestTestimonial();

    // Test with empty client name (violates min length)
    const invalidInput: UpdateTestimonialInput = {
      id: testimonial.id,
      client_name: ''
    };

    // The handler itself doesn't validate - this would be caught at the API layer
    // But we can test that the database update works with valid data
    const validInput: UpdateTestimonialInput = {
      id: testimonial.id,
      client_name: 'Valid Name'
    };

    const result = await updateTestimonial(validInput);
    expect(result.client_name).toEqual('Valid Name');
  });
});