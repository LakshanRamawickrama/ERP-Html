'use client';

import React from 'react';
import PaymentModule from '@/modules/payments/PaymentModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function PaymentsPage() {
  return (
    <PageWrapper title="Payment & Merchant Services">
      <PaymentModule />
    </PageWrapper>
  );
}
