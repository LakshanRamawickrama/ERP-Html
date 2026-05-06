import React from 'react';
import UserModule from '@/modules/users/UserModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function UsersPage() {
  return (
    <PageWrapper title="User Management">
      <UserModule />
    </PageWrapper>
  );
}
