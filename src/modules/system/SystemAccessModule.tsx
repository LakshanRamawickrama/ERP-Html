'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Key, 
  ShieldCheck, 
  History, 
  Smartphone, 
  Globe, 
  Terminal,
  Activity,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function SystemAccessModule() {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h4 className="text-lg font-bold text-slate-800">System Access</h4>
        <p className="text-xs text-slate-500">Global Security Settings and Authentication Logs</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Top Row: Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Active Sessions" value="12" icon={Smartphone} color="text-blue-600" />
          <StatCard title="Audit Events (24h)" value="1,402" icon={Activity} color="text-amber-600" />
          <StatCard title="Security Alerts" value="0" icon={ShieldCheck} color="text-emerald-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Audit Logs */}
          <div className="lg:col-span-8">
            <Card title="Security Audit Log" icon={History}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className={thClass}>Timestamp</th>
                      <th className={thClass}>User</th>
                      <th className={thClass}>Event</th>
                      <th className={thClass}>IP Address</th>
                      <th className={thClass}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <LogRow time="2026-05-05 09:12" user="super_admin" event="Login Successful" ip="192.168.1.1" status="Success" />
                    <LogRow time="2026-05-05 08:45" user="inventory_mgr" event="Stock Adjustment" ip="10.0.0.45" status="Success" />
                    <LogRow time="2026-05-05 07:30" user="unknown" event="Failed Login Attempt" ip="45.12.33.9" status="Failure" />
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* API Keys / Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            <Card title="Management Keys" icon={Key} iconColor="bg-[#2c3e50]">
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Production API Key</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-slate-800 flex-1">erp_live_******************</code>
                    <Eye className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
                </div>
                <button className="w-full py-2 flex items-center justify-center gap-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Rotate Keys
                </button>
              </div>
            </Card>

            <Card title="System Environment" icon={Terminal}>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Environment</span>
                  <span className="font-bold text-slate-700 uppercase">Production</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Framework</span>
                  <span className="font-bold text-slate-700">Next.js 15.0</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Region</span>
                  <span className="font-bold text-slate-700">EU-West-1</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider";

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-2xl font-black text-slate-800 tracking-tighter">{value}</h4>
      </div>
      <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

function LogRow({ time, user, event, ip, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{time}</td>
      <td className="px-4 py-3 font-bold text-slate-800">{user}</td>
      <td className="px-4 py-3 text-slate-500 text-xs">{event}</td>
      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{ip}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
          status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>{status}</span>
      </td>
    </tr>
  );
}
