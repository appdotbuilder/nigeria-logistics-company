import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactInquiriesTable } from '../db/schema';
import { type CreateContactInquiryInput } from '../schema';
import { getContactInquiries } from '../handlers/get_contact_inquiries';
import { eq } from 'drizzle-orm';

// Test contact inquiry inputs
const testInquiry1: CreateContactInquiryInput = {
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone_number: '+1-555-0123',
  company: 'ABC Corporation',
  service_of_interest: 'customs_clearance',
  message: 'We need customs clearance services for our upcoming shipment from China.'
};

const testInquiry2: CreateContactInquiryInput = {
  name: 'Sarah Johnson',
  email: 'sarah@testcompany.com',
  phone_number: '+1-555-0456',
  company: null, // Individual inquiry without company
  service_of_interest: 'shipping_agency',
  message: 'Looking for reliable shipping agency services for regular deliveries.'
};

const testInquiry3: CreateContactInquiryInput = {
  name: 'Mike Wilson',
  email: 'mike.wilson@logistics.com',
  phone_number: '+1-555-0789',
  company: 'Wilson Logistics',
  service_of_interest: 'warehousing',
  message: 'Need warehousing solutions for our expanding inventory requirements.'
};

describe('getContactInquiries', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no inquiries exist', async () => {
    const result = await getContactInquiries();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should fetch all contact inquiries', async () => {
    // Create test inquiries
    await db.insert(contactInquiriesTable)
      .values([
        {
          name: testInquiry1.name,
          email: testInquiry1.email,
          phone_number: testInquiry1.phone_number,
          company: testInquiry1.company,
          service_of_interest: testInquiry1.service_of_interest,
          message: testInquiry1.message
        },
        {
          name: testInquiry2.name,
          email: testInquiry2.email,
          phone_number: testInquiry2.phone_number,
          company: testInquiry2.company,
          service_of_interest: testInquiry2.service_of_interest,
          message: testInquiry2.message
        },
        {
          name: testInquiry3.name,
          email: testInquiry3.email,
          phone_number: testInquiry3.phone_number,
          company: testInquiry3.company,
          service_of_interest: testInquiry3.service_of_interest,
          message: testInquiry3.message
        }
      ])
      .execute();

    const result = await getContactInquiries();

    expect(result).toHaveLength(3);

    // Verify all inquiries are included
    const names = result.map(inquiry => inquiry.name);
    expect(names).toContain('John Smith');
    expect(names).toContain('Sarah Johnson');
    expect(names).toContain('Mike Wilson');

    // Verify structure and data integrity
    result.forEach(inquiry => {
      expect(inquiry.id).toBeDefined();
      expect(inquiry.name).toBeDefined();
      expect(inquiry.email).toBeDefined();
      expect(inquiry.phone_number).toBeDefined();
      expect(inquiry.service_of_interest).toBeDefined();
      expect(inquiry.message).toBeDefined();
      expect(inquiry.created_at).toBeInstanceOf(Date);
      expect(inquiry.status).toEqual('new'); // Default status
    });
  });

  it('should return inquiries ordered by creation date (newest first)', async () => {
    // Create inquiries with slight delay to ensure different timestamps
    const firstInquiry = await db.insert(contactInquiriesTable)
      .values({
        name: 'First User',
        email: 'first@example.com',
        phone_number: '+1-555-0001',
        company: 'First Company',
        service_of_interest: 'customs_clearance',
        message: 'First inquiry message'
      })
      .returning()
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const secondInquiry = await db.insert(contactInquiriesTable)
      .values({
        name: 'Second User',
        email: 'second@example.com',
        phone_number: '+1-555-0002',
        company: 'Second Company',
        service_of_interest: 'shipping_agency',
        message: 'Second inquiry message'
      })
      .returning()
      .execute();

    const result = await getContactInquiries();

    expect(result).toHaveLength(2);
    
    // Verify newest first ordering
    expect(result[0].name).toEqual('Second User');
    expect(result[1].name).toEqual('First User');
    
    // Verify timestamp ordering
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should handle different inquiry statuses correctly', async () => {
    // Create inquiries with different statuses
    await db.insert(contactInquiriesTable)
      .values([
        {
          name: 'New Inquiry',
          email: 'new@example.com',
          phone_number: '+1-555-0100',
          company: 'New Company',
          service_of_interest: 'customs_clearance',
          message: 'New inquiry',
          status: 'new'
        },
        {
          name: 'In Progress Inquiry',
          email: 'progress@example.com',
          phone_number: '+1-555-0200',
          company: 'Progress Company',
          service_of_interest: 'shipping_agency',
          message: 'In progress inquiry',
          status: 'in_progress'
        },
        {
          name: 'Resolved Inquiry',
          email: 'resolved@example.com',
          phone_number: '+1-555-0300',
          company: 'Resolved Company',
          service_of_interest: 'warehousing',
          message: 'Resolved inquiry',
          status: 'resolved'
        }
      ])
      .execute();

    const result = await getContactInquiries();

    expect(result).toHaveLength(3);

    // Verify all statuses are returned
    const statuses = result.map(inquiry => inquiry.status);
    expect(statuses).toContain('new');
    expect(statuses).toContain('in_progress');
    expect(statuses).toContain('resolved');

    // Verify each inquiry has correct status
    const newInquiry = result.find(inquiry => inquiry.name === 'New Inquiry');
    const progressInquiry = result.find(inquiry => inquiry.name === 'In Progress Inquiry');
    const resolvedInquiry = result.find(inquiry => inquiry.name === 'Resolved Inquiry');

    expect(newInquiry?.status).toEqual('new');
    expect(progressInquiry?.status).toEqual('in_progress');
    expect(resolvedInquiry?.status).toEqual('resolved');
  });

  it('should handle inquiries with null company values', async () => {
    await db.insert(contactInquiriesTable)
      .values({
        name: 'Individual User',
        email: 'individual@example.com',
        phone_number: '+1-555-0999',
        company: null, // Null company
        service_of_interest: 'ecommerce_delivery',
        message: 'Individual inquiry without company affiliation'
      })
      .execute();

    const result = await getContactInquiries();

    expect(result).toHaveLength(1);
    expect(result[0].company).toBeNull();
    expect(result[0].name).toEqual('Individual User');
    expect(result[0].service_of_interest).toEqual('ecommerce_delivery');
  });

  it('should verify inquiry data persists correctly in database', async () => {
    const testData = {
      name: 'Database Test User',
      email: 'dbtest@example.com',
      phone_number: '+1-555-9999',
      company: 'Database Test Corp',
      service_of_interest: 'logistics_consulting' as const,
      message: 'Testing database persistence and data integrity'
    };

    // Insert directly into database
    const inserted = await db.insert(contactInquiriesTable)
      .values(testData)
      .returning()
      .execute();

    // Fetch via handler
    const result = await getContactInquiries();

    // Verify data consistency
    expect(result).toHaveLength(1);
    const inquiry = result[0];
    
    expect(inquiry.id).toEqual(inserted[0].id);
    expect(inquiry.name).toEqual(testData.name);
    expect(inquiry.email).toEqual(testData.email);
    expect(inquiry.phone_number).toEqual(testData.phone_number);
    expect(inquiry.company).toEqual(testData.company);
    expect(inquiry.service_of_interest).toEqual(testData.service_of_interest);
    expect(inquiry.message).toEqual(testData.message);
    expect(inquiry.status).toEqual('new');
    expect(inquiry.created_at).toBeInstanceOf(Date);

    // Verify database query returns same data
    const dbResult = await db.select()
      .from(contactInquiriesTable)
      .where(eq(contactInquiriesTable.id, inquiry.id))
      .execute();

    expect(dbResult).toHaveLength(1);
    expect(dbResult[0].name).toEqual(testData.name);
    expect(dbResult[0].email).toEqual(testData.email);
    expect(dbResult[0].created_at).toBeInstanceOf(Date);
  });
});