import React from 'react';
import AccountingModule from '@/modules/accounting/AccountingModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function AccountingPage() {
  return (
    <PageWrapper title="Accounting & Finance">
      <AccountingModule />
    </PageWrapper>
  );
}
