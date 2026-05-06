import React from 'react';
import BusinessModule from '@/modules/business/BusinessModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function BusinessPage() {
  return (
    <PageWrapper title="Business Management">
      <BusinessModule />
    </PageWrapper>
  );
}
