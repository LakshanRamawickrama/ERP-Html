import { NextResponse } from 'next/server';
import { USER_REGISTRY, SYSTEM_MAP, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    users: USER_REGISTRY,
    map: SYSTEM_MAP,
    roles: FORM_OPTIONS.userRoles,
    businesses: FORM_OPTIONS.userBusinesses,
  });
}
