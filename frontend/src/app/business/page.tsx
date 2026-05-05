'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import BusinessModule from '@/modules/business/BusinessModule';
import { UserRole } from '@/constants/roles';
import { useRouter } from 'next/navigation';

export default function BusinessPage() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(savedUser);
    setUserRole(user.role as UserRole);
  }, [router]);

  if (!userRole) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 ml-[70px]">
        <BusinessModule userRole={userRole} />
      </div>
    </div>
  );
}
