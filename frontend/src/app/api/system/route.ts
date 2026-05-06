import { NextResponse } from 'next/server';
import { SYSTEM_CREDENTIALS, SYSTEM_ALERTS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    credentials: SYSTEM_CREDENTIALS,
    alerts: SYSTEM_ALERTS,
  });
}
