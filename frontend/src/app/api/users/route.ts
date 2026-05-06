import { NextResponse } from 'next/server';
import { USER_REGISTRY, USER_SYSTEM_MAP, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    registry: USER_REGISTRY,
    systemMap: USER_SYSTEM_MAP,
    roles: FORM_OPTIONS.userRoles,
    businesses: FORM_OPTIONS.userBusinesses,
  });
}
