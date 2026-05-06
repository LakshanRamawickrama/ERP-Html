import React from 'react';
import SupplierModule from '@/modules/suppliers/SupplierModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function SuppliersPage() {
  return (
    <PageWrapper title="Supplier Management">
      <SupplierModule />
    </PageWrapper>
  );
}
