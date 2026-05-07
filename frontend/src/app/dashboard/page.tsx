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
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dash, setDash] = useState<any>({
    businesses: [], fleet: [], notes: [], vat: [], todos: [],
    passwords: [], supplierPayments: [], sales: [], banks: [],
    maintenance: [], lowStock: [], activity: [], renewals: [],
    pl: { income: '$0', expenses: '$0', grossProfit: '$0', tax: '$0', netProfit: '$0' },
    emails: []
  });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState({ email: '', label: '', type: 'primary', password: '' });
  const [noteInput, setNoteInput] = useState('');
  const [todoInput, setTodoInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { router.push('/login'); return; }
    const userData = JSON.parse(savedUser);
    setUser(userData);
    setUserRole(userData.role as UserRole);
    
    const token = localStorage.getItem('token');
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
    fetch(API_ENDPOINTS.EMAILS, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ ...newEmail, status: 'Connected' }),
    })
      .then(res => res.json())
      .then(saved => {
        setDash((prev: any) => ({ ...prev, emails: [saved, ...prev.emails] }));
        setNewEmail({ email: '', label: '', type: 'primary', password: '' });
        setShowEmailModal(false);
      })
      .catch(() => {
        setNewEmail({ email: '', label: '', type: 'primary', password: '' });
        setShowEmailModal(false);
      });
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
      body: JSON.stringify({ text: noteInput }),
    })
      .then(res => res.json())
      .then(saved => {
        setDash((prev: any) => ({ ...prev, notes: [saved, ...prev.notes] }));
        setNoteInput('');
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
          businesses={dash.businesses}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-[0.75rem_0.75rem_1.5rem] scrollbar-custom bg-[#f1f5f9]/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            
            {/* 1. BUSINESS DETAILS (SUPER_ADMIN ONLY) */}
            {userRole === UserRole.SUPER_ADMIN && (
              <Widget title="Business Details" icon={Briefcase} color="bg-[#3b82f6]">
                <table className="wt">
                  <thead>
                    <tr>
                      <th className="text-left">BUSINESS NAME</th>
                      <th className="text-right" style={{ width: '100px' }}>INCOME</th>
                      <th className="text-right" style={{ width: '100px' }}>EXPENSES</th>
                      <th className="text-center" style={{ width: '100px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.businesses.map((row: any) => (
                      <tr key={row.id}>
                        <td className="truncate">
                          <Link 
                            href={`/business/${row.slug}`}
                            className="font-bold text-[#1e293b] hover:text-[#3b82f6] transition-colors cursor-pointer"
                          >
                            {row.name}
                          </Link>
                        </td>
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
            <Widget title="Fleet Management" icon={Truck} color="bg-[#14b8a6]">
              <table className="wt">
                <thead>
                  <tr>
                    <th className="text-left">VEHICLE</th>
                    <th className="text-left">PLATE</th>
                    <th className="text-left">INS. EXPIRY</th>
                    <th className="text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.fleet.map((row: any, i: number) => (
                    <tr key={i}>
                      <td><strong>{row.v}</strong></td>
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
            </Widget>

            {/* 3. NOTES */}
            <Widget title="Notes" icon={FileText} color="bg-[#f59e0b]">
              <div className="space-y-2">
                {dash.notes.map((note: any) => (
                  <div key={note.id} className="bg-[#fffbeb] border border-[#fef3c7] rounded-lg p-2 relative group shadow-sm">
                    <p className="text-[11px] text-[#1e293b] leading-[1.3] m-0 pr-5">{note.text}</p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute right-1.5 top-2 text-[#ef4444] opacity-20 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
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

            {/* 4. EMAILS (SUPER_ADMIN ONLY) */}
            {userRole === UserRole.SUPER_ADMIN && (
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
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Connect New Inbox</label>
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
                            Save Account
                          </button>
                          <button 
                            onClick={() => setShowEmailModal(false)}
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
                            <div className="text-[11px] font-bold text-[#1e293b] truncate">{email.email}</div>
                            <div className="text-[9px] text-[#64748b]">{email.label}</div>
                          </div>
                          <span className="px-2 py-0.5 bg-[#198754] text-white text-[9px] font-bold rounded">{email.status}</span>
                          <button onClick={() => handleDeleteEmail(email.id)} className="text-[#ef4444] opacity-0 group-hover:opacity-100 transition-all ml-1"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Widget>
            )}

            {/* 5. VAT / TAX */}
            <Widget title="VAT / Tax" icon={Receipt} color="bg-[#f59e0b]">
              <table className="wt">
                <thead>
                  <tr>
                    <th className="text-left">TYPE</th>
                    <th className="text-left">PERIOD</th>
                    <th className="text-left">AMOUNT</th>
                    <th className="text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.vat.map((r: any, i: number) => (
                    <tr key={i}>
                      <td>{r.type}</td>
                      <td>{r.period}</td>
                      <td><strong>{r.amount}</strong></td>
                      <td className="text-center"><span className={`status-pill ${r.status === 'Paid' ? 'bg-[#198754]' : r.status === 'Filed' ? 'bg-[#f59e0b]' : 'bg-[#6c757d]'}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Widget>

            {/* 6. SYSTEM REMINDERS */}
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
                {(dash.reminders || []).slice(0, 4).map((reminder: any) => (
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

            {/* 7. PASSWORD VAULT (SUPER_ADMIN ONLY) */}
            {userRole === UserRole.SUPER_ADMIN && (
              <Widget title="Password Vault" icon={Lock} color="bg-[#8b5cf6]">
                <table className="wt">
                  <thead>
                    <tr>
                      <th className="text-left">SITE</th>
                      <th className="text-left">USERNAME</th>
                      <th className="text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.passwords.map((pw: any, i: number) => (
                      <tr key={i}>
                        <td className="truncate">{pw.s}</td>
                        <td className="truncate">{pw.u}</td>
                        <td className="text-center"><button className="text-[#64748b] hover:text-[#4f46e5]"><Eye size={12} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Widget>
            )}

            {/* 8. PROFIT & LOSS */}
            <Widget title="Profit & Loss Statement" icon={PieChart} color="bg-[#10b981]">
              <div className="space-y-1">
                <div className="pl-row"><span className="flex items-center gap-2"><Circle className="w-1.5 h-1.5 fill-[#198754] text-[#198754]" /> Total Income</span><strong className="text-[#198754]">{dash.pl.income}</strong></div>
                <div className="pl-row"><span className="flex items-center gap-2"><Circle className="w-1.5 h-1.5 fill-[#dc3545] text-[#dc3545]" /> Total Expenses</span><strong className="text-[#dc3545]">{dash.pl.expenses}</strong></div>
                <div className="pl-row divider font-bold"><span>Gross Profit</span><strong>{dash.pl.grossProfit}</strong></div>
                <div className="pl-row"><span className="flex items-center gap-2"><Circle className="w-1.5 h-1.5 fill-[#f59e0b] text-[#f59e0b]" /> Tax (20%)</span><strong className="text-[#f59e0b]">{dash.pl.tax}</strong></div>
                <div className="pl-row total"><span className="flex items-center gap-2"><Star className="w-3 h-3 fill-[#059669]" /> Net Profit</span><strong>{dash.pl.netProfit}</strong></div>
              </div>
            </Widget>

            {/* 9. SUPPLIER PAYMENTS */}
            <Widget title="Supplier Payments" icon={ShoppingCart} color="bg-[#f59e0b]">
               <table className="wt">
                <thead>
                  <tr>
                    <th className="text-left">PO #</th>
                    <th className="text-left">SUPPLIER</th>
                    <th className="text-right">AMOUNT</th>
                    <th className="text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.supplierPayments.map((row: any, i: number) => (
                    <tr key={i}>
                      <td><strong>{row.p}</strong></td>
                      <td className="truncate">{row.s}</td>
                      <td className="text-right"><strong>{row.a}</strong></td>
                      <td className="text-center">
                        <span className={`status-pill ${row.st === 'Paid' ? 'bg-[#198754]' : row.st === 'Overdue' ? 'bg-[#dc3545]' : 'bg-[#ffc107]'}`}>
                          {row.st}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Widget>

            {/* 10. SALES REPORT */}
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

            {/* 11. BANK ACCOUNTS */}
            <Widget title="Bank Accounts" icon={Building2} color="bg-[#10b981]">
               <table className="wt">
                <thead>
                  <tr>
                    <th className="text-left">BANK</th>
                    <th className="text-left">ACCOUNT NAME</th>
                    <th className="text-left">BALANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.banks.map((row: any, i: number) => (
                    <tr key={i}>
                      <td><strong>{row.b}</strong></td>
                      <td className="truncate">{row.n}</td>
                      <td><strong className="text-[#198754]">{row.bl}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Widget>

            {/* 12. MAINTENANCE REQUESTS */}
            <Widget title="Maintenance" icon={Hammer} color="bg-[#ef4444]">
               <table className="wt">
                <thead>
                  <tr>
                    <th className="text-left">ASSET</th>
                    <th className="text-left">PRIORITY</th>
                    <th className="text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.maintenance.map((row: any, i: number) => (
                    <tr key={i}>
                      <td className="truncate">{row.a}</td>
                      <td><span className={`status-pill ${row.p === 'Urgent' ? 'bg-[#dc3545]' : 'bg-[#f59e0b]'}`}>{row.p}</span></td>
                      <td className="text-center text-slate-500">{row.s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Widget>

            {/* 13. LOW STOCK ALERTS */}
            <Widget title="Low Stock" icon={AlertTriangle} color="bg-[#f59e0b]">
               <table className="wt">
                <thead>
                  <tr>
                    <th className="text-left">ITEM</th>
                    <th className="text-left">CUR.</th>
                    <th className="text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.lowStock.map((row: any, i: number) => (
                    <tr key={i}>
                      <td className="truncate">{row.i}</td>
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
            </Widget>

            {/* 14. RECENT SYSTEM ACTIVITY (SUPER_ADMIN ONLY) */}
            {userRole === UserRole.SUPER_ADMIN && (
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

            {/* 15. UPCOMING RENEWALS */}
            <Widget 
              title="Upcoming Renewals" 
              icon={CalendarClock} 
              color="bg-[#8b5cf6]"
              headerAction={
                <Link href="/reminders" className="text-[9px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
                  View Schedule <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              }
            >
               <table className="wt">
                <thead>
                  <tr>
                    <th className="text-left">ENTITY</th>
                    <th className="text-right">DUE</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.renewals.map((row: any, i: number) => (
                    <tr key={i}>
                      <td className="truncate font-medium text-[#1e293b]">{row.e}</td>
                      <td className={`text-right font-bold ${row.u ? 'text-[#dc3545]' : 'text-slate-700'}`}>{row.d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Widget>

          </div>
        </div>
      </main>

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
