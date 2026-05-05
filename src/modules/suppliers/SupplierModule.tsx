'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Truck, 
  ShoppingCart, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Maximize2,
  Minimize2,
  Printer,
  FileText
} from 'lucide-react';

type TabType = 'suppliers' | 'orders';

export default function SupplierModule() {
  const [activeTab, setActiveTab] = useState<TabType>('suppliers');
  const [isWide, setIsWide] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h4 className="text-lg font-bold text-slate-800">Supplier Management</h4>
        <p className="text-xs text-slate-500">Unified Module for Vendor Relations and Procurement</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        <TabButton active={activeTab === 'suppliers'} label="Supplier Directory" onClick={() => setActiveTab('suppliers')} />
        <TabButton active={activeTab === 'orders'} label="Purchase Orders" onClick={() => setActiveTab('orders')} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && (
            <div className="lg:col-span-4">
              <Card 
                title={activeTab === 'suppliers' ? "Add New Supplier" : "New Purchase Order"} 
                icon={PlusCircle} 
                iconColor="bg-[#2c3e50]"
              >
                <form className="space-y-4">
                  {activeTab === 'suppliers' && (
                    <>
                      <Field label="Supplier ID" disabled value="SUP-104" />
                      <Field label="Supplier Name" placeholder="e.g. Acme Supplies" />
                      <Field label="Category" isSelect options={['Raw Materials', 'Services', 'Office Supplies', 'IT Hardware', 'Other']} />
                      <Field label="Email Address" type="email" />
                      <Field label="Phone Number" type="tel" />
                      <Field label="Status" isSelect options={['Active', 'Inactive', 'On Hold']} />
                      <Field label="Notes" isTextArea />
                    </>
                  )}
                  {activeTab === 'orders' && (
                    <>
                      <Field label="Select Supplier" isSelect options={['Global Logistics', 'Prime Office', 'TechConnect']} />
                      <Field label="PO Number" placeholder="PO-1001" />
                      <Field label="Order Amount ($)" type="number" />
                      <Field label="Delivery Due" type="date" />
                      <Field label="Status" isSelect options={['Paid', 'Pending', 'Overdue']} />
                    </>
                  )}
                  <button className="w-full py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-all">
                    {activeTab === 'suppliers' ? 'Register Supplier' : 'Create PO'}
                  </button>
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-1' : 'lg:col-span-8'}>
            <Card 
              title={activeTab === 'suppliers' ? "Vendor Partners" : "Procurement History"} 
              icon={activeTab === 'suppliers' ? Truck : ShoppingCart}
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
                    {activeTab === 'suppliers' ? (
                      <tr>
                        <th className={thClass}>Supplier Name</th>
                        <th className={thClass}>Category</th>
                        <th className={thClass}>Email/Phone</th>
                        {isWide && <th className={thClass}>Address</th>}
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className={thClass}>PO #</th>
                        <th className={thClass}>Supplier</th>
                        <th className={thClass}>Amount</th>
                        <th className={thClass}>Due Date</th>
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'suppliers' ? (
                      <SupplierRow isWide={isWide} name="Global Logistics Partners" id="SUP-101" cat="Services" email="contact@global.com" phone="+44 20 7123" />
                    ) : (
                      <OrderRow id="PO-2026-501" supp="Prime Office Supplies" amount="$450.00" due="2026-05-10" status="Pending" />
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

function SupplierRow({ name, id, cat, email, phone, isWide }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <div className="text-[10px] text-slate-400 font-mono">{id}</div>
        <div className="font-bold text-slate-800">{name}</div>
      </td>
      <td className="px-4 py-3 text-slate-500">{cat}</td>
      <td className="px-4 py-3">
        <div className="text-[11px] font-medium text-slate-600">{email}</div>
        <div className="text-[10px] text-slate-400">{phone}</div>
      </td>
      {isWide && <td className="px-4 py-3 text-slate-500 italic max-w-[200px] truncate text-xs">123 Logistics Way, London</td>}
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 border border-red-100 rounded-lg hover:bg-red-50 text-red-600 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function OrderRow({ id, supp, amount, due, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 font-bold text-slate-800">{id}</td>
      <td className="px-4 py-3 text-slate-500 font-medium">{supp}</td>
      <td className="px-4 py-3 font-bold text-slate-900 tracking-tighter">{amount}</td>
      <td className="px-4 py-3 text-slate-500">{due}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
          status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
        }`}>{status}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Printer className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
          <Edit className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>
      </td>
    </tr>
  );
}

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, disabled, value }: any) {
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
        <input 
          type={type} 
          disabled={disabled}
          defaultValue={value}
          className={`w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 ${disabled ? 'bg-slate-100 cursor-not-allowed text-slate-400' : 'bg-slate-50'}`} 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}
