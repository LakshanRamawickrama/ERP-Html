import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import ReportsModule from '@/modules/reports/ReportsModule';
import { UserRole } from '@/constants/roles';

export default function ReportsPage() {
  const userRole = UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <ReportsModule />
      </div>
    </div>
  );
}
