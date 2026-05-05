import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import FleetModule from '@/modules/fleet/FleetModule';
import { UserRole } from '@/constants/roles';

export default function FleetPage() {
  const userRole = UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <FleetModule />
      </div>
    </div>
  );
}
