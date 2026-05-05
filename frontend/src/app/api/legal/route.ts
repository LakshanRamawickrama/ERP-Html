import { NextResponse } from 'next/server';
import { LEGAL_DOCS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({ docs: LEGAL_DOCS });
}
