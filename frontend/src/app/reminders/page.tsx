'use client';

import React from 'react';
import RemindersModule from '@/modules/reminders/RemindersModule';
import PageWrapper from '@/components/layouts/PageWrapper';

export default function RemindersPage() {
  return (
    <PageWrapper title="Reminders & Notifications">
      <RemindersModule />
    </PageWrapper>
  );
}
