'use client';

import React, { useState, useEffect } from 'react';
import BusinessModule from '@/modules/business/BusinessModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function BusinessPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setRole(userData.role);
    }
  }, []);

  return (
    <PageWrapper title="Business Management">
      <BusinessModule userRole={role || undefined} />
    </PageWrapper>
  );
}
