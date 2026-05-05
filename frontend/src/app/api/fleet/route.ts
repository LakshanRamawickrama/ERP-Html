import { NextResponse } from 'next/server';
import { FLEET_REMINDERS, FLEET_VEHICLES, FLEET_DELIVERIES, FLEET_PARCELS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    reminders: FLEET_REMINDERS,
    vehicles: FLEET_VEHICLES,
    deliveries: FLEET_DELIVERIES,
    parcels: FLEET_PARCELS,
  });
}
