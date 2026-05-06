import { NextResponse } from 'next/server';
import { FLEET_REMINDERS, FLEET_VEHICLES, FLEET_DELIVERIES, FLEET_PARCELS, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    reminders: FLEET_REMINDERS,
    vehicles: FLEET_VEHICLES,
    deliveries: FLEET_DELIVERIES,
    parcels: FLEET_PARCELS,
    options: {
      businesses: FORM_OPTIONS.fleetBusinesses,
      vehicles: FORM_OPTIONS.fleetVehicles,
      deliveryStatuses: FORM_OPTIONS.fleetDeliveryStatuses,
      vehicleShort: FORM_OPTIONS.fleetVehicleShort,
      agreementStatuses: FORM_OPTIONS.fleetAgreementStatuses,
    }
  });
}
