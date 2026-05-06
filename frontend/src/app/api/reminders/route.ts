import { NextResponse } from 'next/server';
import { REMINDERS } from '@/lib/db';

export async function GET() {
  return NextResponse.json(REMINDERS);
}
