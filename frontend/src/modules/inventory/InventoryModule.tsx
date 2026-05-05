'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Boxes, 
  Package, 
  ArrowLeftRight, 
  PlusCircle, 
  Edit, 
  Maximize2,
  Minimize2,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';

type TabType = 'stock' | 'move';

export default function InventoryModule() {
  const [activeTab, setActiveTab] = useState<TabType>('stock');
  const [isWide, setIsWide] = useState(false);

  const [data, setData] = useState<any>({ alerts: [], stock: [], moves: [] });

  React.useEffect(() => {
    fetch('/api/inventory').then(res => res.json()).then(setData);
  }, []);

  const alerts = data.alerts || [];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h4 className="text-lg font-bold text-slate-800">Inventory Management</h4>
        <p className="text-xs text-slate-500">Track Stock Levels, Incoming Goods, and Dispatches</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex gap-6">
          <TabButton active={activeTab === 'stock'} label="Master Inventory" onClick={() => setActiveTab('stock')} />
          <TabButton active={activeTab === 'move'} label="Stock Movements (In/Out)" onClick={() => setActiveTab('move')} />
        </div>

        {/* Alert Pills */}
        <div className="hidden lg:flex gap-2 py-2 ml-6">
          {alerts.map(a => (
            <div key={a.id} className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold ${
              a.level === 'out' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-amber-50 border-amber-100 text-amber-700'
            }`}>
              {a.level === 'out' ? <Boxes className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              <span>{a.name}: <span className="font-normal opacity-80">{a.status}</span></span>
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
                title={activeTab === 'stock' ? "Add New Item" : "Log Movement"} 
                icon={PlusCircle} 
                iconColor="bg-[#2c3e50]"
              >
                <form className="space-y-4">
                  {activeTab === 'stock' && (
                    <>
                      <Field label="Item Name *" placeholder="e.g. Milk Packet 1L" />
                      <Field label="Category *" isSelect options={['Food & Beverages', 'Groceries', 'Electronics', 'Stationery', '+ Add New Category...']} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Stock Level" type="number" />
                        <Field label="Reorder Level" type="number" />
                      </div>
                      <Field label="Supplier Ref" placeholder="SUP-0456" />
                      <Field label="Status (Auto)" disabled value="Active" />
                      <Field label="Notes" isTextArea />
                    </>
                  )}
                  {activeTab === 'move' && (
                    <>
                      <Field label="Select Item *" isSelect options={['Milk Packet 1L', 'Sugar 1kg']} />
                      <div className="flex gap-4 p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                          <input type="radio" name="mType" defaultChecked /> Stock In (+)
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                          <input type="radio" name="mType" /> Stock Out (-)
                        </label>
                      </div>
                      <Field label="Quantity *" type="number" />
                      <Field label="Reference / Reason" placeholder="Invoice # or Sale Ref" />
                      <Field label="Notes" isTextArea />
                    </>
                  )}
                  <button className="w-full py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-all">
                    Register Record
                  </button>
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-1' : 'lg:col-span-8'}>
            <Card 
              title={activeTab === 'stock' ? "Master Inventory List" : "Transaction History"} 
              icon={activeTab === 'stock' ? ClipboardList : ArrowLeftRight}
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
                    {activeTab === 'stock' ? (
                      <tr>
                        <th className={thClass}>Item Name</th>
                        <th className={thClass}>Category</th>
                        <th className={thClass}>Stock</th>
                        {isWide && <th className={thClass}>Supplier Ref</th>}
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Action</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className={thClass}>Date</th>
                        <th className={thClass}>Item</th>
                        <th className={thClass}>Type</th>
                        <th className={thClass}>Qty</th>
                        <th className={thClass}>Notes</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'stock' ? (
                      data.stock?.map((item: any, i: number) => (
                        <StockRow key={i} {...item} isWide={isWide} />
                      )) || null
                    ) : (
                      data.moves?.map((move: any, i: number) => (
                        <MoveRow key={i} {...move} />
                      )) || null
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

function StockRow({ name, cat, stock, status, isWide }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 font-bold text-slate-800">{name}</td>
      <td className="px-4 py-3 text-slate-500">{cat}</td>
      <td className="px-4 py-3 font-bold">{stock}</td>
      {isWide && <td className="px-4 py-3 text-slate-500 italic">SUP-001</td>}
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3 text-slate-500">
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function MoveRow({ date, item, type, qty, notes }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 text-slate-500 font-mono tracking-tight">{date}</td>
      <td className="px-4 py-3 font-bold text-slate-800">{item}</td>
      <td className="px-4 py-3">
        {type === 'IN' ? (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Stock In (+)</span>
        ) : (
          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase">Stock Out (-)</span>
        )}
      </td>
      <td className="px-4 py-3 font-bold">{qty}</td>
      <td className="px-4 py-3 text-slate-500 text-xs italic">{notes}</td>
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
