'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { useRouter, useParams } from 'next/navigation';
import { UserRole } from '@/constants/roles';
import { 
  ArrowLeft, 
  Briefcase, 
  TrendingUp, 
  Truck, 
  Package, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Phone, 
  Mail,
  Building2,
  Calendar,
  CreditCard,
  History,
  FileText,
  DollarSign,
  Activity,
  UserCheck,
  FileBadge,
  ExternalLink,
  ChevronRight,
  Plus,
  Box,
  Key
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const BUSINESS_DATA: any = {
  'alpha-trading': { name: 'Alpha Trading Co.', inc: '$125,400', exp: '$42,100', skus: '1,240', flt: 12, st: 'Active', category: 'Retail', hq: 'London, UK', phone: '+44 20 7946 0123', email: 'contact@alphatrading.com', website: 'www.alphatrading.com', vat: 'GB123456789', crn: '09876543', bank: 'Barclays Business', sort: '20-00-00', acc: '12345678' },
  'beta-logistics': { name: 'Beta Logistics Ltd.', inc: '$84,200', exp: '$31,500', skus: '450', flt: 24, st: 'Active', category: 'Logistics', hq: 'Manchester, UK', phone: '+44 161 496 0345', email: 'info@betalogistics.co.uk', website: 'www.betalogistics.co.uk', vat: 'GB987654321', crn: '11223344', bank: 'HSBC UK', sort: '40-00-00', acc: '87654321' },
};

export default function BusinessDetailPage() {
  const { id } = useParams();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();
  
  const business = BUSINESS_DATA[id as string] || {
    name: (id as string)?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    inc: '$0', exp: '$0', skus: '0', flt: 0, st: 'Unknown', category: 'General', hq: 'N/A'
  };

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

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <Sidebar userRole={userRole} />
      
      <main className="ml-[70px] flex-1 flex flex-col h-screen overflow-hidden">
        {/* Compact Header */}
        <header className="bg-[#1e293b] text-white px-6 py-2.5 flex items-center justify-between shadow-lg z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70">
              <ArrowLeft size={16} />
            </button>
            <div className="h-6 w-px bg-white/10 mx-1"></div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-black tracking-tight">{business.name}</h1>
                <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase">LIVE</span>
              </div>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-wider">{business.category} • CRN {business.crn}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <HeaderStat label="MTD REVENUE" value={business.inc} color="text-emerald-400" />
            <HeaderStat label="MTD EXPENSE" value={business.exp} color="text-rose-400" />
            <HeaderStat label="PROFIT" value="$83,300" color="text-blue-400" />
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2">
              <Plus size={12} /> NEW RECORD
            </button>
          </div>
        </header>

        {/* Content Area - All-in-one Screen */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-[#f8fafc]">
          <div className="grid grid-cols-12 gap-3">
            
            {/* 1. KEY METRICS BAR (Compact) */}
            <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-1">
              <MetricBox label="Current Balance" value="$245,800" trend="+4.2%" color="blue" />
              <MetricBox label="Fleet Utilization" value="92%" trend="-1.5%" color="purple" />
              <MetricBox label="Inventory Value" value="$1.2M" trend="+0.8%" color="amber" />
              <MetricBox label="Employee Count" value="14" trend="0%" color="emerald" />
              <MetricBox label="Open Issues" value="3" trend="+2" color="rose" />
              <MetricBox label="Active Licenses" value="8" trend="Valid" color="indigo" />
            </div>

            {/* 2. IDENTITY & BANKING (Left) */}
            <div className="col-span-12 lg:col-span-3 space-y-3">
              <Card title="Business Identity" icon={Building2} iconColor="bg-slate-900" noPadding>
                <div className="p-3 space-y-3">
                  <CompactInfoItem icon={<MapPin size={12} />} label="Registered Office" value={business.hq} />
                  <CompactInfoItem icon={<Mail size={12} />} label="Corporate Email" value={business.email} />
                  <CompactInfoItem icon={<Phone size={12} />} label="Contact Number" value={business.phone} />
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <DataPoint label="VAT REG" value={business.vat} />
                    <DataPoint label="CRN" value={business.crn} />
                  </div>
                </div>
              </Card>

              <Card title="Financial Accounts" icon={CreditCard} iconColor="bg-blue-600" noPadding>
                <div className="p-3 bg-blue-50/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{business.bank}</span>
                    <span className="text-[8px] font-bold text-slate-400">PRIMARY</span>
                  </div>
                  <div className="space-y-1.5">
                    <BankField label="Sort Code" value={business.sort} />
                    <BankField label="Account No" value={business.acc} />
                    <BankField label="IBAN" value="GB88BARC200000..." />
                  </div>
                </div>
              </Card>

              <Card title="Key Personnel" icon={UserCheck} iconColor="bg-purple-600" noPadding>
                <div className="divide-y divide-slate-50">
                  <PersonRow name="John Smith" role="Managing Director" initials="JS" />
                  <PersonRow name="Sarah Miller" role="Finance Director" initials="SM" />
                </div>
              </Card>
            </div>

            {/* 3. OPERATIONS & PERFORMANCE (Center) */}
            <div className="col-span-12 lg:col-span-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Card title="Compliance Timeline" icon={ShieldCheck} iconColor="bg-rose-500">
                  <div className="space-y-2">
                    <StatusLine label="VAT Return Q2" status="Filed" date="04 May" color="emerald" />
                    <StatusLine label="Payroll Run" status="Pending" date="28 May" color="blue" />
                    <StatusLine label="Fleet Insurance" status="Renewal" date="14 May" color="amber" />
                  </div>
                </Card>
                <Card title="Fleet & Assets" icon={Truck} iconColor="bg-indigo-500">
                   <div className="flex items-center justify-between mb-4">
                     <div className="text-center px-3 py-1 bg-slate-50 rounded-lg">
                       <p className="text-[8px] font-black text-slate-400">TOTAL</p>
                       <p className="text-sm font-black text-slate-800">{business.flt}</p>
                     </div>
                     <div className="text-center px-3 py-1 bg-emerald-50 rounded-lg">
                       <p className="text-[8px] font-black text-emerald-600">ACTIVE</p>
                       <p className="text-sm font-black text-emerald-700">10</p>
                     </div>
                     <div className="text-center px-3 py-1 bg-amber-50 rounded-lg">
                       <p className="text-[8px] font-black text-amber-600">SERVICE</p>
                       <p className="text-sm font-black text-amber-700">2</p>
                     </div>
                   </div>
                   <button className="w-full py-1.5 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase hover:bg-slate-50 transition-all">
                     View Asset Registry
                   </button>
                </Card>
              </div>

              <Card title="Recent Ledger Transactions" icon={History} iconColor="bg-slate-700" noPadding>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3">Category</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { date: '04 May', desc: 'Amazon Web Services', cat: 'Tech', amt: '-$124.50' },
                        { date: '03 May', desc: 'Customer Payment #902', cat: 'Sales', amt: '+$2,450.00' },
                        { date: '02 May', desc: 'Office Supplies UK', cat: 'Ops', amt: '-$45.00' },
                        { date: '01 May', desc: 'Monthly Warehouse Rent', cat: 'Facility', amt: '-$1,200.00' },
                      ].map((t, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 px-3 text-slate-500">{t.date}</td>
                          <td className="py-2 px-3 font-bold text-slate-800">{t.desc}</td>
                          <td className="py-2 px-3"><span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase">{t.cat}</span></td>
                          <td className={`py-2 px-3 text-right font-black ${t.amt.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{t.amt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* 4. INVENTORY & STAFF (Right) */}
            <div className="col-span-12 lg:col-span-3 space-y-3">
              <Card title="Inventory & SKUs" icon={Package} iconColor="bg-amber-500">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">Active Stock</span>
                    <span className="text-xs font-black text-slate-900">{business.skus}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[65%]"></div>
                  </div>
                  <div className="flex justify-between text-[8px] font-black uppercase text-slate-400 tracking-wider">
                    <span>In Stock: 840</span>
                    <span>Reserved: 120</span>
                  </div>
                </div>
              </Card>

              <Card title="Supplier Relations" icon={Truck} iconColor="bg-blue-500" noPadding>
                <div className="p-3 space-y-2">
                  {[
                    { name: 'Global Logistics', type: 'Primary', status: 'Good' },
                    { name: 'Prime Supplies', type: 'Inventory', status: 'Delayed' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-[10px] font-black text-slate-800 leading-none">{s.name}</p>
                        <p className="text-[8px] text-slate-400 mt-1 font-bold">{s.type}</p>
                      </div>
                      <span className={cn("text-[8px] font-black uppercase", s.status === 'Good' ? 'text-emerald-600' : 'text-amber-600')}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Property Assets" icon={Building2} iconColor="bg-slate-700">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-bold text-slate-500">Main Warehouse</span>
                       <span className="font-black text-slate-900">Unit 4, SE1</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-bold text-slate-500">Retail Outlet</span>
                       <span className="font-black text-slate-900">Oxford St</span>
                    </div>
                 </div>
              </Card>

              <Card title="HR & Access Control" icon={Key} iconColor="bg-slate-800" noPadding>
                 <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                       <div className="text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase">Staff</p>
                          <p className="text-sm font-black text-slate-800">14</p>
                       </div>
                       <div className="h-6 w-px bg-slate-100"></div>
                       <div className="text-center">
                          <p className="text-[8px] font-black text-slate-400 uppercase">Active</p>
                          <p className="text-sm font-black text-emerald-600">12</p>
                       </div>
                    </div>
                    <button className="w-full py-1.5 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest hover:bg-indigo-500">
                       Manage Permissions
                    </button>
                 </div>
              </Card>

              <Card title="Generated Reports" icon={FileText} iconColor="bg-rose-600">
                 <div className="space-y-2">
                    {['Q2 Tax Summary', 'Fleet Audit May', 'Inventory Value'].map((rep, i) => (
                      <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-slate-600 cursor-pointer hover:text-indigo-600">
                        <FileBadge size={12} className="text-rose-500" />
                        {rep}
                      </div>
                    ))}
                 </div>
              </Card>
            </div>

          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function HeaderStat({ label, value, color }: any) {
  return (
    <div className="flex flex-col items-start leading-none">
      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">{label}</span>
      <span className={cn("text-xs font-black", color)}>{value}</span>
    </div>
  );
}

function MetricBox({ label, value, trend, color }: any) {
  const colors: any = {
    blue: "border-blue-100 text-blue-600",
    purple: "border-purple-100 text-purple-600",
    amber: "border-amber-100 text-amber-600",
    emerald: "border-emerald-100 text-emerald-600",
    rose: "border-rose-100 text-rose-600",
    indigo: "border-indigo-100 text-indigo-600"
  };

  return (
    <div className={cn("bg-white p-2.5 rounded-xl border shadow-sm", colors[color])}>
      <p className="text-[8px] font-black uppercase tracking-wider opacity-60 mb-0.5">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-sm font-black text-slate-900 leading-none">{value}</span>
        <span className="text-[8px] font-black">{trend}</span>
      </div>
    </div>
  );
}

function CompactInfoItem({ icon, label, value }: any) {
  return (
    <div className="flex gap-2">
      <div className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">{label}</p>
        <p className="text-[10px] font-bold text-slate-800 leading-tight truncate">{value}</p>
      </div>
    </div>
  );
}

function DataPoint({ label, value }: any) {
  return (
    <div className="flex flex-col">
      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</span>
      <span className="text-[9px] font-black text-slate-900">{value}</span>
    </div>
  );
}

function BankField({ label, value }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[9px] font-bold text-slate-500">{label}</span>
      <span className="text-[9px] font-mono font-black text-slate-900">{value}</span>
    </div>
  );
}

function PersonRow({ name, role, initials }: any) {
  return (
    <div className="p-2.5 flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[9px] font-black">{initials}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-800 leading-none mb-1">{name}</p>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{role}</p>
      </div>
      <ChevronRight size={10} className="ml-auto text-slate-300" />
    </div>
  );
}

function StatusLine({ label, status, date, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-500 text-emerald-600",
    blue: "bg-blue-500 text-blue-600",
    amber: "bg-amber-500 text-amber-600",
    rose: "bg-rose-500 text-rose-600"
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
      <div className={cn("w-1 h-5 rounded-full", colors[color].split(' ')[0])}></div>
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black text-slate-800 leading-none">{label}</p>
          <p className="text-[8px] text-slate-400 mt-1 font-bold">{date}</p>
        </div>
        <span className={cn("text-[8px] font-black uppercase", colors[color].split(' ')[1])}>
          {status}
        </span>
      </div>
    </div>
  );
}

function StaffMetric({ label, value }: any) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
      <span className="text-[9px] font-bold text-slate-500">{label}</span>
      <span className="text-[10px] font-black text-slate-900">{value}</span>
    </div>
  );
}
