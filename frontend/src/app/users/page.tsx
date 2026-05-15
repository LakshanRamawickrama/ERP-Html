'use client';

import React, { useState, useEffect } from 'react';
import UserModule from '@/modules/users/UserModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function UsersPage() {
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserRole(parsed.role);
      } catch { /* empty */ }
    }
  }, []);

  return (
    <PageWrapper title="User Management">
      <UserModule userRole={userRole} />
    </PageWrapper>
  );
}
