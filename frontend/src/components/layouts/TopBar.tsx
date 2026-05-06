'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { UserRole } from '@/constants/roles';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title: string;
  userRole: UserRole;
  user: any;
  onProfileClick: () => void;
  businesses?: any[];
  selectedBusiness?: string;
  onBusinessChange?: (business: string) => void;
}

export default function TopBar({ 
  title, 
  userRole, 
  user, 
  onProfileClick, 
  businesses = [],
  selectedBusiness = 'All Entities',
  onBusinessChange
}: TopBarProps) {
  const getInitials = (name: string) => {
    return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <header className="bg-white border-b border-[#e2e8f0] px-6 py-2.5 flex items-center justify-between shadow-sm flex-shrink-0 z-50">
      <h5 className="text-[16px] font-bold text-[#1e293b] m-0 flex items-center gap-2">
        <span id="mainTitleText">{title}</span>
      </h5>


      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">
          <label className="text-[12px] font-medium text-[#64748b] m-0">Organization</label>
          <select 
            className={cn(
              "bg-transparent text-[13px] font-bold text-[#1e293b] outline-none border-none cursor-pointer pr-1 appearance-none",
              userRole !== UserRole.SUPER_ADMIN && "pointer-events-none opacity-80"
            )}
            disabled={userRole !== UserRole.SUPER_ADMIN}
            value={selectedBusiness}
            onChange={(e) => onBusinessChange?.(e.target.value)}
          >
            {userRole === UserRole.SUPER_ADMIN ? (
              <>
                <option>All Entities</option>
                {businesses.map((b: any) => (
                  <option key={b.id || b.name}>{b.name}</option>
                ))}
              </>
            ) : (
              <option>{user.businesses?.[0] || 'Assigned Business'}</option>
            )}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
        </div>
        
        <button 
          onClick={onProfileClick}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white text-[11px] font-bold shadow-lg hover:scale-105 transition-transform border-2 border-white overflow-hidden"
        >
          {user.photo ? (
            <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            getInitials(user.fullName || user.name)
          )}
        </button>
      </div>
    </header>
  );
}
