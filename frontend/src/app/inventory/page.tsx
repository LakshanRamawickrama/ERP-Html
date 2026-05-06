import React from 'react';
import InventoryModule from '@/modules/inventory/InventoryModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function InventoryPage() {
  return (
    <PageWrapper title="Inventory Management">
      <InventoryModule />
    </PageWrapper>
  );
}
