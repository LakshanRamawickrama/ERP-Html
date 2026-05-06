'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole, RolePermissions, Permission } from '@/constants/roles';
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
  ChartLine,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const pathname = usePathname();
  const router = useRouter();
  const permissions = RolePermissions[userRole];

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: 'VIEW_DASHBOARD' },
    { label: 'Business Management', href: '/business', icon: Briefcase, permission: 'MANAGE_BUSINESS' },
    { label: 'User Management', href: '/users', icon: Users, permission: 'MANAGE_USERS' },
    { label: 'Fleet Management', href: '/fleet', icon: Truck, permission: 'MANAGE_FLEET' },
    { label: 'Inventory Management', href: '/inventory', icon: Boxes, permission: 'MANAGE_INVENTORY' },
    { label: 'System Access', href: '/system-access', icon: Key, permission: 'SYSTEM_ACCESS' },
    { label: 'Suppliers', href: '/suppliers', icon: Package, permission: 'MANAGE_INVENTORY' },
    { label: 'Accounting', href: '/accounting', icon: Receipt, permission: 'VIEW_ACCOUNTING' },
    { label: 'Legal & Compliance', href: '/legal', icon: Gavel, permission: 'LEGAL_COMPLIANCE' },
    { label: 'Property Management', href: '/property', icon: Building, permission: 'PROPERTY_MANAGEMENT' },
    { label: 'Reports', href: '/reports', icon: ChartLine, permission: 'VIEW_REPORTS' },
  ];

  return (
    <aside className="group fixed left-0 top-0 h-screen bg-[#2c3e50] text-[#ecf0f1] w-[70px] hover:w-[240px] transition-all duration-300 shadow-xl z-[1100] flex flex-col overflow-hidden">
      {/* Brand */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 min-h-[70px] whitespace-nowrap">
        <div className="min-w-[38px] flex justify-center">
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <h5 className="text-sm font-bold leading-tight">Business Central</h5>
          <small className="text-[10px] text-white/70 block">{userRole}</small>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-4 overflow-y-auto no-scrollbar scroll-smooth">
        {navItems.map((item) => {
          if (item.permission && !permissions.includes(item.permission as Permission)) {
            return null;
          }

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 mx-2 my-1 p-2 rounded-lg transition-colors whitespace-nowrap ${isActive ? 'bg-[#34495e] text-white' : 'text-[#bdc3c7] hover:bg-[#34495e] hover:text-white'
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
