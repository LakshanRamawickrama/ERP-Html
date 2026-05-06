import { NextResponse } from 'next/server';
import { ACCOUNTING_HISTORY, ACCOUNTING_INVOICES, ACCOUNTING_BANKS, ACCOUNTING_LOANS, ACCOUNTING_DOJO, ACCOUNTING_SUMMARY, FORM_OPTIONS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    history: ACCOUNTING_HISTORY,
    invoices: ACCOUNTING_INVOICES,
    banks: ACCOUNTING_BANKS,
    loans: ACCOUNTING_LOANS,
    dojo: ACCOUNTING_DOJO,
    suppliers: FORM_OPTIONS.accountingSuppliers,
    paymentModes: FORM_OPTIONS.accountingPaymentModes,
    recordTypes: FORM_OPTIONS.accountingRecordTypes,
    paymentStatuses: FORM_OPTIONS.accountingPaymentStatuses,
    invoiceStatuses: FORM_OPTIONS.accountingInvoiceStatuses,
    bankTypes: FORM_OPTIONS.accountingBankTypes,
    bankStatuses: FORM_OPTIONS.accountingBankStatuses,
    loanStatuses: FORM_OPTIONS.accountingLoanStatuses,
    renewalReminders: FORM_OPTIONS.accountingRenewalReminders,
    vatStatuses: FORM_OPTIONS.accountingVatStatuses,
    dojoMethods: FORM_OPTIONS.accountingDojoMethods,
  });
}
