'use client';

import React from 'react';
import PaymentModule from '@/modules/payments/PaymentModule';
import Sidebar from '@/components/layouts/Sidebar';
import TopBar from '@/components/layouts/TopBar';
import ProfileDrawer from '@/components/layouts/ProfileDrawer';
import { UserRole } from '@/constants/roles';
import { API_ENDPOINTS } from '@/lib/api';

export default function PaymentsPage() {
  const [user, setUser] = React.useState<any>(null);
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [selectedBusiness, setSelectedBusiness] = React.useState('All Entities');
  const [businesses, setBusinesses] = React.useState<any[]>([]);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserRole(userData.role as UserRole);
    }
    
    const token = localStorage.getItem('token');
    fetch(API_ENDPOINTS.BUSINESS, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return null;
        return res.json();
      })
      .then(data => {
        if (data) setBusinesses(data.entities || []);
      })
      .catch(err => console.error('Error fetching businesses:', err));
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
          title="Payment & Merchant Services" 
          userRole={userRole}
          user={user}
          onProfileClick={() => setIsProfileOpen(true)}
          businesses={businesses}
          selectedBusiness={selectedBusiness}
          onBusinessChange={setSelectedBusiness}
        />
        <div className="flex-1 overflow-hidden">
          <PaymentModule />
        </div>
      </main>
    </div>
  );
}
