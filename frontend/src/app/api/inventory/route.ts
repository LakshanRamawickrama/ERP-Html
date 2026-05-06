import { NextResponse } from 'next/server';
import { INVENTORY_ALERTS, INVENTORY_STOCK, INVENTORY_MOVES, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    alerts: INVENTORY_ALERTS,
    stock: INVENTORY_STOCK,
    moves: INVENTORY_MOVES,
    inventoryCategories: FORM_OPTIONS.inventoryCategories,
    inventoryItems: FORM_OPTIONS.inventoryItems,
  });
}
