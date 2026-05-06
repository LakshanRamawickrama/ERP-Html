import { NextResponse } from 'next/server';
import { ACCOUNTING_HISTORY, ACCOUNTING_INVOICES, ACCOUNTING_BANKS, ACCOUNTING_LOANS, ACCOUNTING_DOJO, ACCOUNTING_SUMMARY, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    history: ACCOUNTING_HISTORY,
    invoices: ACCOUNTING_INVOICES,
    banks: ACCOUNTING_BANKS,
    loans: ACCOUNTING_LOANS,
    dojo: ACCOUNTING_DOJO,
    summary: ACCOUNTING_SUMMARY,
    options: FORM_OPTIONS.accountingCategories,
  });
}
