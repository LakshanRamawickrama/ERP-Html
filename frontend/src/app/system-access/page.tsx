import React from 'react';
import SystemAccessModule from '@/modules/system/SystemAccessModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function SystemAccessPage() {
  return (
    <PageWrapper title="System Access Control">
      <SystemAccessModule />
    </PageWrapper>
  );
}
