'use client';

import React from 'react';
import RemindersModule from '@/modules/reminders/RemindersModule';
import Sidebar from '@/components/layouts/Sidebar';
import TopBar from '@/components/layouts/TopBar';
import ProfileDrawer from '@/components/layouts/ProfileDrawer';
import { UserRole } from '@/constants/roles';

export default function RemindersPage() {
  const [user, setUser] = React.useState<any>(null);
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserRole(userData.role as UserRole);
    }
  }, []);

  if (!userRole || !user) return null;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar userRole={userRole} />
      
      <ProfileDrawer 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user}
        onUpdateUser={(updatedUser: any) => setUser(updatedUser)}
      />
      
      <main className="ml-[70px] flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar 
          title="Reminders & Notifications" 
          userRole={userRole}
          user={user}
          onProfileClick={() => setIsProfileOpen(true)}
        />
        <div className="flex-1 overflow-hidden">
          <RemindersModule />
        </div>
      </main>
    </div>
  );
}
