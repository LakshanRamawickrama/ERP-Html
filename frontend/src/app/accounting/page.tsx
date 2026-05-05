import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import AccountingModule from '@/modules/accounting/AccountingModule';
import { UserRole } from '@/constants/roles';

export default function AccountingPage() {
  // Static role for now, would be handled by auth context in full app
  const userRole = UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <AccountingModule />
      </div>
    </div>
  );
}
