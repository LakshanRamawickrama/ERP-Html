import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import SystemAccessModule from '@/modules/system/SystemAccessModule';
import { UserRole } from '@/constants/roles';

export default function SystemAccessPage() {
  const userRole = UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <SystemAccessModule />
      </div>
    </div>
  );
}
