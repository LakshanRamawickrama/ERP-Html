import { NextResponse } from 'next/server';
import { SUPPLIER_DIRECTORY, PURCHASE_ORDERS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    suppliers: SUPPLIER_DIRECTORY,
    orders: PURCHASE_ORDERS,
  });
}
