import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import PropertyModule from '@/modules/property/PropertyModule';
import { UserRole } from '@/constants/roles';

export default function PropertyPage() {
  const userRole = UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <PropertyModule />
      </div>
    </div>
  );
}
