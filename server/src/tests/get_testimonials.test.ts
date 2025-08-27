import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { testimonialsTable } from '../db/schema';
import { type CreateTestimonialInput } from '../schema';
import { getTestimonials } from '../handlers/get_testimonials';

// Test data for creating testimonials
const testTestimonial1: CreateTestimonialInput = {
  client_name: 'John Smith',
  company: 'ABC Shipping Co.',
  quote: 'Excellent service and fast delivery. Highly recommended for all logistics needs.',
  is_active: true,
  display_order: 1
};

const testTestimonial2: CreateTestimonialInput = {
  client_name: 'Sarah Johnson',
  company: 'Global Trade Ltd.',
  quote: 'Professional team with outstanding customs clearance expertise.',
  is_active: true,
  display_order: 2
};

const testTestimonial3: CreateTestimonialInput = {
  client_name: 'Mike Chen',
  company: 'Import Export Solutions',
  quote: 'Reliable warehousing and inventory management services.',
  is_active: false, // Inactive testimonial
  display_order: 3
};

describe('getTestimonials', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no testimonials exist', async () => {
    const result = await getTestimonials();

    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return only active testimonials', async () => {
    // Create test testimonials - mix of active and inactive
    await db.insert(testimonialsTable)
      .values([
        {
          client_name: testTestimonial1.client_name,
          company: testTestimonial1.company,
          quote: testTestimonial1.quote,
          is_active: testTestimonial1.is_active!,
          display_order: testTestimonial1.display_order!
        },
        {
          client_name: testTestimonial2.client_name,
          company: testTestimonial2.company,
          quote: testTestimonial2.quote,
          is_active: testTestimonial2.is_active!,
          display_order: testTestimonial2.display_order!
        },
        {
          client_name: testTestimonial3.client_name,
          company: testTestimonial3.company,
          quote: testTestimonial3.quote,
          is_active: testTestimonial3.is_active!,
          display_order: testTestimonial3.display_order!
        }
      ])
      .execute();

    const result = await getTestimonials();

    // Should return only active testimonials (first 2)
    expect(result).toHaveLength(2);
    expect(result.every(t => t.is_active)).toBe(true);
    
    // Verify correct testimonials are returned
    const names = result.map(t => t.client_name);
    expect(names).toContain('John Smith');
    expect(names).toContain('Sarah Johnson');
    expect(names).not.toContain('Mike Chen'); // Inactive one should be excluded
  });

  it('should return testimonials ordered by display_order ascending', async () => {
    // Create testimonials with mixed display orders
    await db.insert(testimonialsTable)
      .values([
        {
          client_name: 'Third Testimonial',
          company: 'Company C',
          quote: 'This should appear third in results.',
          is_active: true,
          display_order: 30
        },
        {
          client_name: 'First Testimonial',
          company: 'Company A',
          quote: 'This should appear first in results.',
          is_active: true,
          display_order: 10
        },
        {
          client_name: 'Second Testimonial',
          company: 'Company B',
          quote: 'This should appear second in results.',
          is_active: true,
          display_order: 20
        }
      ])
      .execute();

    const result = await getTestimonials();

    expect(result).toHaveLength(3);
    
    // Verify correct ordering by display_order
    expect(result[0].display_order).toBe(10);
    expect(result[0].client_name).toBe('First Testimonial');
    
    expect(result[1].display_order).toBe(20);
    expect(result[1].client_name).toBe('Second Testimonial');
    
    expect(result[2].display_order).toBe(30);
    expect(result[2].client_name).toBe('Third Testimonial');
  });

  it('should return testimonials with all required fields', async () => {
    await db.insert(testimonialsTable)
      .values({
        client_name: testTestimonial1.client_name,
        company: testTestimonial1.company,
        quote: testTestimonial1.quote,
        is_active: testTestimonial1.is_active!,
        display_order: testTestimonial1.display_order!
      })
      .execute();

    const result = await getTestimonials();

    expect(result).toHaveLength(1);
    const testimonial = result[0];
    
    // Verify all fields are present and correct
    expect(testimonial.id).toBeDefined();
    expect(typeof testimonial.id).toBe('number');
    expect(testimonial.client_name).toBe('John Smith');
    expect(testimonial.company).toBe('ABC Shipping Co.');
    expect(testimonial.quote).toBe('Excellent service and fast delivery. Highly recommended for all logistics needs.');
    expect(testimonial.is_active).toBe(true);
    expect(testimonial.display_order).toBe(1);
    expect(testimonial.created_at).toBeInstanceOf(Date);
  });

  it('should handle mixed active/inactive testimonials with same display_order', async () => {
    // Create testimonials where active and inactive have same display_order
    await db.insert(testimonialsTable)
      .values([
        {
          client_name: 'Active Client',
          company: 'Active Company',
          quote: 'Great service from active testimonial.',
          is_active: true,
          display_order: 1
        },
        {
          client_name: 'Inactive Client',
          company: 'Inactive Company',
          quote: 'This testimonial is inactive.',
          is_active: false,
          display_order: 1
        },
        {
          client_name: 'Another Active Client',
          company: 'Another Company',
          quote: 'Another great testimonial.',
          is_active: true,
          display_order: 2
        }
      ])
      .execute();

    const result = await getTestimonials();

    // Should return only active testimonials, properly ordered
    expect(result).toHaveLength(2);
    expect(result.every(t => t.is_active)).toBe(true);
    
    // Verify correct ordering
    expect(result[0].display_order).toBe(1);
    expect(result[0].client_name).toBe('Active Client');
    expect(result[1].display_order).toBe(2);
    expect(result[1].client_name).toBe('Another Active Client');
  });
});