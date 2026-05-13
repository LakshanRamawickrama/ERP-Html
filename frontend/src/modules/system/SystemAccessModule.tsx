'use client';

import React, { useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { 
  Lock,
  Plus,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Phone,
  Settings,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowRight,
  Edit2,
  Trash2
} from 'lucide-react';
import { BusinessField } from '@/components/ui/BusinessField';

export default function SystemAccessModule() {
  const [isWide, setIsWide] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [data, setData] = useState<any>({ credentials: [], alerts: [] });
  const [isVaultAuthed, setIsVaultAuthed] = useState(false);
  const [vaultAuthInput, setVaultAuthInput] = useState('');
  const [vaultError, setVaultError] = useState<string | null>(null);
  const [pendingRevealId, setPendingRevealId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    biz: '',
    service: '',
    account: '',
    password: '',
    status: '',
    support: '',
    notes: ''
  });
  const [isCustomService, setIsCustomService] = useState(false);
  const [customServiceName, setCustomServiceName] = useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_ENDPOINTS.SYSTEM, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) throw new Error('Fetch failed');
        return res.json();
      })
      .then(setData);
  }, []);

  const handleRevealClick = (id: string) => {
    if (showPassword[id]) {
      setShowPassword(prev => ({ ...prev, [id]: false }));
      return;
    }
    
    if (isVaultAuthed) {
      setShowPassword(prev => ({ ...prev, [id]: true }));
    } else {
      setPendingRevealId(id);
    }
  };

  const handleVaultAuth = () => {
    const loginPw = localStorage.getItem('user_pw');
    if (!loginPw) {
      setVaultError('Your security session is not synced. Please log out and log in again to activate your login password for the vault.');
      return;
    }
    if (vaultAuthInput === loginPw) {
      setIsVaultAuthed(true);
      if (pendingRevealId) {
        setShowPassword(prev => ({ ...prev, [pendingRevealId]: true }));
      }
      setPendingRevealId(null);
      setVaultAuthInput('');
    } else {
      setVaultError('The password you entered is incorrect. Please ensure you are using your current login password.');
    }
  };

  const handleEdit = (id: string) => {
    const item = data.credentials.find((c: any) => c.id === id);
    if (item) {
      setEditingId(id);
      setFormData({
        biz: item.biz || '',
        service: item.service,
        account: item.account,
        password: item.password,
        status: item.status,
        support: item.support,
        notes: item.notes || ''
      });
      const services = data.options?.services || [];
      if (item.service && !services.includes(item.service)) {
        setIsCustomService(true);
        setCustomServiceName(item.service);
      } else {
        setIsCustomService(false);
        setCustomServiceName('');
      }
      // Scroll to form on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_ENDPOINTS.CREDENTIALS}${itemToDelete}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setData((prev: any) => ({
            ...prev,
            credentials: prev.credentials.filter((c: any) => c.id !== itemToDelete)
          }));
        }
      } catch (err) {
        console.error("Delete err", err);
      }
      setItemToDelete(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const url = editingId 
        ? `${API_ENDPOINTS.CREDENTIALS}${editingId}/` 
        : API_ENDPOINTS.CREDENTIALS;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          service: isCustomService ? customServiceName : formData.service
        })
      });
      
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const savedItem = await res.json();
          setData((prev: any) => {
            if (editingId) {
              return {
                ...prev,
                credentials: prev.credentials.map((c: any) => c.id === editingId ? savedItem : c)
              };
            } else {
              return {
                ...prev,
                credentials: [savedItem, ...prev.credentials]
              };
            }
          });
        }
        setEditingId(null);
        setFormData({ biz: '', service: '', account: '', password: '', status: '', support: '', notes: '' });
        setIsCustomService(false);
        setCustomServiceName('');
      }
    } catch (err) {
      console.error("Submit err", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Tab Navigation / Alert Bar */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
        <div className="flex gap-6">
          <button className="py-4 text-xs font-bold border-b-2 border-slate-800 text-slate-800 transition-all flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            Credentials Repository
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsWide(!isWide)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider shadow-sm"
          >
            {isWide ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {isWide ? 'Standard' : 'Wide'} View
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && (
            <div className="lg:col-span-4">
              <Card title={editingId ? "Update Credential" : "Add New Credential"} icon={editingId ? Edit2 : Plus} iconColor={editingId ? "bg-indigo-600" : "bg-slate-800"}>
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  <BusinessField 
                    value={formData.biz || ''} 
                    onChange={(v) => setFormData({ ...formData, biz: v })} 
                    businesses={data.options?.businesses || []}
                  />
                  <Field 
                    label="Service Name *" 
                    isSelect 
                    options={[...(data.options?.services || []), "Add Custom Service..."]} 
                    value={isCustomService ? "Add Custom Service..." : formData.service}
                    onChange={(val: string) => {
                      if (val === "Add Custom Service...") {
                        setIsCustomService(true);
                        setFormData({ ...formData, service: '' });
                      } else {
                        setIsCustomService(false);
                        setFormData({ ...formData, service: val });
                      }
                    }}
                  />
                  {isCustomService && (
                    <Field 
                      label="Enter Custom Service Name *" 
                      placeholder="e.g. Netflix, Azure, etc." 
                      value={customServiceName}
                      onChange={(val: string) => setCustomServiceName(val)}
                    />
                  )}
                  <Field 
                    label="Account / Username *" 
                    placeholder="Login ID or Username" 
                    value={formData.account}
                    onChange={(val: string) => setFormData({ ...formData, account: val })}
                  />
                  <Field 
                    label="Password / PIN" 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={(val: string) => setFormData({ ...formData, password: val })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field 
                      label="Status" 
                      isSelect 
                      options={data.options?.statuses || []} 
                      value={formData.status}
                      onChange={(val: string) => setFormData({ ...formData, status: val })}
                    />
                    <Field 
                      label="Support Tel No" 
                      type="tel" 
                      placeholder="+94 11 ..." 
                      value={formData.support}
                      onChange={(val: string) => setFormData({ ...formData, support: val })}
                    />
                  </div>
                  <Field 
                    label="Notes" 
                    isTextArea 
                    placeholder="URL, Renewal dates, etc." 
                    value={formData.notes}
                    onChange={(val: string) => setFormData({ ...formData, notes: val })}
                  />
                  
                  <div className="flex gap-2">
                    {editingId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ biz: '', service: '', account: '', password: '', status: '', support: '', notes: '' });
                        }}
                        className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit"
                      className={`flex-[2] py-3 ${editingId ? 'bg-indigo-600' : 'bg-slate-800'} text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all transform active:scale-[0.98]`}
                    >
                      {editingId ? 'Update Access Details' : 'Save Access Details'}
                    </button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card title="Credential Inventory" icon={Lock}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className={thClass}>Service</th>
                      <th className={thClass}>Account / ID</th>
                      <th className={thClass}>Status</th>
                      <th className={thClass}>Support No</th>
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.credentials?.map((cred: any) => (
                      <CredentialRow 
                        key={cred.id}
                        {...cred}
                        show={showPassword[cred.id]}
                        onToggle={() => handleRevealClick(cred.id)}
                        onEdit={() => handleEdit(cred.id)}
                        onDelete={() => handleDeleteClick(cred.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      {pendingRevealId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setPendingRevealId(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-indigo-100">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-indigo-50/50">
                <Lock className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Vault Authentication</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Enter your login password to reveal the secure credentials for this service.
                </p>
              </div>
              
              <div className="space-y-3">
                <input 
                  type="password"
                  placeholder="Your login password..."
                  value={vaultAuthInput}
                  onChange={(e) => setVaultAuthInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleVaultAuth();
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-center font-bold tracking-widest"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setPendingRevealId(null)}
                    className="flex-1 py-3 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleVaultAuth}
                    className="flex-1 py-3 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                  >
                    Authorize
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldAlert size={10} /> Enterprise Security Protocol
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Error Modal */}
      {vaultError && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setVaultError(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-red-100">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Access Denied</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  {vaultError}
                </p>
              </div>
              <button 
                onClick={() => setVaultError(null)}
                className="w-full py-3 bg-red-600 text-white text-[11px] font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Credential"
        message="Are you sure you want to permanently remove these credentials from the repository? This action cannot be undone."
      />
    </div>
  );
}

const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider";


function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, value, onChange }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium"
        >
          <option value="">Select Option...</option>
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea 
          rows={3} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" 
          placeholder={placeholder} 
        />
      ) : (
        <input 
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}

function CredentialRow({ service, account, status, support, password, id, show, onToggle, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{service}</div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium font-mono mt-1">
          {show ? password : '••••••••••••••••'}
          <button onClick={onToggle} className="text-slate-300 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </button>
        </div>
      </td>
      <td className="px-4 py-4 font-medium text-slate-600">{account}</td>
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider">{status}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Phone className="w-3 h-3" />
          {support}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <button 
            title="Edit Credential"
            onClick={onEdit}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button 
            title="Delete Credential"
            onClick={onDelete}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 transition-all shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
