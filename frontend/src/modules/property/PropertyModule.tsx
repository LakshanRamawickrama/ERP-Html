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
  FileText,
  FileSearch,
  AlertTriangle,
  User
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
        <p className="text-xs text-slate-500">Unified Module for Building Assets and Service Requests</p>
      </div>

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
                  activeTab === 'inventory' ? 'Add Property Asset' : 
                  activeTab === 'requests' ? 'New Maintenance Request' : 
                  activeTab === 'waste' ? 'Schedule Waste Collection' : 
                  'New Licence Registry'
                } 
                icon={activeTab === 'requests' ? Wrench : activeTab === 'waste' ? Trash2 : activeTab === 'licence' ? IdCard : PlusCircle} 
                iconColor="bg-[#2c3e50]"
              >
                <form className="space-y-4">
                  {activeTab === 'inventory' && (
                    <>
                      <Field label="Asset Name" placeholder="e.g. Unit 5 Air Con" />
                      <Field label="Location / Floor" placeholder="Floor 2, Room 204" />
                      <Field label="Asset Type" isSelect options={['HVAC', 'Electrical', 'Plumbing', 'Safety', 'Furniture', 'IT Infrastructure']} />
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
                      <Field label="Select Asset" isSelect options={['Main Office HVAC', 'Elevator A', 'Fire Suppression System', 'Other']} />
                      <Field label="Priority" isSelect options={['Urgent', 'Medium', 'Low']} />
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
                      <Field label="Status" isSelect options={['Active', 'Expired', 'Pending']} />
                      <Field label="Upload Document" type="file" />
                    </>
                  )}
                  <button className="w-full py-3 bg-[#2c3e50] text-white rounded-xl text-sm font-bold shadow-lg hover:bg-[#34495e] transition-all transform active:scale-[0.98]">
                    {activeTab === 'inventory' ? 'Register Asset' : 
                     activeTab === 'requests' ? 'Log Request' : 
                     activeTab === 'waste' ? 'Schedule Collection' : 
                     'Register Licence'}
                  </button>
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
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
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
                      <PropertyRow 
                        name="Main Office HVAC" 
                        sub="Floor 1, West Wing" 
                        type="HVAC" 
                        doc="hvac_manual.pdf"
                        person="Robert Chen"
                        contact="+1 234-567-890"
                        status="Operational" 
                      />
                    )}
                    {activeTab === 'requests' && (
                      <RequestRow 
                        date="2026-04-29" 
                        issue="Leak in Bathroom" 
                        asset="Floor 2 Restroom"
                        tech="Mike Plumb"
                        prio="Urgent" 
                        status="In Progress" 
                      />
                    )}
                    {activeTab === 'waste' && (
                      <WasteRow 
                        date="2026-05-01" 
                        contact="John Doe" 
                        phone="+1 234-567-888"
                        addr="Building A, Service Entrance" 
                        status="Scheduled" 
                      />
                    )}
                    {activeTab === 'licence' && (
                      <LicenceRow 
                        type="Trade Licence 2026" 
                        biz="Property Management Div" 
                        auth="City Planning Dept" 
                        expiry="2027-05-20" 
                        issue="2026-05-20" 
                        status="Active" 
                      />
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

function PropertyRow({ name, sub, type, doc, person, contact, status }: any) {
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
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function RequestRow({ date, issue, asset, tech, prio, status }: any) {
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
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function WasteRow({ date, contact, phone, addr, status }: any) {
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
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function LicenceRow({ type, biz, auth, expiry, issue, status }: any) {
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
