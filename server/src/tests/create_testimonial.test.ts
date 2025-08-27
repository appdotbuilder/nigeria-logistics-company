import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { type CreateTestimonialInput } from '../schema';
import { createTestimonial } from '../handlers/create_testimonial';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateTestimonialInput = {
  client_name: 'John Smith',
  company: 'Global Imports Inc.',
  quote: 'Excellent logistics services that helped streamline our supply chain operations.',
  is_active: true,
  display_order: 5
};

// Minimal test input (relying on Zod defaults)
const minimalInput: CreateTestimonialInput = {
  client_name: 'Jane Doe',
  company: 'Tech Solutions LLC',
  quote: 'Outstanding customer service and reliable delivery times for all our shipments.'
};

describe('createTestimonial', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a testimonial with all fields', async () => {
    const result = await createTestimonial(testInput);

    // Basic field validation
    expect(result.client_name).toEqual('John Smith');
    expect(result.company).toEqual('Global Imports Inc.');
    expect(result.quote).toEqual('Excellent logistics services that helped streamline our supply chain operations.');
    expect(result.is_active).toEqual(true);
    expect(result.display_order).toEqual(5);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a testimonial with default values', async () => {
    const result = await createTestimonial(minimalInput);

    // Verify required fields
    expect(result.client_name).toEqual('Jane Doe');
    expect(result.company).toEqual('Tech Solutions LLC');
    expect(result.quote).toEqual('Outstanding customer service and reliable delivery times for all our shipments.');
    
    // Verify defaults are applied
    expect(result.is_active).toEqual(true); // Default from Zod schema
    expect(result.display_order).toEqual(1); // Default from handler
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save testimonial to database', async () => {
    const result = await createTestimonial(testInput);

    // Query database to verify testimonial was saved
    const testimonials = await db.select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.id, result.id))
      .execute();

    expect(testimonials).toHaveLength(1);
    expect(testimonials[0].client_name).toEqual('John Smith');
    expect(testimonials[0].company).toEqual('Global Imports Inc.');
    expect(testimonials[0].quote).toEqual('Excellent logistics services that helped streamline our supply chain operations.');
    expect(testimonials[0].is_active).toEqual(true);
    expect(testimonials[0].display_order).toEqual(5);
    expect(testimonials[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle inactive testimonials correctly', async () => {
    const inactiveInput: CreateTestimonialInput = {
      client_name: 'Mike Johnson',
      company: 'Retail Partners',
      quote: 'Professional logistics support that exceeded our expectations.',
      is_active: false,
      display_order: 10
    };

    const result = await createTestimonial(inactiveInput);

    expect(result.is_active).toEqual(false);
    expect(result.display_order).toEqual(10);

    // Verify in database
    const testimonials = await db.select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.id, result.id))
      .execute();

    expect(testimonials[0].is_active).toEqual(false);
    expect(testimonials[0].display_order).toEqual(10);
  });

  it('should create multiple testimonials with different display orders', async () => {
    const firstTestimonial = await createTestimonial({
      client_name: 'Alice Wilson',
      company: 'Manufacturing Co.',
      quote: 'Reliable and efficient logistics solutions.',
      display_order: 1
    });

    const secondTestimonial = await createTestimonial({
      client_name: 'Bob Davis',
      company: 'Export Corp.',
      quote: 'Excellent port-to-door delivery services.',
      display_order: 2
    });

    // Verify both testimonials exist with correct order
    expect(firstTestimonial.display_order).toEqual(1);
    expect(secondTestimonial.display_order).toEqual(2);
    expect(firstTestimonial.id).not.toEqual(secondTestimonial.id);

    // Verify in database
    const allTestimonials = await db.select()
      .from(testimonialsTable)
      .execute();

    expect(allTestimonials).toHaveLength(2);
    
    const orders = allTestimonials.map(t => t.display_order).sort();
    expect(orders).toEqual([1, 2]);
  });

  it('should handle long quotes correctly', async () => {
    const longQuote = 'This is a very detailed testimonial about the exceptional logistics services provided by this company. They handled our complex international shipping requirements with professionalism and efficiency that exceeded all our expectations.';

    const longQuoteInput: CreateTestimonialInput = {
      client_name: 'Sarah Thompson',
      company: 'International Trading Ltd.',
      quote: longQuote
    };

    const result = await createTestimonial(longQuoteInput);

    expect(result.quote).toEqual(longQuote);
    expect(result.quote.length).toBeGreaterThan(10); // Zod minimum validation

    // Verify in database
    const testimonials = await db.select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.id, result.id))
      .execute();

    expect(testimonials[0].quote).toEqual(longQuote);
  });
});