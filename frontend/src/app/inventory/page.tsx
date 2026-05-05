import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import InventoryModule from '@/modules/inventory/InventoryModule';
import { UserRole } from '@/constants/roles';

export default function InventoryPage() {
  const userRole = UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <InventoryModule />
      </div>
    </div>
  );
}
