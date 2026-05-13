'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Bell, AlertTriangle } from 'lucide-react';
import { UserRole } from '@/constants/roles';
import { cn } from '@/lib/utils';
import { API_ENDPOINTS } from '@/lib/api';
import Link from 'next/link';

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
  const [urgentReminders, setUrgentReminders] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(API_ENDPOINTS.REMINDERS, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        const urgent = data.filter((r: any) => r.priority === 'High' || r.is_overdue).slice(0, 5);
        setUrgentReminders(urgent);
      }
    })
    .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <header className="bg-white border-b border-[#e2e8f0] px-6 py-2.5 flex items-center justify-between shadow-sm flex-shrink-0 z-50">
      <h5 className="text-[16px] font-bold text-[#1e293b] m-0 flex items-center gap-2">
        <span id="mainTitleText">{title}</span>
      </h5>


      <div className="flex items-center gap-3">
        {userRole === UserRole.SUPER_ADMIN && (
          <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">
            <label className="text-[12px] font-medium text-[#64748b] m-0">Business</label>
            <select 
              className="bg-transparent text-[13px] font-bold text-[#1e293b] outline-none border-none cursor-pointer pr-1 appearance-none"
              value={selectedBusiness}
              onChange={(e) => onBusinessChange?.(e.target.value)}
            >
              <option>All Entities</option>
              {businesses.map((b: any) => (
                <option key={b.id || b.name}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
          </div>
        )}
        
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {urgentReminders.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-[320px] bg-white border border-slate-100 rounded-xl shadow-xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h6 className="text-[12px] font-bold text-slate-800 m-0">Notifications</h6>
                <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{urgentReminders.length} New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                {urgentReminders.length > 0 ? (
                  urgentReminders.map((r, i) => (
                    <Link
                      href="/reminders"
                      onClick={() => setShowNotifications(false)}
                      key={i}
                      className="p-2.5 rounded-lg flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors group block"
                    >
                      <div className="w-7 h-7 rounded bg-red-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-50 transition-colors">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-slate-800 m-0 truncate group-hover:text-indigo-600 transition-colors">{r.title}</h4>
                        <p className="text-[9px] text-slate-500 m-0 truncate">{r.business}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {r.is_overdue && <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">Overdue</span>}
                          {r.priority === 'High' && <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase">High Priority</span>}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-[11px] font-medium text-slate-400">No urgent reminders</p>
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-slate-100 bg-slate-50">
                <Link 
                  href="/reminders" 
                  onClick={() => setShowNotifications(false)}
                  className="block w-full text-center text-[10px] font-bold text-indigo-600 hover:text-indigo-700 py-1"
                >
                  View All Reminders
                </Link>
              </div>
            </div>
          )}
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
