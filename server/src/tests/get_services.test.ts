import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { serviceInfoTable } from '../db/schema';
import { getServices } from '../handlers/get_services';
import { eq } from 'drizzle-orm';

// Test data for services
const testServices = [
  {
    service_type: 'customs_clearance' as const,
    title: 'Customs Clearance',
    description: 'Professional customs clearance services for international shipments',
    icon: 'customs-icon',
    is_featured: true,
    display_order: 1
  },
  {
    service_type: 'shipping_agency' as const,
    title: 'Shipping Agency',
    description: 'Comprehensive shipping agency services',
    icon: 'ship-icon',
    is_featured: false,
    display_order: 3
  },
  {
    service_type: 'port_to_door_delivery' as const,
    title: 'Port to Door Delivery',
    description: 'Complete door-to-door delivery solutions',
    icon: null,
    is_featured: true,
    display_order: 2
  }
];

describe('getServices', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no services exist', async () => {
    const result = await getServices();
    expect(result).toEqual([]);
  });

  it('should return all services ordered by display_order', async () => {
    // Insert test services
    await db.insert(serviceInfoTable)
      .values(testServices)
      .execute();

    const result = await getServices();

    // Should return all 3 services
    expect(result).toHaveLength(3);

    // Should be ordered by display_order (1, 2, 3)
    expect(result[0].title).toEqual('Customs Clearance');
    expect(result[0].display_order).toEqual(1);
    expect(result[1].title).toEqual('Port to Door Delivery');
    expect(result[1].display_order).toEqual(2);
    expect(result[2].title).toEqual('Shipping Agency');
    expect(result[2].display_order).toEqual(3);
  });

  it('should return services with all fields correctly', async () => {
    // Insert single service for detailed field validation
    await db.insert(serviceInfoTable)
      .values(testServices[0])
      .execute();

    const result = await getServices();

    expect(result).toHaveLength(1);
    const service = result[0];

    // Validate all fields
    expect(service.service_type).toEqual('customs_clearance');
    expect(service.title).toEqual('Customs Clearance');
    expect(service.description).toEqual('Professional customs clearance services for international shipments');
    expect(service.icon).toEqual('customs-icon');
    expect(service.is_featured).toEqual(true);
    expect(service.display_order).toEqual(1);
    expect(service.id).toBeDefined();
    expect(service.updated_at).toBeInstanceOf(Date);
  });

  it('should handle services with null icon field', async () => {
    // Insert service with null icon
    await db.insert(serviceInfoTable)
      .values({
        service_type: 'warehousing',
        title: 'Warehousing Solutions',
        description: 'Modern warehousing and storage solutions',
        icon: null,
        is_featured: false,
        display_order: 1
      })
      .execute();

    const result = await getServices();

    expect(result).toHaveLength(1);
    expect(result[0].icon).toBeNull();
    expect(result[0].title).toEqual('Warehousing Solutions');
  });

  it('should maintain correct order with mixed display_order values', async () => {
    // Insert services with non-sequential display_order
    const mixedOrderServices = [
      {
        service_type: 'logistics_consulting' as const,
        title: 'Logistics Consulting',
        description: 'Expert logistics consulting services',
        icon: 'consulting-icon',
        is_featured: false,
        display_order: 10
      },
      {
        service_type: 'ecommerce_delivery' as const,
        title: 'E-commerce Delivery',
        description: 'Fast e-commerce delivery solutions',
        icon: 'delivery-icon',
        is_featured: true,
        display_order: 5
      },
      {
        service_type: 'truck_fleet_management' as const,
        title: 'Truck Fleet Management',
        description: 'Professional fleet management services',
        icon: 'truck-icon',
        is_featured: false,
        display_order: 1
      }
    ];

    await db.insert(serviceInfoTable)
      .values(mixedOrderServices)
      .execute();

    const result = await getServices();

    // Should be ordered by display_order: 1, 5, 10
    expect(result).toHaveLength(3);
    expect(result[0].display_order).toEqual(1);
    expect(result[0].title).toEqual('Truck Fleet Management');
    expect(result[1].display_order).toEqual(5);
    expect(result[1].title).toEqual('E-commerce Delivery');
    expect(result[2].display_order).toEqual(10);
    expect(result[2].title).toEqual('Logistics Consulting');
  });

  it('should include both featured and non-featured services', async () => {
    await db.insert(serviceInfoTable)
      .values(testServices)
      .execute();

    const result = await getServices();

    const featuredServices = result.filter(s => s.is_featured);
    const nonFeaturedServices = result.filter(s => !s.is_featured);

    expect(featuredServices).toHaveLength(2);
    expect(nonFeaturedServices).toHaveLength(1);
    expect(result).toHaveLength(3);
  });

  it('should verify services are saved correctly in database', async () => {
    await getServices(); // Call handler first

    // Insert a service
    await db.insert(serviceInfoTable)
      .values(testServices[0])
      .execute();

    // Verify service was saved
    const services = await db.select()
      .from(serviceInfoTable)
      .where(eq(serviceInfoTable.service_type, 'customs_clearance'))
      .execute();

    expect(services).toHaveLength(1);
    expect(services[0].title).toEqual('Customs Clearance');
    expect(services[0].service_type).toEqual('customs_clearance');
    expect(services[0].is_featured).toEqual(true);
    expect(services[0].updated_at).toBeInstanceOf(Date);
  });
});