import { NextResponse } from 'next/server';
import { ACCOUNTING_HISTORY, ACCOUNTING_INVOICES, ACCOUNTING_BANKS, ACCOUNTING_LOANS, ACCOUNTING_DOJO } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    history: ACCOUNTING_HISTORY,
    invoices: ACCOUNTING_INVOICES,
    banks: ACCOUNTING_BANKS,
    loans: ACCOUNTING_LOANS,
    dojo: ACCOUNTING_DOJO,
  });
}
