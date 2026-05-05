import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import SupplierModule from '@/modules/suppliers/SupplierModule';
import { UserRole } from '@/constants/roles';

export default function SuppliersPage() {
  const userRole = UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <SupplierModule />
      </div>
    </div>
  );
}
