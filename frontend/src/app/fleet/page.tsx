import React from 'react';
import FleetModule from '@/modules/fleet/FleetModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function FleetPage() {
  return (
    <PageWrapper title="Fleet Management">
      <FleetModule />
    </PageWrapper>
  );
}
