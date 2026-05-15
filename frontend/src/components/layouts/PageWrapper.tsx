'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layouts/Sidebar';
import TopBar from '@/components/layouts/TopBar';
import ProfileDrawer from '@/components/layouts/ProfileDrawer';
import SettingsDrawer from '@/components/layouts/SettingsDrawer';
import { UserRole } from '@/constants/roles';
import { API_ENDPOINTS } from '@/lib/api';

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
}

export default function PageWrapper({ children, title }: PageWrapperProps) {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState('All Entities');
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

    const savedBusiness = localStorage.getItem('selectedBusiness');
    if (savedBusiness) setSelectedBusiness(savedBusiness);

    // Fetch businesses for TopBar organization selector
    const token = localStorage.getItem('token');
    fetch(API_ENDPOINTS.BUSINESS, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setBusinesses(data.entities || []))
      .catch(() => {});
  }, [router]);

  const handleBusinessChange = (business: string) => {
    setSelectedBusiness(business);
    localStorage.setItem('selectedBusiness', business);
    // Optional: Refresh or broadcast change if needed
    window.dispatchEvent(new Event('businessChanged'));
  };

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
          onSettingsClick={() => setIsSettingsOpen(true)}
          businesses={businesses}
          selectedBusiness={selectedBusiness}
          onBusinessChange={handleBusinessChange}
        />

        <SettingsDrawer 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
        
        <div className="flex-1 overflow-y-auto">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              // Only inject props into custom components, not DOM elements like 'div'
              if (typeof child.type !== 'string' && child.type !== React.Fragment) {
                return React.cloneElement(child as React.ReactElement<any>, { 
                  selectedBusiness,
                  businesses: businesses.map(b => b.name || b)
                });
              }
            }
            return child;
          })}
        </div>
      </main>
    </div>
  );
}
