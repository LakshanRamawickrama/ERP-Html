'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/constants/roles';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Clock, 
  Package, 
  Truck, 
  UserPlus, 
  DollarSign,
  Search,
  ChevronDown,
  LineChart
} from 'lucide-react';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(savedUser);
    setUserRole(user.role as UserRole);
  }, [router]);

  if (!userRole) return null;

  const kpis = [
    { label: 'Total Sales', value: '$128,430', icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Pending Orders', value: '42', icon: Clock, color: 'bg-amber-500' },
    { label: 'Inventory Value', value: '$45,200', icon: Package, color: 'bg-blue-500' },
    { label: 'Active Fleet', value: '18/20', icon: Truck, color: 'bg-teal-500' },
    { label: 'New Leads', value: '12', icon: UserPlus, color: 'bg-indigo-500' },
    { label: 'Revenue Growth', value: '+14.2%', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={userRole} />
      
      <main className="ml-[70px] flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
          <h5 className="text-base font-bold flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            {userRole === UserRole.SUPER_ADMIN ? 'Super Admin Dashboard' : 'Company Admin Dashboard'}
          </h5>

          <div className="flex items-center gap-6">
            <div className="relative group max-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs outline-none focus:bg-white focus:border-blue-500 transition-all w-full"
              />
            </div>
          </div>
        </header>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-3 flex-shrink-0">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center gap-3 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${kpi.color} flex items-center justify-center text-white`}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-none mb-1">{kpi.label}</div>
                <div className="text-sm font-extrabold text-slate-900 leading-none">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 pt-1 space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            
            {/* Widget: Performance */}
            <Widget title="Performance Overview" icon={TrendingUp} color="bg-blue-500">
              <div className="h-40 flex flex-col justify-center items-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <LineChart className="w-8 h-8 mb-2 opacity-20" />
                <span className="text-xs">Real-time Chart Module</span>
              </div>
            </Widget>

            {/* Widget: Recent Activity */}
            <Widget title="Recent Activity" icon={Clock} color="bg-emerald-500">
              <div className="space-y-3">
                {[
                  { user: 'Admin', action: 'Approved fleet maintenance', time: '2m ago' },
                  { user: 'Manager', action: 'Created new invoice #4492', time: '15m ago' },
                  { user: 'System', action: 'Inventory alert: Low stock on Items', time: '1h ago' },
                ].map((act, i) => (
                  <div key={i} className="flex justify-between items-start gap-4 text-xs border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-600"><b>{act.user}</b> {act.action}</span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{act.time}</span>
                  </div>
                ))}
              </div>
            </Widget>

            {/* Widget: Quick Stats */}
            <Widget title="Profit & Loss Recap" icon={DollarSign} color="bg-purple-500">
              <div className="space-y-1.5">
                <Row label="Total Revenue" value="$45,230" />
                <Row label="Cost of Goods" value="($12,400)" />
                <Row label="Operating Expenses" value="($8,920)" />
                <div className="border-t border-slate-100 my-2 pt-2 flex justify-between font-bold text-sm text-emerald-600">
                  <span>Net Profit</span>
                  <span>$23,910</span>
                </div>
              </div>
            </Widget>

          </div>
        </div>
      </main>
    </div>
  );
}

function Widget({ title, icon: Icon, color, children }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
        <div className={`w-6 h-6 rounded-md ${color} flex items-center justify-center text-white`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <h6 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">{title}</h6>
      </div>
      <div className="p-4 flex-1">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between text-xs py-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
