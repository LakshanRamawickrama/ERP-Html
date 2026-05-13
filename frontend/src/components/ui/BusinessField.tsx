'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, Building2, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/api';

interface BusinessFieldProps {
  value: string;
  onChange: (value: string) => void;
  businesses?: string[];
  label?: string;
  disabled?: boolean;
}

export function BusinessField({ value, onChange, businesses: initialBusinesses = [], label = "Business Name", disabled = false }: BusinessFieldProps) {
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<string[]>(initialBusinesses);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);

        // If regular admin, automatically set their business and prevent change
        if (parsed.role === 'admin' && parsed.business && !value) {
          onChange(parsed.business);
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, [onChange, value]);

  useEffect(() => {
    // If businesses provided via props and not empty, use them
    if (initialBusinesses && initialBusinesses.length > 0) {
      setBusinesses(initialBusinesses);
      return;
    }

    // Only fetch if we are a super admin and don't have businesses yet
    const isSuper = user?.role === 'super_admin' || user?.is_superuser;

    if (user && isSuper && (!businesses || businesses.length === 0)) {
      const fetchBusinesses = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const res = await fetch(API_ENDPOINTS.BUSINESS, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) throw new Error('Fetch failed');
          const data = await res.json();

          // Try multiple locations for business names
          let names: string[] = [];
          if (data.options?.names) {
            names = data.options.names;
          } else if (data.entities) {
            names = data.entities.map((e: any) => e.name || e);
          } else if (Array.isArray(data)) {
            names = data.map((e: any) => e.name || e);
          }

          const uniqueNames = Array.from(new Set(names)).filter(Boolean) as string[];

          if (uniqueNames.length > 0) {
            setBusinesses(uniqueNames);
          }
        } catch (err) {
          console.error('Failed to fetch businesses in component:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBusinesses();
    }
  }, [initialBusinesses, user]); // Removed businesses from dependencies to avoid loop

  const isSuperAdmin = user?.role === 'super_admin' || user?.is_superuser;
  const displayValue = !isSuperAdmin ? (user?.business || user?.assigned_business || value || 'Unassigned') : value;

  // Ensure value exists in list if possible
  const displayList = value && !businesses.includes(value) ? [value, ...businesses] : businesses;

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
        <Building2 className="w-3 h-3" />
        {label}
      </label>

      {isSuperAdmin ? (
        <div className="relative">
          <select
            disabled={disabled || isLoading}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="">{isLoading ? 'Loading Businesses...' : 'Select Business...'}</option>
            {displayList.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            {isLoading && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      ) : (
        <div className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 cursor-not-allowed opacity-80 flex items-center gap-2">
          {displayValue}
          <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-500 uppercase ml-auto">Locked</span>
        </div>
      )}
    </div>
  );
}
