import { NextResponse } from 'next/server';
import { LEGAL_DOCS, LEGAL_SUMMARY, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({ 
    docs: LEGAL_DOCS, 
    summary: LEGAL_SUMMARY,
    options: FORM_OPTIONS.legalDocTypes
  });
}
