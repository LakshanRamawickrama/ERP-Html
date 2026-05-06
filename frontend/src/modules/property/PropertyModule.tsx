'use client';

import React, { useState, useEffect } from 'react';
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
  FileText,
  FileSearch,
  AlertTriangle,
  User
} from 'lucide-react';

type TabType = 'inventory' | 'requests' | 'waste' | 'licence';

export default function PropertyModule() {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [isWide, setIsWide] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [data, setData] = useState<any>({ assets: [], requests: [], waste: [], licences: [] });

  useEffect(() => {
    fetch('/api/property').then(res => res.json()).then(setData);
  }, []);

  const handleEdit = (id: string, rowData: any, tab: TabType) => {
    setEditingId(id);
    setFormData(rowData);
    setActiveTab(tab);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      console.log('Updating:', editingId, formData);
    } else {
      console.log('Creating:', formData);
    }
    handleCancelEdit();
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        <TabButton active={activeTab === 'inventory'} label="Property Inventory" onClick={() => setActiveTab('inventory')} />
        <TabButton active={activeTab === 'requests'} label="Maintenance Requests" onClick={() => setActiveTab('requests')} />
        <TabButton active={activeTab === 'waste'} label="Waste Collection" onClick={() => setActiveTab('waste')} />
        <TabButton active={activeTab === 'licence'} label="Licences & Permits" onClick={() => setActiveTab('licence')} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && (
            <div className="lg:col-span-4">
              <Card 
                title={
                  editingId ? (
                    activeTab === 'inventory' ? 'Edit Property Asset' : 
                    activeTab === 'requests' ? 'Edit Maintenance Request' : 
                    activeTab === 'waste' ? 'Edit Waste Collection' : 
                    'Edit Licence'
                  ) : (
                    activeTab === 'inventory' ? 'Add Property Asset' : 
                    activeTab === 'requests' ? 'New Maintenance Request' : 
                    activeTab === 'waste' ? 'Schedule Waste Collection' : 
                    'New Licence Registry'
                  )
                } 
                icon={editingId ? Edit : (activeTab === 'requests' ? Wrench : activeTab === 'waste' ? Trash2 : activeTab === 'licence' ? IdCard : PlusCircle)} 
                iconColor="bg-[#2c3e50]"
              >
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {activeTab === 'inventory' && (
                    <>
                      <Field label="Asset Name" placeholder="e.g. Unit 5 Air Con" />
                      <Field label="Location / Floor" placeholder="Floor 2, Room 204" />
                      <Field label="Asset Type" isSelect options={data.assetTypes || []} />
                      <Field label="Assigned Person" placeholder="Name of responsible person" />
                      <Field label="Contact Number" placeholder="+1 (555) 000-0000" />
                      <Field label="Notes" isTextArea placeholder="Specific instructions or property details" />
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Asset Documents</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer bg-slate-50">
                           <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                           <p className="text-[10px] text-slate-500 font-medium">Click or Drag & Drop Manual/Warranty</p>
                        </div>
                      </div>
                    </>
                  )}
                  {activeTab === 'requests' && (
                    <>
                      <Field label="Issue Description" placeholder="e.g. Broken window" />
                      <Field label="Request Date" type="date" />
                      <Field label="Select Asset" isSelect options={data.assetOptions || []} />
                      <Field label="Priority" isSelect options={data.priorities || []} />
                      <Field label="Assigned Technician" placeholder="Name of technician" />
                      <Field label="Request Notes" isTextArea placeholder="Describe specific details of the issue" />
                    </>
                  )}
                  {activeTab === 'waste' && (
                    <>
                      <Field label="Contact Name" placeholder="e.g. Building Manager" />
                      <Field label="Phone Number" type="tel" placeholder="e.g. +1 555-0199" />
                      <Field label="Collection Address" placeholder="Full address or unit location" />
                      <Field label="Pick-up Date" type="date" />
                      <Field label="Notes" isTextArea placeholder="e.g. Large items, hazardous waste..." />
                    </>
                  )}
                  {activeTab === 'licence' && (
                    <>
                      <Field label="Licence Type" placeholder="e.g. HMO Licence" />
                      <Field label="Business Name" placeholder="e.g. Property Central Ltd" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Issue Date" type="date" />
                        <Field label="Expiry Date" type="date" />
                      </div>
                      <Field label="Issuing Authority" placeholder="e.g. Local City Council" />
                      <Field label="Status" isSelect options={data.statuses || []} />
                      <Field label="Upload Document" type="file" />
                    </>
                  )}
                  <button className="w-full py-3 bg-[#2c3e50] text-white rounded-xl text-sm font-bold shadow-lg hover:bg-[#34495e] transition-all transform active:scale-[0.98]">
                    {editingId ? 'Update Record' : (
                      activeTab === 'inventory' ? 'Register Asset' : 
                      activeTab === 'requests' ? 'Log Request' : 
                      activeTab === 'waste' ? 'Schedule Collection' : 
                      'Register Licence'
                    )}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card 
              title={
                activeTab === 'inventory' ? 'Building Asset Registry' : 
                activeTab === 'requests' ? 'Pending & Active Requests' : 
                activeTab === 'waste' ? 'Waste Collection Schedule' : 
                'Licence & Permit Registry'
              } 
              icon={activeTab === 'inventory' ? Building2 : activeTab === 'requests' ? Wrench : activeTab === 'waste' ? Trash2 : IdCard}
              headerAction={
                <button onClick={() => setIsWide(!isWide)} className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-md hover:bg-slate-100 transition-all tracking-wide">
                  {isWide ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  {isWide ? 'Standard' : 'Wide'} View
                </button>
              }
            >
              <div className="overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {activeTab === 'inventory' && (
                        <>
                          <th className={thClass}>Asset</th>
                          <th className={thClass}>Location</th>
                          <th className={thClass}>Type</th>
                          <th className={thClass}>Document</th>
                          <th className={thClass}>Assigned / Contact</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'requests' && (
                        <>
                          <th className={thClass}>Date</th>
                          <th className={thClass}>Issue</th>
                          <th className={thClass}>Priority</th>
                          <th className={thClass}>Asset</th>
                          <th className={thClass}>Technician</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'waste' && (
                        <>
                          <th className={thClass}>Pick-up Date</th>
                          <th className={thClass}>Contact Person</th>
                          <th className={thClass}>Address / Location</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'licence' && (
                        <>
                          <th className={thClass}>Licence / Business</th>
                          <th className={thClass}>Authority</th>
                          <th className={thClass}>Expiry</th>
                          <th className={thClass}>Issue Date</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'inventory' && (
                      data.assets?.map((r: any, i: number) => <PropertyRow key={i} {...r} onEdit={() => handleEdit(`asset-${i}`, r, 'inventory')} />) || null
                    )}
                    {activeTab === 'requests' && (
                      data.requests?.map((r: any, i: number) => <RequestRow key={i} {...r} onEdit={() => handleEdit(`request-${i}`, r, 'requests')} />) || null
                    )}
                    {activeTab === 'waste' && (
                      data.waste?.map((r: any, i: number) => <WasteRow key={i} {...r} onEdit={() => handleEdit(`waste-${i}`, r, 'waste')} />) || null
                    )}
                    {activeTab === 'licence' && (
                      data.licences?.map((r: any, i: number) => <LicenceRow key={i} {...r} onEdit={() => handleEdit(`licence-${i}`, r, 'licence')} />) || null
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

function PropertyRow({ name, sub, type, doc, person, contact, status, onEdit }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <div className="font-bold text-slate-800">{name}</div>
      </td>
      <td className="px-4 py-3 text-slate-500 font-medium">{sub}</td>
      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">{type}</span></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md w-fit">
          <FileText className="w-3 h-3 text-red-500" />
          {doc}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-[11px] leading-tight">
          <div className="font-bold text-slate-700">{person}</div>
          <div className="text-slate-400">{contact}</div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3">
        <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function RequestRow({ date, issue, asset, tech, prio, status, onEdit }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 text-slate-500 font-mono tracking-tighter">{date}</td>
      <td className="px-4 py-3 font-bold text-slate-800">{issue}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
          prio === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
        }`}>{prio}</span>
      </td>
      <td className="px-4 py-3 text-slate-500 font-medium">{asset}</td>
      <td className="px-4 py-3 text-slate-600">{tech}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3">
        <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function WasteRow({ date, contact, phone, addr, status, onEdit }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 text-slate-500 font-mono tracking-tighter">{date}</td>
      <td className="px-4 py-3">
        <div className="font-bold text-slate-800">{contact}</div>
        <div className="text-[10px] text-slate-400 font-medium">{phone}</div>
      </td>
      <td className="px-4 py-3 text-slate-500">{addr}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3">
        <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function LicenceRow({ type, biz, auth, expiry, issue, status, onEdit }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <div className="font-bold text-slate-800">{type}</div>
        <div className="text-[10px] text-slate-400 font-medium">{biz}</div>
      </td>
      <td className="px-4 py-3 text-slate-500 font-medium">{auth}</td>
      <td className="px-4 py-3 font-mono text-slate-600">{expiry}</td>
      <td className="px-4 py-3 font-mono text-slate-400 text-xs">{issue}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
          status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>{status}</span>
      </td>
      <td className="px-4 py-3">
        <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
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
        <select className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all">
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea rows={2} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" placeholder={placeholder} />
      ) : (
        <input type={type} className={`w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all`} placeholder={placeholder} />
      )}
    </div>
  );
}
