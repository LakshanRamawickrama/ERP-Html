import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import UserModule from '@/modules/users/UserModule';
import { UserRole } from '@/constants/roles';

export default function UsersPage() {
  const userRole = UserRole.SUPER_ADMIN;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <UserModule />
      </div>
    </div>
  );
}
