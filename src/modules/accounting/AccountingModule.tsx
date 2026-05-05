'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  FileText, 
  Receipt, 
  University, 
  HandHoldingDollar, 
  ShieldCheck, 
  Coins, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Plus
} from 'lucide-react';

type TabType = 'records' | 'invoices' | 'bank' | 'loans' | 'insurance' | 'tax';

export default function AccountingModule() {
  const [activeTab, setActiveTab] = useState<TabType>('records');

  const tabs = [
    { id: 'records', label: 'Financial Records', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'bank', label: 'Bank Details', icon: University },
    { id: 'loans', label: 'Loans', icon: HandHoldingDollar },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
    { id: 'tax', label: 'VAT / Tax', icon: Coins },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Module Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-slate-800">Accounting Module</h1>
        <p className="text-xs text-slate-500">Manage Financial Records, Invoices, and Statements</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id 
                ? 'border-slate-800 text-slate-800' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mini KPIs */}
        <div className="hidden md:flex gap-3 py-2">
          <Pill type="income" label="Income" value="$6,200.00" />
          <Pill type="expense" label="Expenses" value="$4,785.00" />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {activeTab === 'records' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card title="Add Financial Record" icon={Plus} iconColor="bg-emerald-500">
                <form className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Record Title</label>
                    <input type="text" className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" placeholder="e.g. Monthly Rent" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                    <select className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500">
                      <option>Supplier Payments</option>
                      <option>Rent</option>
                      <option>Utilities</option>
                    </select>
                  </div>
                  <button className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-slate-700 transition-all">
                    Save Record
                  </button>
                </form>
              </Card>
            </div>
            <div className="lg:col-span-8">
              <Card title="Financial Registry" icon={FileText}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Description</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Category</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Amount</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[1, 2, 3].map(i => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium">Monthly Rent - Office A</td>
                          <td className="px-4 py-3 text-slate-500">Rent</td>
                          <td className="px-4 py-3 text-red-500 font-bold">-$1,200.00</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Paid</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab !== 'records' && (
          <div className="flex items-center justify-center h-64 text-slate-400 italic">
            {tabs.find(t => t.id === activeTab)?.label} sub-module coming soon...
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ type, label, value }: { type: 'income' | 'expense', label: string, value: string }) {
  const isIncome = type === 'income';
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
      isIncome ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
    }`}>
      {isIncome ? <ArrowDownCircle className="w-3.5 h-3.5" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
      <span className="text-[10px] font-bold">
        {label}: <span className="font-extrabold">{value}</span>
      </span>
    </div>
  );
}

// Icon fallbacks
const HandHoldingDollar = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8l-4.3 4.2c-.2.2-.5.3-.8.3H11"/><path d="M15 9V7a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"/></svg>
);
