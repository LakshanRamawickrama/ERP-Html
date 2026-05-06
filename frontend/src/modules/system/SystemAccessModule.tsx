'use client';

import React, { useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { 
  Lock,
  Plus,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Phone,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SystemAccessModule() {
  const [isWide, setIsWide] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [data, setData] = useState<any>({ credentials: [], alerts: [] });

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_ENDPOINTS.SYSTEM, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  const togglePassword = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Tab Navigation / Alert Bar */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
        <div className="flex gap-6">
          <button className="py-4 text-xs font-bold border-b-2 border-slate-800 text-slate-800 transition-all flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            Credentials Repository
          </button>
        </div>
        <div className="flex items-center gap-3">
          {data.alerts?.map((alert: any, i: number) => (
            <AlertPill key={i} {...alert} />
          ))}
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <button 
            onClick={() => setIsWide(!isWide)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider shadow-sm"
          >
            {isWide ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {isWide ? 'Standard' : 'Wide'} View
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && (
            <div className="lg:col-span-4">
              <Card title="Add New Credential" icon={Plus} iconColor="bg-slate-800">
                <form className="space-y-4">
                  <Field label="Service Name *" isSelect options={data.options?.services || []} />
                  <Field label="Account / Username *" placeholder="Login ID or Username" />
                  <Field label="Password / PIN" type="password" placeholder="••••••••" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Status" isSelect options={data.options?.statuses || []} />
                    <Field label="Support Tel No" type="tel" placeholder="+94 11 ..." />
                  </div>
                  <Field label="Notes" isTextArea placeholder="URL, Renewal dates, etc." />
                  <button className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all transform active:scale-[0.98]">
                    Save Access Details
                  </button>
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card title="Credential Inventory" icon={Lock}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className={thClass}>Service</th>
                      <th className={thClass}>Account / ID</th>
                      <th className={thClass}>Status</th>
                      <th className={thClass}>Support No</th>
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.credentials?.map((cred: any) => (
                      <CredentialRow 
                        key={cred.id}
                        {...cred}
                        show={showPassword[cred.id]}
                        onToggle={() => togglePassword(cred.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider";

function AlertPill({ label, msg, type }: { label: string, msg: string, type: 'soon' | 'info' }) {
  const isSoon = type === 'soon';
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${
      isSoon ? 'bg-red-50 border-red-100 text-red-700' : 'bg-amber-50 border-amber-100 text-amber-700'
    }`}>
      <AlertTriangle className="w-3.5 h-3.5" />
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-bold">{label}</span>
        <span className="text-[9px] font-medium opacity-70">{msg}</span>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <select className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium">
          <option value="">Select Option...</option>
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea rows={3} className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" placeholder={placeholder} />
      ) : (
        <input type={type} className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" placeholder={placeholder} />
      )}
    </div>
  );
}

function CredentialRow({ service, account, status, support, password, id, show, onToggle }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{service}</div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium font-mono mt-1">
          {show ? password : '••••••••••••••••'}
          <button onClick={onToggle} className="text-slate-300 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
        </div>
      </td>
      <td className="px-4 py-4 font-medium text-slate-600">{account}</td>
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider">{status}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Phone className="w-3 h-3" />
          {support}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
