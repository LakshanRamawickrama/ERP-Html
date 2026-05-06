import { NextResponse } from 'next/server';
import { SUPPLIER_DIRECTORY, PURCHASE_ORDERS, SUPPLIER_METADATA, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    suppliers: SUPPLIER_DIRECTORY,
    orders: PURCHASE_ORDERS,
    metadata: SUPPLIER_METADATA,
    options: {
      categories: FORM_OPTIONS.supplierCategories,
      statuses: FORM_OPTIONS.supplierStatuses,
      names: FORM_OPTIONS.supplierNames,
      productCategories: FORM_OPTIONS.orderProductCategories,
      orderStatuses: FORM_OPTIONS.orderStatuses,
    },
  });
}
