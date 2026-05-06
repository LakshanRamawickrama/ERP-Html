import { NextResponse } from 'next/server';
import { REPORT_STATS, REPORT_TEMPLATES } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    stats: REPORT_STATS,
    templates: REPORT_TEMPLATES
  });
}
