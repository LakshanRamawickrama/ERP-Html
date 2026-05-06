import { NextResponse } from 'next/server';
import { BUSINESS_ENTITIES, BUSINESS_STRUCTURES, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({ 
    entities: BUSINESS_ENTITIES, 
    structures: BUSINESS_STRUCTURES,
    options: {
      categories: FORM_OPTIONS.businessCategories,
    }
  });
}
