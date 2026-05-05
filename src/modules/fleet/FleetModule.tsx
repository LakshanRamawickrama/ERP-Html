'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Truck, 
  Package, 
  Calendar, 
  MapPin, 
  Phone, 
  FileText, 
  AlertTriangle,
  PlusCircle, 
  Edit, 
  Maximize2,
  Minimize2,
  FileSearch
} from 'lucide-react';

type TabType = 'vehicles' | 'deliveries' | 'parcels';

export default function FleetModule() {
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');
  const [isWide, setIsWide] = useState(false);

  // Mock data for reminders
  const reminders = [
    { id: 1, vehicle: 'CAR 1', type: 'Insurance', status: 'Expiring in 7 days', level: 'soon' },
    { id: 2, vehicle: 'CAR 1', type: 'MOT', status: 'Expired', level: 'expired' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h4 className="text-lg font-bold text-slate-800">Logistics / Fleet Management</h4>
        <p className="text-xs text-slate-500">Unified Module for Vehicles, Deliveries, and Parcels</p>
      </div>

      {/* Tabs & Reminders */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex gap-6">
          <TabButton active={activeTab === 'vehicles'} label="Vehicle Fleet" onClick={() => setActiveTab('vehicles')} />
          <TabButton active={activeTab === 'deliveries'} label="Delivery Tracking" onClick={() => setActiveTab('deliveries')} />
          <TabButton active={activeTab === 'parcels'} label="Parcel Services" onClick={() => setActiveTab('parcels')} />
        </div>

        {/* Smart Reminders */}
        <div className="hidden lg:flex gap-2 py-2 ml-6">
          {reminders.map(r => (
            <div key={r.id} className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold ${
              r.level === 'expired' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-amber-50 border-amber-100 text-amber-700'
            }`}>
              <AlertTriangle className="w-3 h-3" />
              <span>{r.vehicle} - {r.type}: <span className="font-normal opacity-80">{r.status}</span></span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && (
            <div className="lg:col-span-4">
              <Card 
                title={activeTab === 'vehicles' ? "Register Vehicle" : activeTab === 'deliveries' ? "New Delivery" : "Manage Partner"} 
                icon={PlusCircle} 
                iconColor="bg-[#2c3e50]"
              >
                <form className="space-y-4">
                  {activeTab === 'vehicles' && (
                    <>
                      <Field label="Vehicle Name" placeholder="e.g. CAR 1" />
                      <Field label="Plate Number" placeholder="ABC-1234" />
                      <Field label="Assigned Business" isSelect options={['Main Retail Store', 'Logistics Hub', 'Whiterock Retail Ltd']} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Insurance Exp." type="date" />
                        <Field label="Insurance Doc" type="file" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="MOT Date" type="date" />
                        <Field label="MOT Doc" type="file" />
                      </div>
                      <Field label="Notes" isTextArea />
                    </>
                  )}
                  {activeTab === 'deliveries' && (
                    <>
                      <Field label="Select Vehicle" isSelect options={['CAR 1', 'CAR 2']} />
                      <Field label="Pickup Date" type="date" />
                      <Field label="Delivery Date" type="date" />
                      <Field label="Delivery Address" placeholder="123 Street, City" />
                      <Field label="Contact Person" />
                      <Field label="Status" isSelect options={['Pending', 'In Transit', 'Delivered']} />
                    </>
                  )}
                  {activeTab === 'parcels' && (
                    <>
                      <Field label="Service Provider" placeholder="DHL, FedEx..." />
                      <Field label="Service Area" />
                      <Field label="Agreement Status" isSelect options={['Active', 'Pending', 'Expired']} />
                    </>
                  )}
                  <button className="w-full py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-all">
                    Save Record
                  </button>
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-1' : 'lg:col-span-8'}>
            <Card 
              title={activeTab === 'vehicles' ? "Fleet Inventory" : activeTab === 'deliveries' ? "Tracking History" : "Service Partners"} 
              icon={Truck}
              headerAction={
                <button onClick={() => setIsWide(!isWide)} className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-md hover:bg-slate-100 tracking-wide">
                  {isWide ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  {isWide ? 'Standard' : 'Wide'} View
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    {activeTab === 'vehicles' ? (
                      <tr>
                        <th className={thClass}>Vehicle</th>
                        <th className={thClass}>Plate</th>
                        <th className={thClass}>Business</th>
                        <th className={thClass}>MOT/Ins</th>
                        <th className={thClass}>Docs</th>
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className={thClass}>Date</th>
                        <th className={thClass}>Vehicle</th>
                        <th className={thClass}>Address / Contact</th>
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'vehicles' && (
                      <VehicleRow name="CAR 1" plate="ABC-1234" biz="Main Retail Store" mot="2026-04-10" ins="2026-05-12" />
                    )}
                    {activeTab === 'deliveries' && (
                      <DeliveryRow date="2026-04-29" v="CAR 1" addr="Warehouse, London" contact="John Doe" status="Scheduled" />
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

function VehicleRow({ name, plate, biz, mot, ins }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 font-bold text-slate-800">{name}</td>
      <td className="px-4 py-3 text-slate-500 font-mono tracking-tighter">{plate}</td>
      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 border text-slate-600 text-[10px] font-bold rounded">{biz}</span></td>
      <td className="px-4 py-3 text-[11px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-red-500 font-bold">MOT: {mot}</span>
          <span className="text-amber-600 font-bold">Ins: {ins}</span>
        </div>
      </td>
      <td className="px-4 py-3 flex gap-2">
        <FilePdf className="w-4 h-4 text-red-500 cursor-pointer" />
        <FilePdf className="w-4 h-4 text-red-500 cursor-pointer" />
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span>
      </td>
      <td className="px-4 py-3">
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function DeliveryRow({ date, v, addr, contact, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 text-slate-500">{date}</td>
      <td className="px-4 py-3 font-bold text-slate-800">{v}</td>
      <td className="px-4 py-3">
        <div className="text-[11px] leading-tight">
          <div className="font-bold flex items-center gap-1"><MapPin className="w-3 h-3" /> {addr}</div>
          <div className="text-slate-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {contact}</div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3">
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <FileSearch className="w-3.5 h-3.5" />
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
        <input type={type} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" placeholder={placeholder} />
      )}
    </div>
  );
}

const FilePdf = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h3a1.5 1.5 0 0 0 0-3H9v4"/><path d="M9 12v3"/></svg>
);
