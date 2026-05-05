'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Building2, 
  Wrench, 
  Trash2, 
  IdCard, 
  PlusCircle, 
  Edit, 
  CheckCircle2, 
  Maximize2,
  Minimize2,
  Phone,
  Calendar,
  FileText
} from 'lucide-react';

type TabType = 'inventory' | 'requests' | 'waste' | 'licence';

export default function PropertyModule() {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [isWide, setIsWide] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h4 className="text-lg font-bold text-slate-800">Property Maintenance</h4>
        <p className="text-xs text-slate-500">Building Assets and Service Requests</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        <TabButton active={activeTab === 'inventory'} label="Inventory" onClick={() => setActiveTab('inventory')} />
        <TabButton active={activeTab === 'requests'} label="Service Requests" onClick={() => setActiveTab('requests')} />
        <TabButton active={activeTab === 'waste'} label="Waste Management" onClick={() => setActiveTab('waste')} />
        <TabButton active={activeTab === 'licence'} label="Licences" onClick={() => setActiveTab('licence')} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && (activeTab !== 'licence') && (
            <div className="lg:col-span-4">
              <Card title={`New ${activeTab === 'inventory' ? 'Asset' : activeTab === 'requests' ? 'Request' : 'Schedule'}`} icon={PlusCircle} iconColor="bg-[#2c3e50]">
                <form className="space-y-4">
                  {activeTab === 'inventory' && (
                    <>
                      <Field label="Asset Name" placeholder="Unit 5 Air Con" />
                      <Field label="Location" placeholder="Floor 2, Room 204" />
                      <Field label="Asset Type" isSelect options={['HVAC', 'Electrical', 'Plumbing', 'Safety']} />
                      <Field label="Assigned Tech" />
                      <Field label="Notes" isTextArea />
                    </>
                  )}
                  {activeTab === 'requests' && (
                    <>
                      <Field label="Issue Description" placeholder="Broken window" />
                      <Field label="Request Date" type="date" />
                      <Field label="Asset" isSelect options={['Main Office HVAC', 'Elevator A', 'Other']} />
                      <Field label="Priority" isSelect options={['Urgent', 'Medium', 'Low']} />
                      <Field label="Notes" isTextArea />
                    </>
                  )}
                  {activeTab === 'waste' && (
                    <>
                      <Field label="Contact person" />
                      <Field label="Phone" type="tel" />
                      <Field label="Pick-up Date" type="date" />
                      <Field label="Address" isTextArea />
                    </>
                  )}
                  <button className="w-full py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-colors">
                    Save Record
                  </button>
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide || activeTab === 'licence' ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card title="Registry List" icon={Building2}
              headerAction={
                <button onClick={() => setIsWide(!isWide)} className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-md hover:bg-slate-100 transition-all tracking-wide">
                  {isWide ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  {isWide ? 'Standard' : 'Wide'} View
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className={thClass}>Identifier</th>
                      <th className={thClass}>Location / Detail</th>
                      <th className={thClass}>Type / Priority</th>
                      <th className={thClass}>Status</th>
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'inventory' && (
                      <PropertyRow name="Main Office HVAC" sub="Floor 1, West Wing" type="HVAC" status="Operational" />
                    )}
                    {activeTab === 'requests' && (
                      <RequestRow date="2026-04-29" issue="Leak in Bathroom" prio="Urgent" status="In Progress" />
                    )}
                    {activeTab === 'waste' && (
                      <WasteRow date="2026-05-01" contact="John Doe" addr="Building A" status="Scheduled" />
                    )}
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

function TabButton({ active, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`py-4 text-xs font-bold border-b-2 transition-all ${
        active ? 'border-[#2c3e50] text-[#2c3e50]' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {label}
    </button>
  );
}

function PropertyRow({ name, sub, type, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 font-bold text-slate-800">{name}</td>
      <td className="px-4 py-3 text-slate-500 font-medium">{sub}</td>
      <td className="px-4 py-3 text-slate-400 text-xs">{type}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3">
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function RequestRow({ date, issue, prio, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 text-slate-500 font-mono tracking-tighter">{date}</td>
      <td className="px-4 py-3 font-bold text-slate-800">{issue}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
          prio === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
        }`}>{prio}</span>
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3">
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function WasteRow({ date, contact, addr, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 text-slate-500 font-mono tracking-tighter">{date}</td>
      <td className="px-4 py-3 font-bold text-slate-800">{contact}</td>
      <td className="px-4 py-3 text-slate-500">{addr}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3">
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <select className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500">
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea rows={2} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" placeholder={placeholder} />
      ) : (
        <input type={type} className={`w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500`} placeholder={placeholder} />
      )}
    </div>
  );
}
