'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import ProfileDrawer from '@/components/layouts/ProfileDrawer';
import TopBar from '@/components/layouts/TopBar';
import { API_ENDPOINTS } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/constants/roles';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Truck, 
  Search,
  Briefcase,
  Mail,
  ListTodo,
  Lock,
  FileText,
  Trash2,
  Eye,
  Receipt,
  PieChart,
  ShoppingCart,
  Building2,
  Hammer,
  ChevronDown,
  AlertTriangle,
  History,
  CalendarClock,
  Star,
  Circle,
  ArrowRight,
  Bell,
  ShieldAlert,
  Cloud,
  RefreshCcw,
  CheckCircle2,
  ArrowUpRight,
  Edit2,
  Pin,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dash, setDash] = useState<any>({
    businesses: [], fleet: [], notes: [], vat: [], todos: [],
    passwords: [], supplierPayments: [], sales: [], banks: [],
    maintenance: [], lowStock: [], activity: [], quickbooks: { status: 'Disconnected', lastSync: '—', bankFeed: 'Inactive', balance: '$0', pending: 0 },
    pl: { income: '$0', expenses: '$0', grossProfit: '$0', tax: '$0', netProfit: '$0' },
    emails: [],
    reminders: []
  });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState({ email: '', label: '', type: 'primary', password: '' });
  const [noteInput, setNoteInput] = useState('');
  const [todoInput, setTodoInput] = useState('');
  const [selectedFleet, setSelectedFleet] = useState<any>(null);
  const [selectedVAT, setSelectedVAT] = useState<any>(null);
  const [selectedSupplierPayment, setSelectedSupplierPayment] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [selectedPassword, setSelectedPassword] = useState<any>(null);
  const [vaultAuthInput, setVaultAuthInput] = useState('');
  const [isVaultAuthed, setIsVaultAuthed] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<{url: string, title: string} | null>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState('All Entities');
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { router.push('/login'); return; }
    const userData = JSON.parse(savedUser);
    setUser(userData);
    setUserRole(userData.role as UserRole);
    
    const savedBusiness = localStorage.getItem('selectedBusiness');
    if (savedBusiness) setSelectedBusiness(savedBusiness);

    const token = localStorage.getItem('token');
    
    // Fetch businesses for selector
    fetch(API_ENDPOINTS.BUSINESS, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    })
      .then(res => res.json())
      .then(data => setBusinesses(data.entities || []))
      .catch(() => {});

    fetch(API_ENDPOINTS.DASHBOARD, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      return res.json();
    })
    .then(data => {
      if (data) setDash((prev: any) => ({ ...prev, ...data }));
    })
    .catch(err => console.error('Dashboard fetch error:', err));
  }, [router]);

  const authHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  });

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.email) return;

    const method = editingEmailId ? 'PATCH' : 'POST';
    const url = editingEmailId ? `${API_ENDPOINTS.EMAILS}${editingEmailId}/` : API_ENDPOINTS.EMAILS;

    fetch(url, {
      method: method,
      headers: authHeaders(),
      body: JSON.stringify({ ...newEmail, status: 'Connected' }),
    })
      .then(res => res.json())
      .then(saved => {
        if (editingEmailId) {
          setDash((prev: any) => ({
            ...prev,
            emails: prev.emails.map((em: any) => em.id === editingEmailId ? saved : em)
          }));
        } else {
          setDash((prev: any) => ({ ...prev, emails: [saved, ...prev.emails] }));
        }
        setNewEmail({ email: '', label: '', type: 'primary', password: '' });
        setShowEmailModal(false);
        setEditingEmailId(null);
      })
      .catch(() => {
        setNewEmail({ email: '', label: '', type: 'primary', password: '' });
        setShowEmailModal(false);
        setEditingEmailId(null);
      });
  };

  const handleEditEmail = (email: any) => {
    setNewEmail({
      email: email.email,
      label: email.label,
      type: email.type || 'primary',
      password: email.password || ''
    });
    setEditingEmailId(email.id);
    setShowEmailModal(true);
  };

  const handleDeleteEmail = (id: string) => {
    fetch(`${API_ENDPOINTS.EMAILS}${id}/`, { method: 'DELETE', headers: authHeaders() })
      .then(() => setDash((prev: any) => ({ ...prev, emails: prev.emails.filter((em: any) => em.id !== id) })));
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    fetch(API_ENDPOINTS.NOTES, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ text: noteInput, is_pinned: false, color: 'yellow' }),
    })
      .then(res => res.json())
      .then(saved => {
        setDash((prev: any) => ({ ...prev, notes: [saved, ...prev.notes] }));
        setNoteInput('');
      });
  };

  const handleTogglePinNote = (id: string, currentPin: boolean) => {
    fetch(`${API_ENDPOINTS.NOTES}${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ is_pinned: !currentPin }),
    })
      .then(res => res.json())
      .then(updated => {
        setDash((prev: any) => ({
          ...prev,
          notes: prev.notes.map((n: any) => n.id === id ? updated : n)
        }));
      });
  };

  const handleCycleNoteColor = (id: string, currentColor: string) => {
    const colors = ['yellow', 'blue', 'green', 'red'];
    const nextColor = colors[(colors.indexOf(currentColor) + 1) % colors.length];
    fetch(`${API_ENDPOINTS.NOTES}${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ color: nextColor }),
    })
      .then(res => res.json())
      .then(updated => {
        setDash((prev: any) => ({
          ...prev,
          notes: prev.notes.map((n: any) => n.id === id ? updated : n)
        }));
      });
  };

  const handleAddTodo = () => {
    if (!todoInput.trim()) return;
    setDash((prev: any) => ({
      ...prev,
      todos: [{ t: todoInput, d: false }, ...prev.todos]
    }));
    setTodoInput('');
  };

  const handleDeleteNote = (id: string) => {
    fetch(`${API_ENDPOINTS.NOTES}${id}/`, { method: 'DELETE', headers: authHeaders() })
      .then(() => setDash((prev: any) => ({ ...prev, notes: prev.notes.filter((n: any) => n.id !== id) })));
  };

  const handleDeleteTodo = (index: number) => {
    setDash((prev: any) => ({
      ...prev,
      todos: prev.todos.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleToggleTodo = (index: number) => {
    setDash((prev: any) => ({
      ...prev,
      todos: prev.todos.map((t: any, i: number) => i === index ? { ...t, d: !t.d } : t)
    }));
  };

  const handleBusinessChange = (business: string) => {
    setSelectedBusiness(business);
    localStorage.setItem('selectedBusiness', business);
    window.dispatchEvent(new Event('businessChanged'));
  };

  const canShowCard = (cardName: string): boolean => {
    if (userRole === UserRole.SUPER_ADMIN) return true;
    if (!user?.permissions) return false;
    try {
      let perms = user.permissions;
      if (typeof perms === 'string') {
        // Clean python repr or double-stringified JSON
        const clean = perms.replace(/'/g, '"').replace(/None/g, 'null').replace(/True/g, 'true').replace(/False/g, 'false');
        perms = JSON.parse(clean);
        if (typeof perms === 'string') perms = JSON.parse(perms);
      }
      
      const dashCards = perms['Dashboard'];
      return Array.isArray(dashCards) && dashCards.includes(cardName);
    } catch (err) {
      console.error('Permission check error for', cardName, err);
      return false;
    }
  };

  if (!userRole || !user) return null;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar userRole={userRole} />
      
      <ProfileDrawer 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user}
        onUpdateUser={(updatedUser: any) => setUser(updatedUser)}
      />
      
      <main className="ml-[70px] flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar 
          title={userRole === UserRole.SUPER_ADMIN ? 'Super Admin Dashboard' : 'Admin Dashboard'}
          userRole={userRole}
          user={user}
          onProfileClick={() => setIsProfileOpen(true)}
          businesses={businesses}
          selectedBusiness={selectedBusiness}
          onBusinessChange={handleBusinessChange}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-[0.75rem_0.75rem_1.5rem] scrollbar-custom bg-[#f1f5f9]/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            
            {/* 1. BUSINESS DETAILS */}
            {canShowCard('Business Details') && (
              <Widget title="Business Details" icon={Briefcase} color="bg-[#3b82f6]">
                <table className="wt">
                  <thead>
                    <tr>
                      <th className="text-left">BUSINESS NAME</th>
                      <th className="text-left">ADMIN</th>
                      <th className="text-right" style={{ width: '100px' }}>INCOME</th>
                      <th className="text-right" style={{ width: '100px' }}>EXPENSES</th>
                      <th className="text-center" style={{ width: '100px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.businesses
                      .filter((row: any) => selectedBusiness === 'All Entities' || row.name === selectedBusiness)
                      .map((row: any) => (
                      <tr 
                        key={row.id} 
                        onClick={() => router.push(`/business/${row.slug}`)} 
                        className="cursor-pointer group"
                      >
                        <td className="truncate">
                          <strong className="group-hover:text-[#3b82f6] transition-colors">{row.name}</strong>
                        </td>
                        <td className="truncate text-[10px] text-slate-500">{row.admin || 'System Admin'}</td>
                        <td className="text-right text-[#198754] font-bold">{row.inc}</td>
                        <td className="text-right text-[#dc3545]">{row.exp}</td>
                        <td className="text-center">
                          <span className={`status-pill ${row.st === 'Active' ? 'bg-[#198754]' : row.st === 'Pending' ? 'bg-[#ffc107]' : 'bg-[#dc3545]'}`}>
                            {row.st}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Widget>
            )}

            {/* 2. FLEET MANAGEMENT */}
            {canShowCard('Fleet Management') && (
            <Widget 
              title={selectedFleet ? "Vehicle Details" : "Fleet Management"} 
              icon={Truck} 
              color="bg-[#14b8a6]"
              headerAction={selectedFleet && (
                <button 
                  onClick={() => setSelectedFleet(null)}
                  className="text-[10px] bg-white text-[#14b8a6] border border-[#14b8a6] px-2 py-0.5 rounded font-bold hover:bg-[#f0fdfa]"
                >
                  ← Back
                </button>
              )}
            >
              {selectedFleet ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1e293b] m-0">{selectedFleet.v}</h4>
                      <p className="text-[11px] text-[#64748b] m-0">{selectedFleet.p}</p>
                    </div>
                    <span className={`status-pill ${
                      selectedFleet.s === 'Active' ? 'bg-[#198754]' :
                      selectedFleet.s === 'Maint' ? 'bg-[#f59e0b]' :
                      selectedFleet.s === 'Repair' ? 'bg-[#ffc107]' :
                      'bg-[#dc3545]'
                    }`}>
                      {selectedFleet.s}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`space-y-1 p-2 rounded-lg border border-transparent transition-all ${selectedFleet.docs?.ins ? 'hover:border-[#14b8a6] hover:bg-[#f0fdfa] cursor-pointer' : 'opacity-80'}`}
                      onClick={() => selectedFleet.docs?.ins && setActiveDoc({url: selectedFleet.docs.ins, title: `${selectedFleet.v} - Insurance`})}
                    >
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        Insurance Expiry
                        {selectedFleet.docs?.ins && <FileText size={10} className="text-[#14b8a6]" />}
                      </label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedFleet.i}</p>
                    </div>

                    <div 
                      className={`space-y-1 p-2 rounded-lg border border-transparent transition-all ${selectedFleet.docs?.mot ? 'hover:border-[#14b8a6] hover:bg-[#f0fdfa] cursor-pointer' : 'opacity-80'}`}
                      onClick={() => selectedFleet.docs?.mot && setActiveDoc({url: selectedFleet.docs.mot, title: `${selectedFleet.v} - MOT Certificate`})}
                    >
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        MOT Expiry
                        {selectedFleet.docs?.mot && <FileText size={10} className="text-[#14b8a6]" />}
                      </label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedFleet.mot}</p>
                    </div>

                    <div 
                      className={`space-y-1 p-2 rounded-lg border border-transparent transition-all ${selectedFleet.docs?.tax ? 'hover:border-[#14b8a6] hover:bg-[#f0fdfa] cursor-pointer' : 'opacity-80'}`}
                      onClick={() => selectedFleet.docs?.tax && setActiveDoc({url: selectedFleet.docs.tax, title: `${selectedFleet.v} - Road Tax`})}
                    >
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        Road Tax Due
                        {selectedFleet.docs?.tax && <FileText size={10} className="text-[#14b8a6]" />}
                      </label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedFleet.tax}</p>
                    </div>

                    <div className="space-y-1 p-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Business Unit</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedFleet.biz}</p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#f1f5f9]">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Internal Notes</label>
                    <div className="bg-slate-50 p-2 rounded-lg min-h-[40px]">
                      {selectedFleet.notes ? (
                        <p className="text-[10px] text-slate-600 leading-relaxed m-0 italic">
                          "{selectedFleet.notes}"
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400 m-0">No internal notes recorded for this asset.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link 
                      href="/fleet"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#14b8a6] text-white text-[10px] font-bold rounded-lg hover:bg-[#0d9488] transition-all"
                    >
                      View Full Asset Profile <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ) : (
                <table className="wt">
                  <thead>
                    <tr>
                      <th className="text-left">VEHICLE</th>
                      <th className="text-left">BUSINESS</th>
                      <th className="text-left">PLATE</th>
                      <th className="text-left">INS. EXPIRY</th>
                      <th className="text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.fleet
                      .filter((row: any) => selectedBusiness === 'All Entities' || row.biz === selectedBusiness)
                      .map((row: any, i: number) => (
                      <tr key={i} onClick={() => setSelectedFleet(row)} className="cursor-pointer group">
                        <td><strong className="group-hover:text-[#14b8a6] transition-colors">{row.v}</strong></td>
                        <td className="truncate text-[10px] text-slate-500">{row.biz}</td>
                        <td className="truncate">{row.p}</td>
                        <td>{row.i}</td>
                        <td className="text-center">
                          <span className={`status-pill ${
                            row.s === 'Active' ? 'bg-[#198754]' :
                            row.s === 'Maint' ? 'bg-[#f59e0b]' :
                            row.s === 'Repair' ? 'bg-[#ffc107]' :
                            'bg-[#dc3545]'
                          }`}>
                            {row.s}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Widget>
            )}

            {/* 3. NOTES */}
            {canShowCard('Notes') && (
              <Widget title="Notes" icon={FileText} color="bg-[#f59e0b]">
                <div className="space-y-2">
                  {dash.notes
                    .sort((a: any, b: any) => {
                      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
                      return b.id > a.id ? 1 : -1; // Fallback to id for latest first
                    })
                    .map((note: any) => (
                    <div 
                      key={note.id} 
                      className={cn(
                        "rounded-lg p-2 relative group shadow-sm transition-all border",
                        note.color === 'blue' ? "bg-blue-50 border-blue-100" :
                        note.color === 'green' ? "bg-emerald-50 border-emerald-100" :
                        note.color === 'red' ? "bg-red-50 border-red-100" :
                        "bg-[#fffbeb] border-[#fef3c7]"
                      )}
                    >
                      <p className={cn(
                        "text-[11px] leading-[1.3] m-0 pr-10",
                        note.color === 'blue' ? "text-blue-900" :
                        note.color === 'green' ? "text-emerald-900" :
                        note.color === 'red' ? "text-red-900" :
                        "text-[#1e293b]"
                      )}>
                        {note.text}
                      </p>
  
                      {note.created_at && (
                        <div className={cn(
                          "text-[8px] font-bold mt-1.5 opacity-60 flex items-center gap-1",
                          note.color === 'blue' ? "text-blue-700" :
                          note.color === 'green' ? "text-emerald-700" :
                          note.color === 'red' ? "text-red-700" :
                          "text-slate-400"
                        )}>
                          <Clock size={8} /> {new Date(note.created_at).toLocaleDateString()} — {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                      
                      <div className="absolute right-1.5 top-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => handleCycleNoteColor(note.id, note.color || 'yellow')}
                          className="p-1 hover:bg-black/5 rounded transition-colors"
                          title="Highlight"
                        >
                          <div className={cn(
                            "w-2.5 h-2.5 rounded-full border border-black/10",
                            note.color === 'blue' ? "bg-blue-400" :
                            note.color === 'green' ? "bg-emerald-400" :
                            note.color === 'red' ? "bg-red-400" :
                            "bg-yellow-400"
                          )} />
                        </button>
                        <button
                          onClick={() => handleTogglePinNote(note.id, note.is_pinned)}
                          className={cn(
                            "p-1 rounded transition-colors",
                            note.is_pinned ? "text-indigo-600 opacity-100" : "text-slate-400 hover:bg-black/5"
                          )}
                          title={note.is_pinned ? "Unpin" : "Pin to top"}
                        >
                          <Pin className={cn("w-3 h-3", note.is_pinned && "fill-current")} />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 text-[#ef4444] hover:bg-red-50 rounded transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="space-y-2 pt-1">
                    <textarea 
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      placeholder="Write a note..." 
                      className="w-full text-[11px] p-2 border border-[#e2e8f0] rounded-lg outline-none focus:border-[#4f46e5] min-h-[40px] resize-none" 
                    />
                    <button 
                      onClick={handleAddNote}
                      className="w-full bg-[#ffc107] text-[#212529] py-1.5 rounded-lg text-[11px] font-bold shadow-sm hover:bg-[#eab308]"
                    >
                      + Add Note
                    </button>
                  </div>
                </div>
              </Widget>
            )}

            {/* 4. EMAILS */}
            {canShowCard('Gmail / Email') && (
              <Widget 
                title="Gmails / Emails" 
                icon={Mail} 
                color="bg-[#ef4444]" 
                headerAction={
                  !showEmailModal && (
                    <button 
                      onClick={() => setShowEmailModal(true)}
                      className="text-[10px] bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] px-2 py-0.5 rounded font-bold hover:bg-[#bfdbfe]"
                    >
                      + Add
                    </button>
                  )
                }
              >
                <div className="space-y-3 min-h-[220px]">
                  {showEmailModal ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in slide-in-from-top-4 duration-300 shadow-inner h-full">
                      <div className="space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{editingEmailId ? 'Edit Inbox Connection' : 'Connect New Inbox'}</label>
                          <input 
                            type="email" 
                            placeholder="Email Address"
                            className="w-full p-2 bg-white border border-slate-200 rounded-xl text-[10px] outline-none focus:border-[#ef4444] transition-all"
                            value={newEmail.email}
                            onChange={e => setNewEmail({...newEmail, email: e.target.value})}
                          />
                        </div>
                        <input 
                          type="password" 
                          placeholder="App Password / SMTP Password"
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-[10px] outline-none focus:border-[#ef4444] transition-all"
                          value={newEmail.password}
                          onChange={e => setNewEmail({...newEmail, password: e.target.value})}
                        />
                        <input 
                          type="text" 
                          placeholder="Account Label (e.g. Primary)"
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-[10px] outline-none focus:border-[#ef4444] transition-all"
                          value={newEmail.label}
                          onChange={e => setNewEmail({...newEmail, label: e.target.value})}
                        />
                        <div className="flex gap-2 pt-1">
                          <button 
                            onClick={handleAddEmail}
                            className="flex-[2] bg-[#ef4444] text-white py-2 rounded-xl text-[10px] font-bold shadow-lg shadow-red-100 hover:bg-[#dc2626] transition-all active:scale-95"
                          >
                            {editingEmailId ? 'Update Account' : 'Save Account'}
                          </button>
                          <button 
                            onClick={() => {
                              setShowEmailModal(false);
                              setEditingEmailId(null);
                              setNewEmail({ email: '', label: '', type: 'primary', password: '' });
                            }}
                            className="flex-1 bg-white border border-slate-200 text-slate-500 py-2 rounded-xl text-[10px] font-bold hover:bg-slate-100 transition-all active:scale-95"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-[220px] overflow-y-auto pr-1 scrollbar-custom space-y-3 animate-in fade-in duration-300">
                      {dash.emails.map((email: any) => (
                        <div key={email.id} className="flex items-center gap-3 p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg group">
                          <div className={`w-8 h-8 rounded-full ${email.type === 'primary' ? 'bg-[#4f46e5]' : 'bg-[#ea4335]'} text-white flex items-center justify-center text-[12px] font-bold shrink-0`}><Mail size={14} /></div>
                          <div className="flex-1 min-w-0">
                            <a 
                              href={`https://mail.google.com/mail/u/0/#search/to:${email.email}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-[#1e293b] truncate block hover:text-[#ef4444] transition-colors"
                            >
                              {email.email}
                            </a>
                            <div className="text-[9px] text-[#64748b]">{email.label}</div>
                          </div>
                          <span className="px-2 py-0.5 bg-[#198754] text-white text-[9px] font-bold rounded">{email.status}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-1">
                            <button onClick={() => handleEditEmail(email)} className="text-slate-400 hover:text-[#4f46e5]"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => handleDeleteEmail(email.id)} className="text-[#ef4444] hover:text-[#dc2626]"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Widget>
            )}

            {/* 5. VAT / TAX */}
            {canShowCard('VAT / Tax') && (
            <Widget 
              title={selectedVAT ? "Tax Record Details" : "VAT / Tax"} 
              icon={Receipt} 
              color="bg-[#f59e0b]"
              headerAction={selectedVAT && (
                <button 
                  onClick={() => setSelectedVAT(null)}
                  className="text-[10px] bg-white text-[#f59e0b] border border-[#f59e0b] px-2 py-0.5 rounded font-bold hover:bg-[#fffbeb]"
                >
                  ← Back
                </button>
              )}
            >
              {selectedVAT ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1e293b] m-0">{selectedVAT.type}</h4>
                      <p className="text-[11px] text-[#64748b] m-0">{selectedVAT.period}</p>
                    </div>
                    <span className={`status-pill ${
                      selectedVAT.status === 'Paid' ? 'bg-[#198754]' : 
                      selectedVAT.status === 'Filed' ? 'bg-[#f59e0b]' : 
                      'bg-[#6c757d]'
                    }`}>
                      {selectedVAT.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount</label>
                      <p className="text-[12px] font-bold text-[#1e293b] m-0">{selectedVAT.amount}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Reference #</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedVAT.ref}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Filing Date</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedVAT.date}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Business Entity</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedVAT.biz}</p>
                    </div>
                  </div>

                  {selectedVAT.doc && (
                    <div className="pt-2 border-t border-[#f1f5f9]">
                      <button 
                        onClick={() => setActiveDoc({url: selectedVAT.doc, title: `Tax Record - ${selectedVAT.ref}`})}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-[10px] font-bold rounded-lg hover:bg-[#fde68a] transition-all"
                      >
                        <FileText size={12} /> Preview Tax Document
                      </button>
                    </div>
                  )}

                  <div className="pt-1">
                    <Link 
                      href="/accounting"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#f59e0b] text-white text-[10px] font-bold rounded-lg hover:bg-[#d97706] transition-all"
                    >
                      View Full Tax Ledger <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ) : (
                <table className="wt">
                  <thead>
                    <tr>
                      <th className="text-left">TYPE</th>
                      <th className="text-left">BUSINESS</th>
                      <th className="text-left">PERIOD</th>
                      <th className="text-left">AMOUNT</th>
                      <th className="text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.vat
                      .filter((r: any) => selectedBusiness === 'All Entities' || r.biz === selectedBusiness)
                      .map((r: any, i: number) => (
                      <tr key={i} onClick={() => setSelectedVAT(r)} className="cursor-pointer group">
                        <td><strong className="group-hover:text-[#f59e0b] transition-colors">{r.type}</strong></td>
                        <td className="truncate text-[10px] text-slate-500">{r.biz}</td>
                        <td>{r.period}</td>
                        <td><strong>{r.amount}</strong></td>
                        <td className="text-center">
                          <span className={`status-pill ${
                            r.status === 'Paid' ? 'bg-[#198754]' : 
                            r.status === 'Filed' ? 'bg-[#f59e0b]' : 
                            'bg-[#6c757d]'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Widget>
            )}

            {/* 6. SYSTEM REMINDERS */}
            {canShowCard('System Reminders') && (
            <Widget
              title="System Reminders"
              icon={Bell}
              color="bg-[#8b5cf6]"
              headerAction={
                <Link href="/reminders" className="text-[9px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
                  Manage All <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              }
            >
              <div className="space-y-2">
                {(dash.reminders || [])
                  .filter((reminder: any) => selectedBusiness === 'All Entities' || reminder.business === selectedBusiness)
                  .slice(0, 4)
                  .map((reminder: any) => (
                  <Link key={reminder.id} href="/reminders" className="p-2.5 bg-[#f8fafc] border border-slate-100 rounded-xl flex items-center gap-3 group hover:border-indigo-100 hover:shadow-sm transition-all block cursor-pointer">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      reminder.priority === 'High' ? 'bg-red-50 text-red-500' : 
                      reminder.priority === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                    )}>
                      {reminder.type === 'Fleet' ? <Truck className="w-4 h-4" /> : 
                       reminder.type === 'Legal' ? <FileText className="w-4 h-4" /> :
                       reminder.type === 'Accounting' ? <ShieldAlert className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h6 className="text-[11px] font-bold text-slate-800 truncate m-0">{reminder.title}</h6>
                      <p className="text-[9px] text-slate-500 font-medium truncate m-0">{reminder.business}</p>
                    </div>
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter",
                      reminder.priority === 'High' ? 'bg-red-100 text-red-700' : 
                      reminder.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    )}>
                      {reminder.priority}
                    </span>
                  </Link>
                ))}
                {(!dash.reminders || dash.reminders.length === 0) && (
                  <div className="py-8 text-center">
                    <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-[10px] text-slate-400 font-medium">No active reminders</p>
                  </div>
                )}
              </div>
            </Widget>
            )}

            {/* 7. SYSTEM PASSWORDS */}
            {canShowCard('System Passwords') && (
              <Widget 
                title={selectedPassword ? "Credential Details" : "System Passwords"} 
                icon={Lock} 
                color="bg-slate-800"
                headerAction={
                  selectedPassword ? (
                    <button 
                      onClick={() => { setSelectedPassword(null); setIsVaultAuthed(false); setVaultAuthInput(''); }}
                      className="text-[10px] bg-white text-slate-800 border border-slate-800 px-2 py-0.5 rounded font-bold hover:bg-slate-50"
                    >
                      ← Back
                    </button>
                  ) : (
                    <Link href="/system-access" className="text-[9px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                      Open Vault <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  )
                }
              >
                {selectedPassword ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-800 m-0">{selectedPassword.s}</h4>
                        <p className="text-[11px] text-slate-500 m-0">{selectedPassword.u}</p>
                      </div>
                      <span className={`status-pill ${selectedPassword.st === 'Active' ? 'bg-[#198754]' : 'bg-[#dc3545]'}`}>
                        {selectedPassword.st}
                      </span>
                    </div>

                    {!isVaultAuthed ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                        <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
                        <div>
                          <p className="text-[11px] font-bold text-slate-700 m-0">Vault Authentication Required</p>
                          <p className="text-[9px] text-slate-500 m-0">Enter your login password to reveal credentials.</p>
                        </div>
                        <input 
                          type="password"
                          value={vaultAuthInput}
                          onChange={(e) => setVaultAuthInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') {
                            const loginPw = localStorage.getItem('user_pw');
                            if (!loginPw) {
                              setVaultError('Security session not synced. Please log out and log in again.');
                            } else if (vaultAuthInput === loginPw) {
                              setIsVaultAuthed(true);
                              setVaultAuthInput('');
                            } else {
                              setVaultError('The password you entered is incorrect.');
                            }
                          }}}
                          placeholder="Enter password..."
                          className="w-full text-center px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-slate-800 font-bold tracking-widest"
                          autoFocus
                        />
                        <button 
                          onClick={() => {
                            const loginPw = localStorage.getItem('user_pw');
                            if (!loginPw) {
                              setVaultError('Security session not synced. Please log out and log in again.');
                            } else if (vaultAuthInput === loginPw) {
                              setIsVaultAuthed(true);
                              setVaultAuthInput('');
                            } else {
                              setVaultError('The password you entered is incorrect.');
                            }
                          }}
                          className="w-full py-2 bg-slate-800 text-white text-[10px] font-bold rounded-lg hover:bg-slate-700 transition-all shadow-sm"
                        >
                          Unlock Vault
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 animate-in zoom-in-95 duration-300">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Lock size={40} className="text-white" />
                          </div>
                          <div className="relative z-10 space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Access Password</label>
                            <p className="text-sm font-mono text-white m-0 tracking-wider break-all bg-black/20 p-2 rounded-lg border border-white/10">
                              {selectedPassword.p}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Support Contact</label>
                            <p className="text-[11px] font-bold text-slate-700 m-0 truncate">{selectedPassword.sup}</p>
                          </div>
                          <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Security Level</label>
                            <div className="w-2 h-2 rounded-full bg-[#198754] animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-custom">
                    {dash.passwords.map((row: any, i: number) => (
                      <div 
                        key={i} 
                        onClick={() => { setSelectedPassword(row); setIsVaultAuthed(false); setVaultAuthInput(''); }} 
                        className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg group cursor-pointer hover:border-slate-400 hover:shadow-sm transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h6 className="text-[11px] font-bold text-slate-800 truncate m-0 group-hover:text-indigo-600 transition-colors">{row.s}</h6>
                          <p className="text-[9px] text-slate-500 truncate m-0 font-medium">{row.u}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`status-pill ${row.st === 'Active' ? 'bg-[#198754]' : 'bg-[#dc3545]'} !text-[8px] !px-1.5 !py-0.5`}>
                            {row.st}
                          </span>
                          <span className="text-[8px] text-slate-400 font-mono tracking-widest">••••••</span>
                        </div>
                      </div>
                    ))}
                    {(!dash.passwords || dash.passwords.length === 0) && (
                      <div className="py-8 text-center">
                        <Lock className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-[10px] text-slate-400 font-medium">No credentials stored</p>
                      </div>
                    )}
                  </div>
                )}
              </Widget>
            )}

            {/* 8. PROFIT & LOSS */}
            {canShowCard('Profit & Loss') && (
            <Widget title="Profit & Loss Statement" icon={PieChart} color="bg-[#10b981]">
              <div className="space-y-1">
                <div className="pl-row"><span className="flex items-center gap-2"><Circle className="w-1.5 h-1.5 fill-[#198754] text-[#198754]" /> Total Income</span><strong className="text-[#198754]">{dash.pl.income}</strong></div>
                <div className="pl-row"><span className="flex items-center gap-2"><Circle className="w-1.5 h-1.5 fill-[#dc3545] text-[#dc3545]" /> Total Expenses</span><strong className="text-[#dc3545]">{dash.pl.expenses}</strong></div>
                <div className="pl-row divider font-bold"><span>Gross Profit</span><strong>{dash.pl.grossProfit}</strong></div>
                <div className="pl-row"><span className="flex items-center gap-2"><Circle className="w-1.5 h-1.5 fill-[#f59e0b] text-[#f59e0b]" /> Tax (20%)</span><strong className="text-[#f59e0b]">{dash.pl.tax}</strong></div>
                <div className="pl-row total"><span className="flex items-center gap-2"><Star className="w-3 h-3 fill-[#059669]" /> Net Profit</span><strong>{dash.pl.netProfit}</strong></div>
              </div>
            </Widget>
            )}

            {/* 9. SUPPLIER PAYMENTS */}
            {canShowCard('Supplier Payments') && (
            <Widget 
              title={selectedSupplierPayment ? "Payment Details" : "Supplier Payments"} 
              icon={ShoppingCart} 
              color="bg-[#f59e0b]"
              headerAction={selectedSupplierPayment && (
                <button 
                  onClick={() => setSelectedSupplierPayment(null)}
                  className="text-[10px] bg-white text-[#f59e0b] border border-[#f59e0b] px-2 py-0.5 rounded font-bold hover:bg-[#fffbeb]"
                >
                  ← Back
                </button>
              )}
            >
              {selectedSupplierPayment ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1e293b] m-0">{selectedSupplierPayment.p}</h4>
                      <p className="text-[11px] text-[#64748b] m-0">{selectedSupplierPayment.s}</p>
                    </div>
                    <span className={`status-pill ${
                      selectedSupplierPayment.st === 'Paid' ? 'bg-[#198754]' : 
                      selectedSupplierPayment.st === 'Overdue' ? 'bg-[#dc3545]' : 
                      'bg-[#ffc107]'
                    }`}>
                      {selectedSupplierPayment.st}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount</label>
                      <p className="text-[12px] font-bold text-[#1e293b] m-0">{selectedSupplierPayment.a}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedSupplierPayment.date}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Product / Service</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedSupplierPayment.prod}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quantity</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedSupplierPayment.qty}</p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#f1f5f9]">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Contact Details</label>
                    <p className="text-[10px] text-slate-600 m-0 truncate">{selectedSupplierPayment.email}</p>
                    <p className="text-[10px] text-slate-400 m-0">{selectedSupplierPayment.biz}</p>
                  </div>

                  <div className="pt-1">
                    <Link 
                      href="/suppliers"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#f59e0b] text-white text-[10px] font-bold rounded-lg hover:bg-[#d97706] transition-all"
                    >
                      Manage Supplier Orders <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ) : (
                <table className="wt">
                  <thead>
                    <tr>
                      <th className="text-left">PO #</th>
                      <th className="text-left">BUSINESS</th>
                      <th className="text-left">SUPPLIER</th>
                      <th className="text-right">AMOUNT</th>
                      <th className="text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.supplierPayments
                      .filter((row: any) => selectedBusiness === 'All Entities' || row.biz === selectedBusiness)
                      .map((row: any, i: number) => (
                      <tr key={i} onClick={() => setSelectedSupplierPayment(row)} className="cursor-pointer group">
                        <td><strong className="group-hover:text-[#f59e0b] transition-colors">{row.p}</strong></td>
                        <td className="truncate text-[10px] text-slate-500">{row.biz}</td>
                        <td className="truncate">{row.s}</td>
                        <td className="text-right"><strong>{row.a}</strong></td>
                        <td className="text-center">
                          <span className={`status-pill ${
                            row.st === 'Paid' ? 'bg-[#198754]' : 
                            row.st === 'Overdue' ? 'bg-[#dc3545]' : 
                            'bg-[#ffc107]'
                          }`}>
                            {row.st}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Widget>
            )}

            {/* 10. SALES REPORT */}
            {canShowCard('Sales Report') && (
            <Widget title="Sales Report" icon={TrendingUp} color="bg-[#3b82f6]">
               <table className="wt">
                <thead>
                  <tr>
                    <th className="text-left">INV #</th>
                    <th className="text-left">CLIENT</th>
                    <th className="text-right">AMOUNT</th>
                    <th className="text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.sales.map((row: any, i: number) => (
                    <tr key={i}>
                      <td><strong>{row.i}</strong></td>
                      <td className="truncate">{row.c}</td>
                      <td className="text-right"><strong>{row.a}</strong></td>
                      <td className="text-center">
                        <span className={`status-pill ${row.s === 'Paid' ? 'bg-[#198754]' : row.s === 'Overdue' ? 'bg-[#dc3545]' : 'bg-[#f59e0b]'}`}>
                          {row.s}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Widget>
            )}

            {/* 11. BANK ACCOUNTS */}
            {canShowCard('Bank Accounts') && (
            <Widget 
              title={selectedBank ? "Account Details" : "Bank Accounts"} 
              icon={Building2} 
              color="bg-[#10b981]"
              headerAction={selectedBank && (
                <button 
                  onClick={() => setSelectedBank(null)}
                  className="text-[10px] bg-white text-[#10b981] border border-[#10b981] px-2 py-0.5 rounded font-bold hover:bg-[#f0fdf4]"
                >
                  ← Back
                </button>
              )}
            >
              {selectedBank ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1e293b] m-0">{selectedBank.b}</h4>
                      <p className="text-[11px] text-[#64748b] m-0">{selectedBank.n}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#10b981] text-white text-[9px] font-bold rounded-full">
                      {selectedBank.st}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Account Type</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedBank.bl}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Account Number</label>
                      <p className="text-[11px] font-mono font-semibold text-slate-700 m-0">{selectedBank.num}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sort Code</label>
                      <p className="text-[11px] font-mono font-semibold text-slate-700 m-0">{selectedBank.sort}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Business Unit</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedBank.biz}</p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#f1f5f9]">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">IBAN / International</label>
                    <p className="text-[10px] text-slate-600 font-mono m-0 truncate">{selectedBank.iban}</p>
                  </div>

                  <div className="pt-1">
                    <Link 
                      href="/accounting"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#10b981] text-white text-[10px] font-bold rounded-lg hover:bg-[#059669] transition-all"
                    >
                      View All Accounts <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ) : (
                <table className="wt">
                  <thead>
                    <tr>
                      <th className="text-left">BANK</th>
                      <th className="text-left">ACCOUNT NAME</th>
                      <th className="text-left">BALANCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.banks
                      .filter((row: any) => selectedBusiness === 'All Entities' || row.biz === selectedBusiness)
                      .map((row: any, i: number) => (
                      <tr key={i} onClick={() => setSelectedBank(row)} className="cursor-pointer group">
                        <td><strong className="group-hover:text-[#10b981] transition-colors">{row.b}</strong></td>
                        <td className="truncate">{row.n}</td>
                        <td><strong className="text-[#198754]">{row.bl}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Widget>
            )}

            {/* 12. MAINTENANCE REQUESTS */}
            {canShowCard('Maintenance') && (
            <Widget 
              title={selectedMaintenance ? "Ticket Details" : "Maintenance"} 
              icon={Hammer} 
              color="bg-[#ef4444]"
              headerAction={selectedMaintenance && (
                <button 
                  onClick={() => setSelectedMaintenance(null)}
                  className="text-[10px] bg-white text-[#ef4444] border border-[#ef4444] px-2 py-0.5 rounded font-bold hover:bg-[#fef2f2]"
                >
                  ← Back
                </button>
              )}
            >
              {selectedMaintenance ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-bold text-[#1e293b] m-0 truncate">{selectedMaintenance.a}</h4>
                      <p className="text-[11px] text-[#64748b] m-0">{selectedMaintenance.loc}</p>
                    </div>
                    <span className={`status-pill ${selectedMaintenance.p === 'Urgent' ? 'bg-[#dc3545]' : 'bg-[#f59e0b]'}`}>
                      {selectedMaintenance.p}
                    </span>
                  </div>

                  <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100/50">
                    <label className="text-[9px] font-bold text-red-400 uppercase tracking-wider mb-1 block">Reported Issue</label>
                    <p className="text-[11px] text-slate-700 m-0 font-medium leading-relaxed italic">"{selectedMaintenance.issue}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Technician</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedMaintenance.tech}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Current Status</label>
                      <p className="text-[11px] font-semibold text-[#ef4444] m-0">{selectedMaintenance.s}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Requested On</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedMaintenance.date}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Business Unit</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedMaintenance.biz}</p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Link 
                      href="/property"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#ef4444] text-white text-[10px] font-bold rounded-lg hover:bg-[#dc2626] transition-all"
                    >
                      Open Maintenance Board <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ) : (
                <table className="wt">
                  <thead>
                    <tr>
                      <th className="text-left">ASSET</th>
                      <th className="text-left">BUSINESS</th>
                      <th className="text-left">PRIORITY</th>
                      <th className="text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.maintenance
                      .filter((row: any) => selectedBusiness === 'All Entities' || row.biz === selectedBusiness)
                      .map((row: any, i: number) => (
                      <tr key={i} onClick={() => setSelectedMaintenance(row)} className="cursor-pointer group">
                        <td className="truncate"><strong className="group-hover:text-[#ef4444] transition-colors">{row.a}</strong></td>
                        <td className="truncate text-[10px] text-slate-500">{row.biz}</td>
                        <td><span className={`status-pill ${row.p === 'Urgent' ? 'bg-[#dc3545]' : 'bg-[#f59e0b]'}`}>{row.p}</span></td>
                        <td className="text-center text-slate-500">{row.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Widget>
            )}

            {/* 13. LOW STOCK ALERTS */}
            {canShowCard('Low Stock') && (
            <Widget 
              title={selectedStock ? "Inventory Stats" : "Low Stock"} 
              icon={AlertTriangle} 
              color="bg-[#f59e0b]"
              headerAction={selectedStock && (
                <button 
                  onClick={() => setSelectedStock(null)}
                  className="text-[10px] bg-white text-[#f59e0b] border border-[#f59e0b] px-2 py-0.5 rounded font-bold hover:bg-[#fffbeb]"
                >
                  ← Back
                </button>
              )}
            >
              {selectedStock ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
                    <div>
                      <h4 className="text-[13px] font-bold text-[#1e293b] m-0">{selectedStock.i}</h4>
                      <p className="text-[11px] text-[#64748b] m-0">SKU: {selectedStock.sku}</p>
                    </div>
                    <span className={`status-pill ${selectedStock.c === 0 ? 'bg-[#dc3545]' : 'bg-[#ffc107]'}`}>
                      {selectedStock.s}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Current Stock</label>
                      <p className={`text-[14px] font-bold m-0 ${selectedStock.c === 0 ? 'text-red-600' : 'text-amber-600'}`}>{selectedStock.c} Units</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Min. Required</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedStock.min} Units</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Unit Price</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0">{selectedStock.pr}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                      <p className="text-[11px] font-semibold text-slate-700 m-0 truncate">{selectedStock.cat}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-[10px] text-amber-800 font-medium m-0 flex items-center gap-2">
                      <AlertTriangle size={12} className="shrink-0" />
                      Critical stock level reached. Restock recommended.
                    </p>
                  </div>

                  <div className="pt-1">
                    <Link 
                      href="/inventory"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#f59e0b] text-white text-[10px] font-bold rounded-lg hover:bg-[#d97706] transition-all"
                    >
                      Inventory Manager <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ) : (
                <table className="wt">
                  <thead>
                    <tr>
                      <th className="text-left">ITEM</th>
                      <th className="text-left">BUSINESS</th>
                      <th className="text-left">CUR.</th>
                      <th className="text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.lowStock
                      .filter((row: any) => selectedBusiness === 'All Entities' || row.biz === selectedBusiness)
                      .map((row: any, i: number) => (
                      <tr key={i} onClick={() => setSelectedStock(row)} className="cursor-pointer group">
                        <td className="truncate"><strong className="group-hover:text-[#f59e0b] transition-colors">{row.i}</strong></td>
                        <td className="truncate text-[10px] text-slate-500">{row.biz}</td>
                        <td>{row.c}</td>
                        <td className="text-center">
                          <span className={`status-pill ${row.s === 'Good' ? 'bg-[#198754]' : row.s === 'Out of Stock' ? 'bg-[#dc3545]' : 'bg-[#ffc107]'}`}>
                            {row.s}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Widget>
            )}

            {/* 14. RECENT SYSTEM ACTIVITY */}
            {canShowCard('Recent Activity') && (
              <Widget title="Recent Activity" icon={History} color="bg-[#3b82f6]">
                <div className="space-y-3 py-1">
                  {dash.activity.map((act: any, i: number) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <span className="text-[#94a3b8] whitespace-nowrap">{act.t}</span>
                      <span className="text-[#1e293b] leading-[1.3] truncate">{act.a}</span>
                    </div>
                  ))}
                </div>
              </Widget>
            )}

            {/* 15. QUICKBOOKS INTEGRATION */}
            {canShowCard('QuickBooks') && (
            <Widget
              title="QuickBooks Online"
              icon={Cloud}
              color="bg-[#2ca01c]"
              headerAction={
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
                  <span className="text-[9px] font-bold text-[#16a34a] uppercase">Live</span>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Cloud size={40} className="text-[#2ca01c]" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company Balance</p>
                    <h3 className="text-xl font-extrabold text-slate-800 m-0">{dash.quickbooks?.balance || '$0.00'}</h3>
                  </div>
                  <div className="relative z-10 text-right">
                    <button className="p-2 bg-white border border-slate-200 rounded-lg hover:border-[#2ca01c] hover:text-[#2ca01c] transition-all shadow-sm">
                      <RefreshCcw size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex flex-col gap-1 shadow-sm">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Bank Feed</span>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-[#16a34a]" />
                      <span className="text-[11px] font-bold text-slate-700">{dash.quickbooks?.bankFeed}</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex flex-col gap-1 shadow-sm">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Pending Review</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 bg-amber-100 text-amber-600 rounded flex items-center justify-center text-[10px] font-bold">{dash.quickbooks?.pending}</div>
                      <span className="text-[11px] font-bold text-slate-700">Transactions</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button className="w-full py-2 bg-[#2ca01c] text-white text-[10px] font-bold rounded-lg hover:bg-[#238016] transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                    Open QuickBooks Center <ArrowUpRight size={12} />
                  </button>
                  <p className="text-center text-[9px] text-slate-400 mt-2 font-medium">Last synced: {dash.quickbooks?.lastSync}</p>
                </div>
              </div>
            </Widget>
            )}

          </div>
        </div>
      </main>

      {/* Custom Vault Error Popup */}
      {vaultError && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setVaultError(null)} />
          <div className="relative bg-white w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-red-100">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Security Access Denied</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  {vaultError}
                </p>
              </div>
              <button 
                onClick={() => setVaultError(null)}
                className="w-full py-3 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                Acknowledged
              </button>
            </div>
            <div className="bg-slate-50 px-6 py-3 text-center border-t border-slate-100">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <Lock size={10} /> Secure Vault Protection
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Drawer */}
      {activeDoc && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveDoc(null)} />
          <div className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-800 m-0">{activeDoc.title}</h3>
                <p className="text-[10px] text-slate-500 m-0">Document Preview</p>
              </div>
              <button 
                onClick={() => setActiveDoc(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 overflow-hidden relative">
              {activeDoc.url.toLowerCase().includes('.pdf') ? (
                <iframe 
                  src={`${activeDoc.url}#toolbar=0&navpanes=0`} 
                  className="w-full h-full border-none bg-white" 
                  title="Document Viewer" 
                />
              ) : activeDoc.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <div className="w-full h-full flex items-center justify-center p-8 overflow-auto">
                  <img src={activeDoc.url} alt="Document" className="max-w-full max-h-full object-contain shadow-2xl border border-white" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="text-center p-12 bg-white rounded-3xl shadow-xl max-w-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-10 h-10 text-slate-400" />
                    </div>
                    <h4 className="text-slate-800 font-bold mb-2">No Preview Available</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed mb-6">
                      This file format does not support direct browser preview. Please download the document to view it on your device.
                    </p>
                    <a 
                      href={activeDoc.url} 
                      download 
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4f46e5] text-white text-[11px] font-bold rounded-xl hover:bg-[#4338ca] transition-all shadow-lg shadow-indigo-100"
                    >
                      Download Document <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-white flex justify-between items-center">
              <span className="text-[10px] text-slate-400 italic">Secure ERP Document Viewer</span>
              <a 
                href={activeDoc.url} 
                download 
                className="px-4 py-2 bg-[#4f46e5] text-white text-[11px] font-bold rounded-lg hover:bg-[#4338ca] transition-all flex items-center gap-2"
              >
                Download File <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-custom::-webkit-scrollbar { width: 6px; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        .widget-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0, 0, 0, .04); overflow: hidden; }
        .widget-header { background: #fff; padding: .65rem .85rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
        .widget-header-icon { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: .5rem; color: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, .05); }
        .widget-title { font-size: 13px; font-weight: 700; color: #1e293b; }
        .widget-body { padding: .65rem .85rem; flex: 1; overflow: hidden; }

        .wt { width: 100%; border-collapse: collapse; font-size: 11px; }
        .wt th { font-size: 9px; font-weight: 800; text-transform: uppercase; color: #64748b; padding: 10px 4px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
        .wt td { padding: 8px 4px; border-bottom: 1px solid #f8fafc; vertical-align: middle; color: #1e293b; }
        .wt tr:hover td { background: #f8fafc; }
        
        .status-pill { padding: 2px 8px; border-radius: 30px; color: white; font-size: 9px; display: inline-block; min-width: 55px; text-align: center; font-weight: 700; }
        
        .pl-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; border-radius: 6px; margin-bottom: 1px; font-size: 11.5px; color: #1e293b; }
        .pl-row.divider { border-top: 1px solid #e2e8f0; margin-top: 3px; padding-top: 6px; }
        .pl-row.total { background: #f0fdf4; font-size: 13px; font-weight: 800; color: #059669; border-radius: 6px; border: 1px solid #bbf7d0; margin-top: 4px; padding: 8px; }
        
        .pw-pass { font-family: monospace; letter-spacing: .05em; color: #64748b; font-size: 12px; }
      `}</style>
    </div>
  );
}

function Widget({ title, icon: Icon, color, children, headerAction, colSpan = '' }: any) {
  return (
    <div className={`widget-card ${colSpan} min-w-0`}>
      <div className="widget-header">
        <div className="flex items-center">
          <div className={`widget-header-icon ${color}`}>
            <Icon size={14} />
          </div>
          <span className="widget-title">{title}</span>
        </div>
        {headerAction}
      </div>
      <div className="widget-body">
        {children}
      </div>
    </div>
  );
}
