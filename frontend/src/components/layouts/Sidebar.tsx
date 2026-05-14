'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@/constants/roles';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Truck,
  Boxes,
  Key,
  Package,
  Receipt,
  Gavel,
  Building,
  BarChart3,
  LogOut,
  Bell,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  userRole: UserRole;
}

const navItems = [
  { label: 'Dashboard',            href: '/dashboard',     icon: LayoutDashboard, alwaysShow: true },
  { label: 'Business Management',  href: '/business',      icon: Briefcase,       module: 'Business Management' },
  { label: 'User Management',      href: '/users',         icon: Users,           superAdminOnly: true },
  { label: 'Fleet Management',     href: '/fleet',         icon: Truck,           module: 'Fleet Management' },
  { label: 'Inventory Management', href: '/inventory',     icon: Boxes,           module: 'Inventory Management' },
  { label: 'System Access',        href: '/system-access', icon: Key,             superAdminOnly: true },
  { label: 'Suppliers',            href: '/suppliers',     icon: Package,         module: 'Suppliers' },
  { label: 'Accounting',           href: '/accounting',    icon: Receipt,         module: 'Accounting' },
  { label: 'Legal & Compliance',   href: '/legal',         icon: Gavel,           module: 'Legal & Compliance' },
  { label: 'Property Management',  href: '/property',      icon: Building,        module: 'Property Management' },
  { label: 'Merchant Services',   href: '/payments',      icon: CreditCard,       module: 'Payment Services' },
  { label: 'Reminders',           href: '/reminders',     icon: Bell,             module: 'Reminders' },
  { label: 'Reports',              href: '/reports',       icon: BarChart3,       module: 'Reports' },
];

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [adminModules, setAdminModules] = useState<string[] | null>(null);

  useEffect(() => {
    if (userRole === UserRole.ADMIN) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const access: string = user.access || '';
        if (!access || access === 'All') {
          setAdminModules(null);
        } else {
          setAdminModules(access.split(',').map((s: string) => s.trim()).filter(Boolean));
        }
      } catch {
        setAdminModules(null);
      }
    }
  }, [userRole]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('hasSeenReminderPopup');
    router.push('/login');
  };

  const isVisible = (item: typeof navItems[0]) => {
    if ((item as any).alwaysShow) return true;
    if ((item as any).superAdminOnly) return userRole === UserRole.SUPER_ADMIN;
    if (userRole === UserRole.SUPER_ADMIN) return true;
    // admin: filter by granted modules
    if (!adminModules) return true;
    return !!(item as any).module && adminModules.includes((item as any).module);
  };

  return (
    <aside className="group fixed left-0 top-0 h-screen bg-[#2c3e50] text-[#ecf0f1] w-[70px] hover:w-[240px] transition-all duration-300 shadow-xl z-[1100] flex flex-col overflow-hidden">
      {/* Brand */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 min-h-[70px] whitespace-nowrap overflow-hidden">
        <div className="min-w-[44px] flex justify-center">
          <div className="w-11 h-11 rounded-2xl bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-1.5 border-2 border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-logo-pulse transition-all duration-300 group-hover:scale-105">
            <img src="/images/logo.png" alt="Zerozzz Logo" className="w-full h-full object-contain brightness-110 contrast-125" />
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
          <h5 className="text-[16px] font-black tracking-tighter text-white uppercase leading-none">Zerozzz ERP</h5>
          <small className="text-[9px] font-bold text-cyan-400 block uppercase tracking-widest leading-none mt-0.5">{userRole?.replace('_', ' ')}</small>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-4 overflow-y-auto no-scrollbar scroll-smooth">
        {navItems.map((item) => {
          if (!isVisible(item)) return null;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 mx-2 my-1 p-2 rounded-lg transition-colors whitespace-nowrap ${
                isActive ? 'bg-[#34495e] text-white' : 'text-[#bdc3c7] hover:bg-[#34495e] hover:text-white'
              }`}
            >
              <div className="min-w-[38px] flex justify-center">
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors whitespace-nowrap"
        >
          <div className="min-w-[38px] flex justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
