import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { companyInfoTable } from '../db/schema';
import { getCompanyInfo } from '../handlers/get_company_info';
import { eq } from 'drizzle-orm';

describe('getCompanyInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no company info exists', async () => {
    const result = await getCompanyInfo();
    expect(result).toEqual([]);
  });

  it('should fetch all company information sections', async () => {
    // Create test company info sections
    await db.insert(companyInfoTable).values([
      {
        section: 'mission',
        title: 'Our Mission',
        content: 'To provide excellent logistics services worldwide.'
      },
      {
        section: 'vision',
        title: 'Our Vision',
        content: 'To be the leading logistics company in the region.'
      },
      {
        section: 'values',
        title: 'Our Values',
        content: 'Integrity, excellence, and customer satisfaction.'
      }
    ]).execute();

    const result = await getCompanyInfo();

    expect(result).toHaveLength(3);
    expect(result.map(info => info.section)).toContain('mission');
    expect(result.map(info => info.section)).toContain('vision');
    expect(result.map(info => info.section)).toContain('values');
  });

  it('should return sections in enum definition order', async () => {
    // Insert sections in random order
    await db.insert(companyInfoTable).values([
      {
        section: 'vision',
        title: 'Our Vision',
        content: 'Vision content'
      },
      {
        section: 'history',
        title: 'Our History',
        content: 'History content'
      },
      {
        section: 'mission',
        title: 'Our Mission',
        content: 'Mission content'
      }
    ]).execute();

    const result = await getCompanyInfo();

    expect(result).toHaveLength(3);
    // Verify enum definition ordering: mission, vision, history
    expect(result[0].section).toBe('mission');
    expect(result[1].section).toBe('vision');
    expect(result[2].section).toBe('history');
  });

  it('should include all required fields', async () => {
    await db.insert(companyInfoTable).values({
      section: 'mission',
      title: 'Our Mission Statement',
      content: 'We strive to deliver exceptional logistics solutions.'
    }).execute();

    const result = await getCompanyInfo();

    expect(result).toHaveLength(1);
    const companyInfo = result[0];
    
    expect(companyInfo.id).toBeDefined();
    expect(typeof companyInfo.id).toBe('number');
    expect(companyInfo.section).toBe('mission');
    expect(companyInfo.title).toBe('Our Mission Statement');
    expect(companyInfo.content).toBe('We strive to deliver exceptional logistics solutions.');
    expect(companyInfo.updated_at).toBeInstanceOf(Date);
  });

  it('should handle all possible section types', async () => {
    // Create one record for each section type
    await db.insert(companyInfoTable).values([
      {
        section: 'mission',
        title: 'Mission Title',
        content: 'Mission content'
      },
      {
        section: 'vision',
        title: 'Vision Title',
        content: 'Vision content'
      },
      {
        section: 'values',
        title: 'Values Title',
        content: 'Values content'
      },
      {
        section: 'history',
        title: 'History Title',
        content: 'History content'
      }
    ]).execute();

    const result = await getCompanyInfo();

    expect(result).toHaveLength(4);
    
    // Verify all section types are present
    const sections = result.map(info => info.section);
    expect(sections).toContain('mission');
    expect(sections).toContain('vision');
    expect(sections).toContain('values');
    expect(sections).toContain('history');
  });

  it('should verify data persistence in database', async () => {
    // Create company info via handler
    await db.insert(companyInfoTable).values({
      section: 'values',
      title: 'Core Values',
      content: 'Excellence, integrity, and innovation guide our work.'
    }).execute();

    const handlerResult = await getCompanyInfo();
    
    // Verify same data exists in database
    const dbRecords = await db.select()
      .from(companyInfoTable)
      .where(eq(companyInfoTable.section, 'values'))
      .execute();

    expect(dbRecords).toHaveLength(1);
    expect(handlerResult).toHaveLength(1);
    expect(handlerResult[0].id).toBe(dbRecords[0].id);
    expect(handlerResult[0].title).toBe(dbRecords[0].title);
    expect(handlerResult[0].content).toBe(dbRecords[0].content);
  });

  it('should handle multiple records for same section', async () => {
    // Edge case: multiple records for same section (shouldn't normally happen but test robustness)
    await db.insert(companyInfoTable).values([
      {
        section: 'mission',
        title: 'Mission V1',
        content: 'First mission statement'
      },
      {
        section: 'mission',
        title: 'Mission V2',
        content: 'Updated mission statement'
      }
    ]).execute();

    const result = await getCompanyInfo();

    expect(result).toHaveLength(2);
    expect(result.every(info => info.section === 'mission')).toBe(true);
    expect(result.map(info => info.title)).toContain('Mission V1');
    expect(result.map(info => info.title)).toContain('Mission V2');
  });
});