import { NextResponse } from 'next/server';
import { SYSTEM_CREDENTIALS, SYSTEM_ALERTS, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({ 
    credentials: SYSTEM_CREDENTIALS, 
    alerts: SYSTEM_ALERTS,
    options: {
      services: FORM_OPTIONS.systemServiceNames,
      statuses: FORM_OPTIONS.systemStatuses,
    }
  });
}
