import React from 'react';
import PropertyModule from '@/modules/property/PropertyModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function PropertyPage() {
  return (
    <PageWrapper title="Property Management">
      <PropertyModule />
    </PageWrapper>
  );
}
