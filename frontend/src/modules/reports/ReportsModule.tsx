'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { 
  ChartLine, 
  Download, 
  Filter, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';

export default function ReportsModule() {
  const [stats, setStats] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/reports').then(res => res.json()).then(data => setStats(data.stats || []));
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h4 className="text-lg font-bold text-slate-800">Business Analytics & Reports</h4>
        <p className="text-xs text-slate-500">Comprehensive Insights into Enterprise Performance</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
            <Calendar className="w-3.5 h-3.5" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter Modules
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-1.5 bg-[#2c3e50] text-white rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Data
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chart Placeholder */}
          <div className="lg:col-span-8">
            <Card title="Revenue vs Expenses (Projected)" icon={ChartLine}>
              <div className="h-[300px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 italic text-slate-400">
                <BarChart className="w-12 h-12 mb-3 text-slate-200" />
                Interactive Charts (Chart.js / Recharts) will be integrated here
              </div>
            </Card>
          </div>

          {/* Export Options */}
          <div className="lg:col-span-4 space-y-6">
            <Card title="Available Templates" icon={FileSpreadsheet}>
              <div className="space-y-2">
                <ExportItem label="Monthly Financial Audit" format="PDF" />
                <ExportItem label="Inventory Stock Level" format="XLSX" />
                <ExportItem label="Fleet Maintenance Log" format="CSV" />
                <ExportItem label="User Access Report" format="JSON" />
              </div>
            </Card>
            
            <Card title="Distribution" icon={PieChart}>
              <div className="h-[120px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Category Split
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isUp }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-xl font-black text-slate-800 tracking-tighter mb-2">{value}</h4>
      <div className={`flex items-center gap-1 text-[11px] font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trend} from last month
      </div>
    </div>
  );
}

function ExportItem({ label, format }: any) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer">
      <span className="text-xs font-bold text-slate-600 group-hover:text-[#2c3e50]">{label}</span>
      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
        format === 'PDF' ? 'bg-red-50 text-red-600' : 
        format === 'XLSX' ? 'bg-emerald-50 text-emerald-600' : 
        'bg-slate-100 text-slate-600'
      }`}>{format}</span>
    </div>
  );
}
