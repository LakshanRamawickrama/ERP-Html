'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layouts/Sidebar';
import TopBar from '@/components/layouts/TopBar';
import ProfileDrawer from '@/components/layouts/ProfileDrawer';
import { UserRole } from '@/constants/roles';

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
}

export default function PageWrapper({ children, title }: PageWrapperProps) {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(savedUser);
    setUser(userData);
    setUserRole(userData.role as UserRole);

    // Fetch businesses for TopBar organization selector
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => setBusinesses(data.businesses || []))
      .catch(() => {});
  }, [router]);

  if (!user || !userRole) return null;

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
          title={title}
          userRole={userRole}
          user={user}
          onProfileClick={() => setIsProfileOpen(true)}
          businesses={businesses}
        />
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
