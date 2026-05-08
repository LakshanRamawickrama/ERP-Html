'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import {
  Users,
  UserPlus,
  Maximize2,
  Minimize2,
  Lock,
  ChevronDown,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  Eye,
  X,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';

const ALL_MODULES = [
  'Business Management',
  'Fleet Management',
  'Inventory Management',
  'Accounting',
  'Legal & Compliance',
  'Property Management',
  'Reports',
  'Suppliers',
  'Reminders',
];

const ACTIONS = ['view', 'add', 'edit', 'delete'];

const DASHBOARD_CARDS = [
  'Fleet Management',
  'VAT / Tax',
  'System Reminders',
  'Profit & Loss',
  'Supplier Payments',
  'Sales Report',
  'Bank Accounts',
  'Maintenance',
  'Low Stock',
  'Upcoming Renewals',
  'Notes',
];

export default function UserModule() {
  const [activeTab, setActiveTab] = useState<'registry' | 'roles'>('registry');
  const [isWide, setIsWide] = useState(false);

  const [data, setData] = useState<any>({ systemMap: [], registry: [], roles: [], businesses: [] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({ name: '', email: '', role: 'admin', assigned_business: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Role Permissions tab state
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [permissionsMap, setPermissionsMap] = useState<Record<string, string[]>>({});
  const [permSaving, setPermSaving] = useState(false);
  const [savedNotif, setSavedNotif] = useState(false);
  const [viewingUser, setViewingUser] = useState<any>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    fetch(API_ENDPOINTS.USERS, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  // When selected user changes, load their permissions
  useEffect(() => {
    if (!selectedUserId) {
      setPermissionsMap({});
      return;
    }
    const user = data.registry?.find((u: any) => String(u.id) === String(selectedUserId));
    if (user) {
      try {
        const parsed = typeof user.permissions === 'string' ? JSON.parse(user.permissions) : (user.permissions || {});
        setPermissionsMap(parsed);
      } catch {
        setPermissionsMap({});
      }
    }
  }, [selectedUserId, data.registry]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (id: string, rowData: any) => {
    setEditingId(id);
    setFormData({ ...rowData, password: '', confirmPassword: '' });
    setActiveTab('registry');
    setFormError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'admin', assigned_business: '', password: '', confirmPassword: '' });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!editingId) {
      if (!formData.password) { setFormError('Password is required'); return; }
      if (formData.password !== formData.confirmPassword) { setFormError('Passwords do not match'); return; }
    }

    const payload: any = {
      name: formData.name,
      email: formData.email,
      role: 'admin',
      assigned_business: formData.assigned_business,
    };
    if (!editingId) payload.password = formData.password;

    try {
      const url = editingId
        ? `${API_ENDPOINTS.USERS}staff/${editingId}/`
        : `${API_ENDPOINTS.USERS}staff/`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        setFormError(result.error || 'Failed to save user');
        return;
      }

      if (editingId) {
        setData((prev: any) => ({
          ...prev,
          registry: prev.registry.map((u: any) => String(u.id) === String(editingId) ? result : u),
        }));
        handleCancelEdit();
      } else {
        setData((prev: any) => ({
          ...prev,
          registry: [...prev.registry, result],
          businesses: prev.businesses.filter((b: string) => b !== result.assigned_business),
        }));
        // Switch to Role Permissions with new user pre-selected
        setSelectedUserId(String(result.id));
        setActiveTab('roles');
        handleCancelEdit();
      }
    } catch {
      setFormError('Network error. Please try again.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setData((prev: any) => ({
        ...prev,
        registry: prev.registry.filter((u: any) => String(u.id) !== String(deleteId)),
      }));
      if (String(selectedUserId) === String(deleteId)) setSelectedUserId('');
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const togglePermission = (mod: string, action: string) => {
    setPermissionsMap(prev => {
      const current = prev[mod] || [];
      const next = current.includes(action)
        ? current.filter(a => a !== action)
        : [...current, action];
      if (next.length === 0) {
        const { [mod]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [mod]: next };
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedUserId) return;
    setPermSaving(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.USERS}staff/${selectedUserId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions: permissionsMap }),
      });
      const result = await res.json();
      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          registry: prev.registry.map((u: any) => String(u.id) === String(selectedUserId) ? result : u),
        }));
        setSavedNotif(true);
        setTimeout(() => setSavedNotif(false), 3000);
      }
    } finally {
      setPermSaving(false);
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

          {/* Form Column - Registry Tab */}
          {!isWide && activeTab === 'registry' && (
            <div className="lg:col-span-4">
              <Card title={editingId ? "Edit User Account" : "Register New User"} icon={UserPlus} iconColor="bg-slate-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg">{formError}</div>
                  )}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => handleFormChange('name', e.target.value)}
                      className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={e => handleFormChange('email', e.target.value)}
                      className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Assigned Role</label>
                    <div className="mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-500">
                      Admin
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Assigned Business</label>
                    <div className="relative mt-1.5">
                      <select
                        value={formData.assigned_business}
                        onChange={e => handleFormChange('assigned_business', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium appearance-none"
                      >
                        <option value="">Select Business...</option>
                        {[
                          ...(data.businesses || []),
                          ...(formData.assigned_business && !(data.businesses || []).includes(formData.assigned_business)
                            ? [formData.assigned_business]
                            : [])
                        ].map((b: string) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {!editingId && (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Password</label>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={e => handleFormChange('password', e.target.value)}
                          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Confirm Password</label>
                        <input
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={e => handleFormChange('confirmPassword', e.target.value)}
                          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium"
                        />
                      </div>
                    </>
                  )}

                  <button type="submit" className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all">
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

          {/* Form Column - Role Permissions Tab */}
          {!isWide && activeTab === 'roles' && (
            <div className="lg:col-span-4">
              <Card title="Configure Permissions" icon={Lock} iconColor="bg-slate-800">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select User</label>
                    <div className="relative mt-1.5">
                      <select
                        value={selectedUserId}
                        onChange={e => setSelectedUserId(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium appearance-none"
                      >
                        <option value="">Select a user...</option>
                        {data.registry?.map((u: any) => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {selectedUserId && (
                    <>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Module Permissions</p>
                        <div className="space-y-1">
                          <div className="grid grid-cols-5 gap-1 pb-1 border-b border-slate-200">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Module</span>
                            {ACTIONS.map(a => (
                              <span key={a} className="text-[9px] font-bold text-slate-400 uppercase text-center capitalize">{a}</span>
                            ))}
                          </div>
                          {ALL_MODULES.map(mod => (
                            <div key={mod} className="grid grid-cols-5 gap-1 items-center py-1.5 border-b border-slate-100 last:border-0">
                              <span className="text-[10px] font-medium text-slate-600 truncate pr-1" title={mod}>
                                {mod.split(' ')[0]}
                              </span>
                              {ACTIONS.map(action => (
                                <div key={action} className="flex justify-center">
                                  <input
                                    type="checkbox"
                                    className="w-3.5 h-3.5 rounded border-slate-300 cursor-pointer accent-slate-800"
                                    checked={(permissionsMap[mod] || []).includes(action)}
                                    onChange={() => togglePermission(mod, action)}
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Dashboard Widgets</p>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                          {DASHBOARD_CARDS.map(card => (
                            <label key={card} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                className="w-3.5 h-3.5 rounded border-slate-300 cursor-pointer accent-slate-800"
                                checked={(permissionsMap['Dashboard'] || []).includes(card)}
                                onChange={() => togglePermission('Dashboard', card)}
                              />
                              <span className="text-[10px] font-medium text-slate-600 group-hover:text-slate-800 transition-colors truncate" title={card}>{card}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSavePermissions}
                        disabled={permSaving}
                        className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {permSaving ? 'Saving...' : 'Save Permissions'}
                      </button>
                    </>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card title={activeTab === 'registry' ? "Platform Users" : "Access Control Matrix"} icon={activeTab === 'registry' ? Users : Lock}>
              <div>
                <table className="w-full text-left text-sm">
                  {activeTab === 'registry' ? (
                    <>
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className={thClass}>Name / Email</th>
                          <th className={thClass}>Role</th>
                          <th className={thClass}>Scope</th>
                          <th className={thClass}>Module Access</th>
                          <th className={thClass}>Status</th>
                          <th className={thClass}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.registry?.map((u: any, i: number) => (
                          <UserRow
                            key={i}
                            name={u.name}
                            email={u.email}
                            roles={u.role}
                            scope={u.assigned_business}
                            access={u.access}
                            status={u.status}
                            onEdit={() => handleEdit(u.id, u)}
                            onDelete={() => handleDeleteClick(u.id)}
                            onView={() => setViewingUser(u)}
                          />
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
                        {ALL_MODULES.map(mod => (
                          <tr key={mod} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-slate-700">{mod}</td>
                            {ACTIONS.map(action => (
                              <td key={action} className="px-4 py-3 text-center">
                                <span className={`w-3.5 h-3.5 inline-block rounded-sm ${
                                  selectedUserId && (permissionsMap[mod] || []).includes(action)
                                    ? 'bg-emerald-500'
                                    : 'bg-slate-200'
                                }`} />
                              </td>
                            ))}
                          </tr>
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

      {/* User Detail Drawer */}
      {viewingUser && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setViewingUser(null)} />
          <UserDetailDrawer user={viewingUser} onClose={() => setViewingUser(null)} />
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      {/* Save notification toast */}
      <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-xl transition-all duration-300 ${
        savedNotif ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
      }`}>
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span className="text-sm font-semibold">Permissions saved successfully</span>
      </div>
    </div>
  );
}

const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider";

function AccessBadge({ access }: { access: string }) {
  if (!access || access.trim() === '') {
    return <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-400 text-[10px] font-bold rounded-full uppercase">No Access</span>;
  }
  if (access === 'All') {
    return <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold rounded-full uppercase">All Modules</span>;
  }
  const count = access.split(',').filter(Boolean).length;
  return (
    <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-bold rounded-full">
      {count} Module{count !== 1 ? 's' : ''}
    </span>
  );
}

function UserRow({ name, email, roles, scope, access, status, onEdit, onDelete, onView }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{name}</div>
        <div className="text-[10px] text-slate-400 font-mono tracking-tighter leading-none mt-1">{email}</div>
      </td>
      <td className="px-4 py-4 font-bold text-slate-400 text-[10px] uppercase">{roles}</td>
      <td className="px-4 py-4 text-slate-500 text-xs italic">{scope || '—'}</td>
      <td className="px-4 py-4">
        <AccessBadge access={access} />
      </td>
      <td className="px-4 py-4">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${
          status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
        }`}>{status}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-1.5">
          <button onClick={onView} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-800 hover:border-slate-800 hover:text-white text-slate-400 transition-all" title="View details">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all" title="Edit">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function UserDetailDrawer({ user, onClose }: { user: any; onClose: () => void }) {
  const initials = (user.name || '?').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  let perms: Record<string, string[]> = {};
  try {
    perms = typeof user.permissions === 'string' ? JSON.parse(user.permissions) : (user.permissions || {});
  } catch { /* empty */ }

  const modules = user.access === 'All'
    ? ALL_MODULES
    : (user.access || '').split(',').map((s: string) => s.trim()).filter(Boolean);

  return (
    <div className="relative z-50 w-[380px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-800 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-black">
            {initials}
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">{user.name}</div>
            <div className="text-[11px] text-white/60 leading-tight">{user.email}</div>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Info chips */}
      <div className="px-5 py-4 flex flex-wrap gap-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-600 uppercase">{user.role}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg">
          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-600">{user.assigned_business || 'Unassigned'}</span>
        </div>
        <span className={`px-3 py-1.5 text-[11px] font-bold rounded-lg uppercase ${
          user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
        }`}>{user.status}</span>
      </div>

      {/* Permissions */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Module Permissions</p>
        {modules.length === 0 ? (
          <div className="py-10 text-center">
            <Lock className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-[11px] text-slate-400">No modules assigned yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {modules.map((mod: string) => {
              const actions = perms[mod] || [];
              return (
                <div key={mod} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">{mod}</span>
                    {actions.length === 0 && (
                      <span className="text-[10px] text-slate-400 italic">view only</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ACTIONS.map(action => {
                      const granted = actions.includes(action) || (action === 'view' && modules.includes(mod));
                      return (
                        <span key={action} className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${
                          granted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-300'
                        }`}>
                          {action}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
