import { NextResponse } from 'next/server';
import { PROPERTY_ASSETS, PROPERTY_REQUESTS, PROPERTY_WASTE, PROPERTY_LICENCES, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    assets: PROPERTY_ASSETS,
    requests: PROPERTY_REQUESTS,
    waste: PROPERTY_WASTE,
    licences: PROPERTY_LICENCES,
    assetTypes: FORM_OPTIONS.propertyAssetTypes,
    assetOptions: FORM_OPTIONS.propertyAssets,
    priorities: FORM_OPTIONS.propertyPriorities,
    statuses: FORM_OPTIONS.propertyStatuses,
  });
}
