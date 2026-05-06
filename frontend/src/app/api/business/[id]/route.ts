import { NextResponse } from 'next/server';
import {
  BUSINESSES,
  ACCOUNTING_RECORDS,
  FLEET_RECORDS,
  INVENTORY_RECORDS,
  SUPPLIER_RECORDS,
  LEGAL_RECORDS,
  PROPERTY_RECORDS,
} from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const business = BUSINESSES[params.id] || null;
  return NextResponse.json({
    business,
    accounting: ACCOUNTING_RECORDS,
    fleet: FLEET_RECORDS,
    inventory: INVENTORY_RECORDS,
    supplier: SUPPLIER_RECORDS,
    legal: LEGAL_RECORDS,
    property: PROPERTY_RECORDS,
  });
}
