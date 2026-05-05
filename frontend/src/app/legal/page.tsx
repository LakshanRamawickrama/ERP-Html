import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import LegalModule from '@/modules/legal/LegalModule';
import { UserRole } from '@/constants/roles';

export default function LegalPage() {
  const userRole = UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <LegalModule />
      </div>
    </div>
  );
}
