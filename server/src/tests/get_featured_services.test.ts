import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { serviceInfoTable } from '../db/schema';
import { getFeaturedServices } from '../handlers/get_featured_services';

describe('getFeaturedServices', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no featured services exist', async () => {
    const result = await getFeaturedServices();
    expect(result).toEqual([]);
  });

  it('should return only featured services', async () => {
    // Create test services - some featured, some not
    await db.insert(serviceInfoTable).values([
      {
        service_type: 'customs_clearance',
        title: 'Customs Clearance',
        description: 'Expert customs clearance services',
        is_featured: true,
        display_order: 1
      },
      {
        service_type: 'shipping_agency',
        title: 'Shipping Agency',
        description: 'Professional shipping agency services',
        is_featured: false,
        display_order: 2
      },
      {
        service_type: 'port_to_door_delivery',
        title: 'Port to Door Delivery',
        description: 'Complete port to door delivery solutions',
        is_featured: true,
        display_order: 3
      }
    ]).execute();

    const result = await getFeaturedServices();

    expect(result).toHaveLength(2);
    expect(result.every(service => service.is_featured)).toBe(true);
    expect(result.map(s => s.title)).toEqual([
      'Customs Clearance',
      'Port to Door Delivery'
    ]);
  });

  it('should return featured services ordered by display_order', async () => {
    // Create test services with different display orders
    await db.insert(serviceInfoTable).values([
      {
        service_type: 'warehousing',
        title: 'Warehousing Solutions',
        description: 'Modern warehousing facilities',
        is_featured: true,
        display_order: 5
      },
      {
        service_type: 'customs_clearance',
        title: 'Customs Clearance',
        description: 'Expert customs clearance services',
        is_featured: true,
        display_order: 1
      },
      {
        service_type: 'ecommerce_delivery',
        title: 'E-commerce Delivery',
        description: 'Fast e-commerce delivery services',
        is_featured: true,
        display_order: 3
      }
    ]).execute();

    const result = await getFeaturedServices();

    expect(result).toHaveLength(3);
    
    // Verify correct ordering by display_order (ascending)
    expect(result[0].title).toBe('Customs Clearance');
    expect(result[0].display_order).toBe(1);
    
    expect(result[1].title).toBe('E-commerce Delivery');
    expect(result[1].display_order).toBe(3);
    
    expect(result[2].title).toBe('Warehousing Solutions');
    expect(result[2].display_order).toBe(5);
  });

  it('should return all required service info fields', async () => {
    await db.insert(serviceInfoTable).values({
      service_type: 'logistics_consulting',
      title: 'Logistics Consulting',
      description: 'Expert logistics consulting services',
      icon: 'consulting-icon.svg',
      is_featured: true,
      display_order: 1
    }).execute();

    const result = await getFeaturedServices();

    expect(result).toHaveLength(1);
    const service = result[0];
    
    // Verify all fields are present and correct
    expect(service.id).toBeDefined();
    expect(service.service_type).toBe('logistics_consulting');
    expect(service.title).toBe('Logistics Consulting');
    expect(service.description).toBe('Expert logistics consulting services');
    expect(service.icon).toBe('consulting-icon.svg');
    expect(service.is_featured).toBe(true);
    expect(service.display_order).toBe(1);
    expect(service.updated_at).toBeInstanceOf(Date);
  });

  it('should handle services with null icon field', async () => {
    await db.insert(serviceInfoTable).values({
      service_type: 'truck_fleet_management',
      title: 'Fleet Management',
      description: 'Professional truck fleet management',
      icon: null,
      is_featured: true,
      display_order: 1
    }).execute();

    const result = await getFeaturedServices();

    expect(result).toHaveLength(1);
    expect(result[0].icon).toBeNull();
    expect(result[0].title).toBe('Fleet Management');
  });

  it('should handle multiple featured services with same display_order', async () => {
    // Create services with same display order to test stable sorting
    await db.insert(serviceInfoTable).values([
      {
        service_type: 'customs_clearance',
        title: 'Service A',
        description: 'Service A description',
        is_featured: true,
        display_order: 2
      },
      {
        service_type: 'shipping_agency',
        title: 'Service B',
        description: 'Service B description',
        is_featured: true,
        display_order: 2
      },
      {
        service_type: 'warehousing',
        title: 'Service C',
        description: 'Service C description',
        is_featured: true,
        display_order: 1
      }
    ]).execute();

    const result = await getFeaturedServices();

    expect(result).toHaveLength(3);
    
    // First service should have display_order 1
    expect(result[0].display_order).toBe(1);
    expect(result[0].title).toBe('Service C');
    
    // Next two should have display_order 2
    expect(result[1].display_order).toBe(2);
    expect(result[2].display_order).toBe(2);
  });
});