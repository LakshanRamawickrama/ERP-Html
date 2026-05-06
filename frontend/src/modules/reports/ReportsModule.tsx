'use client';

import React from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart,
  FileSpreadsheet,
  FileJson,
  Building2,
  Briefcase,
  DollarSign,
  Truck,
  CreditCard,
  Wallet,
  Receipt,
  RefreshCw,
  Trophy,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';


export default function ReportsModule() {
  const [data, setData] = React.useState<any>({ stats: [], templates: [], businesses: [] });
  const [selectedBiz, setSelectedBiz] = React.useState('All Entities');
  const [user, setUser] = React.useState<any>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedDoc, setSelectedDoc] = React.useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);


  const fetchReports = React.useCallback(() => {
    setRefreshing(true);
    fetch(API_ENDPOINTS.REPORTS)
      .then(res => res.json())
      .then(setData)
      .finally(() => setTimeout(() => setRefreshing(false), 800));
  }, []);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed.role !== 'Super Admin') {
        setSelectedBiz(parsed.businesses?.[0] || 'Assigned Business');
      }
    }
    fetchReports();
  }, [fetchReports]);

  const stats = data.stats || [];
  const templates = data.templates || [];
  const businesses = data.businesses || [];
  const banks = data.banks || [];
  const tax = data.tax || [];

  const handleViewDoc = (docTitle: string, format: string) => {
    setSelectedDoc({ title: docTitle, type: `Report (${format})` });
    setIsDrawerOpen(true);
  };

  const StatItem = ({ title, value, icon: Icon, color, borderColor, bgColor }: any) => (

    <div className={`px-3 py-1 rounded-full border ${borderColor} ${bgColor} flex items-center gap-3 transition-all hover:brightness-95 cursor-default`}>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className={`text-[11px] font-black uppercase tracking-tight ${color}`}>{title}:</span>
        <span className="text-[11px] font-bold text-slate-700">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-5 py-1.5 flex items-center justify-between">
        <div className="flex gap-2.5">
          <button className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-all">
            <Calendar className="w-3 h-3" />
            Last 30 Days
          </button>

          <select 
            value={selectedBiz}
            onChange={(e) => setSelectedBiz(e.target.value)}
            disabled={user?.role !== 'Super Admin'}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-all outline-none",
              user?.role !== 'Super Admin' && "opacity-80 pointer-events-none"
            )}
          >
            {user?.role === 'Super Admin' ? (
              <>
                <option>All Entities</option>
                {businesses.map((b: any) => (
                  <option key={b.id}>{b.name}</option>
                ))}
              </>
            ) : (
              <option>{user?.businesses?.[0] || 'Assigned Business'}</option>
            )}
          </select>
        </div>
        <div className="flex gap-1.5">
          <button 
            onClick={fetchReports}
            className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-blue-500' : ''}`} />
            Sync
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 bg-[#2c3e50] text-white rounded text-[10px] font-bold shadow-sm hover:brightness-110 transition-all">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Pill-Style KPI Badges */}
        <div className="flex flex-wrap gap-3">
          <StatItem title="Total Revenue" value={stats[0]?.value || '$0'} icon={DollarSign} color="text-emerald-700" borderColor="border-emerald-200" bgColor="bg-emerald-50" />
          <StatItem title="Op. Costs" value={stats[1]?.value || '$0'} icon={TrendingDown} color="text-red-700" borderColor="border-red-200" bgColor="bg-red-50" />
          <StatItem title="Net Profit" value={stats[2]?.value || '$0'} icon={TrendingUp} color="text-blue-700" borderColor="border-blue-200" bgColor="bg-blue-50" />
          <StatItem title="Inventory" value={`${stats[3]?.value || '0'} Items`} icon={Truck} color="text-amber-700" borderColor="border-amber-200" bgColor="bg-amber-50" />
        </div>

        {/* Top Feature Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 1. Available Templates */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Available Templates</h5>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 h-[180px] overflow-y-auto">
              <div className="space-y-1">
                {templates.map((t: any, i: number) => (
                  <ExportItem 
                    key={i} 
                    {...t} 
                    onClick={() => handleViewDoc(t.label, t.format)}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* 2. Top Performance Leaderboard */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Top Performers</h5>
              <Trophy className="w-3 h-3 text-amber-500" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[180px] overflow-y-auto">
              <div className="p-1">
                {[...businesses].sort((a, b) => parseFloat(b.inc.replace(/[$,]/g, '')) - parseFloat(a.inc.replace(/[$,]/g, ''))).slice(0, 5).map((biz, i) => (
                  <div key={biz.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-all group">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[9px] ${
                        i === 0 ? 'bg-amber-100 text-amber-600' : 
                        i === 1 ? 'bg-slate-100 text-slate-600' : 
                        'bg-orange-50 text-orange-600'
                      }`}>
                        #{i + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{biz.name}</span>
                        <span className="text-[8px] text-slate-400 uppercase font-black">{biz.st}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-emerald-600">{biz.inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Consolidated Cash & Tax Overview */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Cash & Tax Overview</h5>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[180px] flex flex-col">
              <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-3 h-3 text-slate-400" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Enterprise Liquidity</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600">${banks.reduce((acc: any, b: any) => acc + parseFloat((b.bl || '0').replace(/[$,]/g, '')), 0).toLocaleString()}</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                {banks.map((bank: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-300" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-700 truncate max-w-[100px]">{bank.b}</span>
                        <span className="text-[8px] text-slate-400">{bank.n}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-800">{bank.bl}</span>
                  </div>
                ))}
                <div className="p-2 bg-slate-50/50">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Statutory Obligations</p>
                  {tax.slice(0, 2).map((t: any, i: number) => (
                    <div key={i} className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-slate-600">{t.type}</span>
                      <span className="text-[9px] font-black text-red-500">{t.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Entity Performance Ledger */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">Multi-Entity Performance Ledger</h5>
              <p className="text-[10px] text-slate-500 font-medium">Consolidated details across all active and pending business units</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap w-[22%]">Business Entity</th>
                    <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap w-[15%]">Admin Name</th>
                    <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center w-[10%]">Category</th>
                    <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center w-[10%]">Revenue</th>
                    <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center w-[10%]">Expenses</th>
                    <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap w-[15%]">Net Result</th>
                    <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap w-[9%]">Assets</th>
                    <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right w-[9%]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((biz: any) => {
                    const incVal = parseFloat(biz.inc.replace(/[$,]/g, '')) || 0;
                    const expVal = parseFloat(biz.exp.replace(/[$,]/g, '')) || 0;
                    const netVal = incVal - expVal;
                    const margin = incVal > 0 ? ((netVal / incVal) * 100).toFixed(1) : '0.0';
                    
                    return (
                      <tr key={biz.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#2c3e50] group-hover:text-white transition-colors">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700 truncate block">{biz.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">ID: {biz.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                              {biz.admin?.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 truncate">{biz.admin}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center gap-2">
                            <Briefcase className="w-3 h-3 text-slate-300" />
                            <span className="text-[11px] font-bold text-slate-600">
                              {biz.id % 2 === 0 ? 'Logistics' : 'Retail'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-xs font-black text-emerald-600 uppercase tracking-tighter text-center">{biz.inc}</td>
                        <td className="px-4 py-2 text-xs font-black text-red-500 uppercase tracking-tighter text-center">{biz.exp}</td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs font-black ${netVal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {netVal >= 0 ? '+' : ''}${netVal.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${parseFloat(margin) > 20 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                  style={{ width: `${Math.min(Math.max(parseFloat(margin), 0), 100)}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-black text-slate-400">{margin}%</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col text-[10px] font-bold text-slate-500">
                            <span>{biz.skus} SKUs</span>
                            <span>{biz.flt} Vehicles</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-md ${
                            biz.st === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                            biz.st === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                            'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {biz.st.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <DocumentDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        documentData={selectedDoc}
      />
    </div>

  );
}


function ExportItem({ label, format, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer"
    >

      <span className="text-xs font-bold text-slate-600 group-hover:text-[#2c3e50]">{label}</span>
      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
        format === 'PDF' ? 'bg-red-50 text-red-600' : 
        format === 'XLSX' ? 'bg-emerald-50 text-emerald-600' : 
        'bg-slate-100 text-slate-600'
      }`}>{format}</span>
    </div>
  );
}
