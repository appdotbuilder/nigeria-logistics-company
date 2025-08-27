import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactInquiriesTable } from '../db/schema';
import { type CreateContactInquiryInput } from '../schema';
import { createContactInquiry } from '../handlers/create_contact_inquiry';
import { eq, and, gte } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateContactInquiryInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone_number: '+1-555-123-4567',
  company: 'Acme Corporation',
  service_of_interest: 'customs_clearance',
  message: 'I need help with customs clearance for my shipment from China. Please contact me.'
};

// Test input without optional company field
const testInputNoCompany: CreateContactInquiryInput = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone_number: '+1-555-987-6543',
  service_of_interest: 'shipping_agency',
  message: 'Looking for shipping agency services for regular imports from Europe.'
};

describe('createContactInquiry', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact inquiry with company', async () => {
    const result = await createContactInquiry(testInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.phone_number).toEqual('+1-555-123-4567');
    expect(result.company).toEqual('Acme Corporation');
    expect(result.service_of_interest).toEqual('customs_clearance');
    expect(result.message).toEqual('I need help with customs clearance for my shipment from China. Please contact me.');
    expect(result.status).toEqual('new');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a contact inquiry without company', async () => {
    const result = await createContactInquiry(testInputNoCompany);

    // Basic field validation
    expect(result.name).toEqual('Jane Smith');
    expect(result.email).toEqual('jane.smith@example.com');
    expect(result.phone_number).toEqual('+1-555-987-6543');
    expect(result.company).toBeNull();
    expect(result.service_of_interest).toEqual('shipping_agency');
    expect(result.message).toEqual('Looking for shipping agency services for regular imports from Europe.');
    expect(result.status).toEqual('new');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact inquiry to database', async () => {
    const result = await createContactInquiry(testInput);

    // Query using proper drizzle syntax
    const inquiries = await db.select()
      .from(contactInquiriesTable)
      .where(eq(contactInquiriesTable.id, result.id))
      .execute();

    expect(inquiries).toHaveLength(1);
    expect(inquiries[0].name).toEqual('John Doe');
    expect(inquiries[0].email).toEqual('john.doe@example.com');
    expect(inquiries[0].phone_number).toEqual('+1-555-123-4567');
    expect(inquiries[0].company).toEqual('Acme Corporation');
    expect(inquiries[0].service_of_interest).toEqual('customs_clearance');
    expect(inquiries[0].status).toEqual('new');
    expect(inquiries[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle all service types correctly', async () => {
    const serviceTypes = [
      'customs_clearance',
      'shipping_agency', 
      'port_to_door_delivery',
      'truck_fleet_management',
      'warehousing',
      'inventory_solutions',
      'ecommerce_delivery',
      'logistics_consulting'
    ] as const;

    for (const serviceType of serviceTypes) {
      const input = {
        ...testInput,
        email: `test.${serviceType}@example.com`, // Unique email for each test
        service_of_interest: serviceType
      };

      const result = await createContactInquiry(input);
      expect(result.service_of_interest).toEqual(serviceType);
    }
  });

  it('should query inquiries by date range correctly', async () => {
    // Create test inquiry
    await createContactInquiry(testInput);

    // Test date filtering
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Query for recent inquiries
    const inquiries = await db.select()
      .from(contactInquiriesTable)
      .where(
        and(
          gte(contactInquiriesTable.created_at, yesterday),
          eq(contactInquiriesTable.email, testInput.email)
        )
      )
      .execute();

    expect(inquiries.length).toBeGreaterThan(0);
    inquiries.forEach(inquiry => {
      expect(inquiry.created_at).toBeInstanceOf(Date);
      expect(inquiry.created_at >= yesterday).toBe(true);
    });
  });

  it('should handle null company field correctly', async () => {
    const inputWithNullCompany = {
      ...testInput,
      company: null
    };

    const result = await createContactInquiry(inputWithNullCompany);
    expect(result.company).toBeNull();

    // Verify in database
    const inquiries = await db.select()
      .from(contactInquiriesTable)
      .where(eq(contactInquiriesTable.id, result.id))
      .execute();

    expect(inquiries[0].company).toBeNull();
  });
});