import React from 'react';
import LegalModule from '@/modules/legal/LegalModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function LegalPage() {
  return (
    <PageWrapper title="Legal & Compliance">
      <LegalModule />
    </PageWrapper>
  );
}
