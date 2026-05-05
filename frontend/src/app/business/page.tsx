import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import BusinessModule from '@/modules/business/BusinessModule';
import { UserRole } from '@/constants/roles';

export default function BusinessPage() {
  const userRole = UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <BusinessModule userRole={userRole} />
      </div>
    </div>
  );
}
