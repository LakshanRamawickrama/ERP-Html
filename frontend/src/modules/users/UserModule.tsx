'use client';

import React, { useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Maximize2,
  Minimize2,
  Lock,
  ChevronDown,
  Edit,
  Folder,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

export default function UserModule() {
  const [activeTab, setActiveTab] = useState<'registry' | 'roles'>('registry');
  const [isWide, setIsWide] = useState(false);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);

  const [data, setData] = useState<any>({ systemMap: [], registry: [], roles: [], businesses: [] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  React.useEffect(() => {
    fetch(API_ENDPOINTS.USERS).then(res => res.json()).then(setData);
  }, []);

  const systemMap = data.systemMap || [];

  const toggleCat = (name: string) => {
    setExpandedCats(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
  };

  const handleEdit = (id: string, rowData: any) => {
    setEditingId(id);
    setFormData(rowData);
    setActiveTab('registry');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      console.log('Deleting user:', deleteId);
      // TODO: API call
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab('registry')}
            className={`py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'registry' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            User Registry
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            className={`py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'roles' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Role Permissions
          </button>
        </div>
        <button 
          onClick={() => setIsWide(!isWide)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider shadow-sm"
        >
          {isWide ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          {isWide ? 'Standard' : 'Wide'} View
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && (activeTab === 'registry') && (
            <div className="lg:col-span-4">
              <Card title={editingId ? "Edit User Account" : "Register New User"} icon={UserPlus} iconColor="bg-slate-800">
                <form className="space-y-4">
                  <Field label="Full Name" placeholder="John Doe" value={formData.name} />
                  <Field label="Email Address" type="email" placeholder="john@example.com" value={formData.email} />
                  <Field label="Assigned Roles" isSelect options={data.roles || []} value={formData.roles} />
                  <Field label="Assigned Businesses" isSelect options={data.businesses || []} value={formData.scope} />
                  {!editingId && (
                    <>
                      <Field label="Password" type="password" />
                      <Field label="Confirm Password" type="password" />
                    </>
                  )}
                  <button className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all">
                    {editingId ? "Update User Account" : "Create User Account"}
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

          {!isWide && (activeTab === 'roles') && (
            <div className="lg:col-span-4">
              <Card title="Configure Role" icon={Lock} iconColor="bg-slate-800">
                <form className="space-y-4">
                  <Field label="Administrative Role Assignment" isSelect options={data.businesses || []} />
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase border-b pb-2 mb-3">Role Identity</p>
                    <p className="text-[11px] text-slate-500 italic leading-relaxed">Saving this role will create a new selectable permission set in the User Registry.</p>
                  </div>
                  <button className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all">
                    Save Role Settings
                  </button>
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card title={activeTab === 'registry' ? "Platform Users" : "Access Control Matrix"} icon={activeTab === 'registry' ? Users : Lock}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  {activeTab === 'registry' ? (
                    <>
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className={thClass}>Name / Email</th>
                          <th className={thClass}>Roles</th>
                          <th className={thClass}>Scope</th>
                          <th className={thClass}>Module Access</th>
                          <th className={thClass}>Status</th>
                          <th className={thClass}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.registry?.map((u: any, i: number) => (
                          <UserRow key={i} {...u} onEdit={() => handleEdit(`user-${i}`, u)} onDelete={() => handleDeleteClick(`user-${i}`)} />
                        )) || null}
                      </tbody>
                    </>
                  ) : (
                    <>
                      <thead className="bg-slate-50 border-b border-slate-100 border-t">
                        <tr className="text-center">
                          <th className={`${thClass} text-left`}>Module Name</th>
                          <th className={thClass}>View</th>
                          <th className={thClass}>Add</th>
                          <th className={thClass}>Edit</th>
                          <th className={thClass}>Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {systemMap.map((cat: any) => (
                          <React.Fragment key={cat.name}>
                            <tr 
                              className="category-row hover:bg-slate-50 cursor-pointer group"
                              onClick={() => toggleCat(cat.name)}
                            >
                              <td className="px-4 py-3 font-bold text-slate-800 text-xs flex items-center gap-2">
                                <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedCats.includes(cat.name) ? 'rotate-90' : ''}`} />
                                <Folder className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                                {cat.name}
                              </td>
                              <td className="px-4 py-3 text-center"><input type="checkbox" defaultChecked className="checkbox-standard" onClick={e => e.stopPropagation()} /></td>
                              <td className="px-4 py-3 text-center"><input type="checkbox" className="checkbox-standard" onClick={e => e.stopPropagation()} /></td>
                              <td className="px-4 py-3 text-center"><input type="checkbox" className="checkbox-standard" onClick={e => e.stopPropagation()} /></td>
                              <td className="px-4 py-3 text-center"><input type="checkbox" className="checkbox-standard" onClick={e => e.stopPropagation()} /></td>
                            </tr>
                            {expandedCats.includes(cat.name) && cat.sub.map((s: any) => (
                              <tr key={s} className="bg-slate-50/30">
                                <td className="px-4 py-2 pl-12 text-[11px] text-slate-500 font-medium italic flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                  {s}
                                </td>
                                <td className="px-4 py-2 text-center"><input type="checkbox" defaultChecked className="checkbox-standard scale-75" /></td>
                                <td className="px-4 py-2 text-center"><input type="checkbox" className="checkbox-standard scale-75" /></td>
                                <td className="px-4 py-2 text-center"><input type="checkbox" className="checkbox-standard scale-75" /></td>
                                <td className="px-4 py-2 text-center"><input type="checkbox" className="checkbox-standard scale-75" /></td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </>
                  )}
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      <style jsx>{`
        .checkbox-standard {
          width: 1rem;
          height: 1rem;
          border-radius: 0.25rem;
          border-color: #cbd5e1;
          color: #1e293b;
          cursor: pointer;
        }
        .checkbox-standard:focus {
          ring: 2px solid #1e293b;
        }
      `}</style>
    </div>
  );
}

const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider";

function Field({ label, placeholder, type = "text", isSelect, options = [], value }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <div className="relative mt-1.5">
          <select 
            defaultValue={value}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium appearance-none"
          >
            <option value="">Select Option...</option>
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      ) : (
        <input 
          type={type} 
          defaultValue={value}
          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}

function UserRow({ name, email, roles, scope, access, status, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{name}</div>
        <div className="text-[10px] text-slate-400 font-mono tracking-tighter leading-none mt-1">{email}</div>
      </td>
      <td className="px-4 py-4 font-bold text-slate-400 text-[10px] uppercase">{roles}</td>
      <td className="px-4 py-4 text-slate-500 text-xs italic">{scope}</td>
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase">{access}</span>
      </td>
      <td className="px-4 py-4">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${
          status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
        }`}>{status}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <button 
            onClick={onEdit}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onDelete}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
