'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Edit, 
  Trash2, 
  Maximize2,
  Minimize2,
  Lock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

type TabType = 'registry' | 'roles';

export default function UserModule() {
  const [activeTab, setActiveTab] = useState<TabType>('registry');
  const [isWide, setIsWide] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h4 className="text-lg font-bold text-slate-800">User Management</h4>
        <p className="text-xs text-slate-500">Manage Platform Access, Roles, and User Permissions</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        <TabButton active={activeTab === 'registry'} label="User Registry" onClick={() => setActiveTab('registry')} />
        <TabButton active={activeTab === 'roles'} label="Role Permissions" onClick={() => setActiveTab('roles')} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && (
            <div className="lg:col-span-4">
              <Card title={activeTab === 'registry' ? "Register New User" : "Configure Role"} icon={activeTab === 'registry' ? UserPlus : ShieldAlert} iconColor="bg-[#2c3e50]">
                <form className="space-y-4">
                  {activeTab === 'registry' && (
                    <>
                      <Field label="Full Name" placeholder="John Doe" />
                      <Field label="Email Address" type="email" />
                      <Field label="Assigned Role" isSelect options={['Super Admin', 'Admin', 'Manager', 'Staff']} />
                      <Field label="Business Context" isSelect options={['All Entities', 'Main Retail Store', 'Logistics Hub']} />
                      <Field label="Password" type="password" />
                      <Field label="Confirm Password" type="password" />
                    </>
                  )}
                  {activeTab === 'roles' && (
                    <>
                      <Field label="Role Name" placeholder="e.g. Inventory Manager" />
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Module Access</p>
                        {['Dashboard', 'Accounting', 'Inventory', 'Fleet', 'Legal'].map(m => (
                          <label key={m} className="flex items-center gap-3 text-xs font-bold text-slate-600 cursor-pointer hover:text-[#2c3e50]">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#2c3e50]" />
                            {m}
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                  <button className="w-full py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-colors">
                    {activeTab === 'registry' ? 'Create Account' : 'Save Permissions'}
                  </button>
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-1' : 'lg:col-span-8'}>
            <Card title={activeTab === 'registry' ? "Platform Users" : "Access Control Matrix"} icon={activeTab === 'registry' ? Users : Lock}
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
                    {activeTab === 'registry' ? (
                      <tr>
                        <th className={thClass}>User</th>
                        <th className={thClass}>Role</th>
                        <th className={thClass}>Scope</th>
                        <th className={thClass}>Access</th>
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className={thClass}>Role Name</th>
                        <th className={thClass}>Assigned Modules</th>
                        <th className={thClass}>Business Context</th>
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'registry' ? (
                      <UserRow name="John Smith" email="john@example.com" role="Super Admin" scope="All Entities" access="All Modules" />
                    ) : (
                      <RoleRow name="Inventory Manager" modules="Inventory, Fleet" scope="Main Retail Store" />
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

function UserRow({ name, email, role, scope, access }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <div className="font-bold text-slate-800">{name}</div>
        <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{email}</div>
      </td>
      <td className="px-4 py-3 text-slate-500 font-bold text-[11px]">{role}</td>
      <td className="px-4 py-3 text-slate-400 text-xs italic">{scope}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-slate-100 border text-slate-600 text-[10px] font-bold rounded">{access}</span>
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-tighter">Active</span>
      </td>
      <td className="px-4 py-3">
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function RoleRow({ name, modules, scope }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 font-bold text-slate-800">{name}</td>
      <td className="px-4 py-3 text-slate-500 font-medium text-xs truncate max-w-[200px]">{modules}</td>
      <td className="px-4 py-3 text-slate-400 text-xs italic">{scope}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase">Custom</span>
      </td>
      <td className="px-4 py-3 text-slate-500">
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
