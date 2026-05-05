'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import ProfileDrawer from '@/components/layouts/ProfileDrawer';
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
  Circle
} from 'lucide-react';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(savedUser);
    setUser(userData);
    setUserRole(userData.role as UserRole);
  }, [router]);

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
        {/* Topbar */}
        <header className="bg-white border-b border-[#e2e8f0] px-6 py-2.5 flex items-center justify-between shadow-sm flex-shrink-0">
          <h5 className="text-[16px] font-bold text-[#1e293b] m-0 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-[#3b82f6]" />
            <span id="mainTitleText">{userRole === UserRole.SUPER_ADMIN ? 'Super Admin Dashboard' : 'Admin Dashboard'}</span>
          </h5>

          <div className="relative flex-1 max-w-[400px] mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94a3b8]" />
            <input 
              type="text" 
              placeholder="Search businesses, users, fleet or reports..." 
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg py-1.5 pl-9 pr-3 text-[13px] outline-none focus:bg-white focus:border-[#3b82f6] transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-1.5 rounded-lg border border-[#e2e8f0]">
              <label className="text-[12px] font-medium text-[#64748b] m-0">Organization</label>
              <select className="bg-transparent text-[13px] font-bold text-[#1e293b] outline-none border-none cursor-pointer pr-1">
                <option>All Entities</option>
                <option>Alpha Trading Co.</option>
                <option>Beta Logistics Ltd.</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
            </div>
            
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white text-[11px] font-bold shadow-lg hover:scale-105 transition-transform border-2 border-white overflow-hidden"
            >
              {user.photo ? (
                <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'SA'
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-[0.75rem_0.75rem_1.5rem] scrollbar-custom bg-[#f1f5f9]/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            
            {/* 1. BUSINESS DETAILS (SUPER_ADMIN ONLY) */}
            {userRole === UserRole.SUPER_ADMIN && (
              <Widget title="Business Details" icon={Briefcase} color="bg-[#3b82f6]">
                <table className="wt" style={{ tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '30px' }}>#</th>
                      <th className="text-left">BUSINESS NAME</th>
                      <th style={{ width: '70px' }}>INCOME</th>
                      <th style={{ width: '70px' }}>EXPENSES</th>
                      <th style={{ width: '45px' }}>SKUS</th>
                      <th style={{ width: '45px' }}>FLEET</th>
                      <th className="text-center" style={{ width: '80px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, name: 'Alpha Trading Co.', slug: 'alpha-trading', inc: '$125,400', exp: '$42,100', skus: '1,240', flt: 12, st: 'Active' },
                      { id: 2, name: 'Beta Logistics Ltd.', slug: 'beta-logistics', inc: '$84,200', exp: '$31,500', skus: '450', flt: 24, st: 'Active' },
                      { id: 3, name: 'Whiterock Retail Ltd.', slug: 'whiterock-retail', inc: '$210,500', exp: '$98,400', skus: '3,800', flt: 4, st: 'Active' },
                      { id: 4, name: 'Zenith Logistics Hub', slug: 'zenith-logistics', inc: '$15,000', exp: '$2,000', skus: '120', flt: 0, st: 'Pending' },
                      { id: 5, name: 'Prime Supplies UK', slug: 'prime-supplies', inc: '$58,000', exp: '$12,800', skus: '6,200', flt: 2, st: 'Active' },
                      { id: 6, name: 'Global Logistics Partners', slug: 'global-logistics', inc: '$92,300', exp: '$28,500', skus: '1,100', flt: 35, st: 'Active' },
                      { id: 7, name: 'Smart Solutions Ltd.', slug: 'smart-solutions', inc: '$45,000', exp: '$12,000', skus: '850', flt: 3, st: 'Active' },
                      { id: 8, name: 'Ocean View Exports', slug: 'ocean-view', inc: '$112,000', exp: '$45,600', skus: '2,400', flt: 8, st: 'Active' },
                      { id: 9, name: 'TechConnect Inc.', slug: 'techconnect', inc: '$38,500', exp: '$15,200', skus: '320', flt: 1, st: 'Suspended' },
                      { id: 10, name: 'Consulting Ltd.', slug: 'consulting-ltd', inc: '$12,400', exp: '$4,100', skus: '15', flt: 0, st: 'Active' },
                    ].map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td className="truncate">
                          <Link 
                            href={`/business/${row.slug}`}
                            className="font-bold text-[#1e293b] hover:text-[#3b82f6] transition-colors cursor-pointer"
                          >
                            {row.name}
                          </Link>
                        </td>
                        <td className="text-[#198754] font-bold">{row.inc}</td>
                        <td className="text-[#dc3545]">{row.exp}</td>
                        <td>{row.skus}</td>
                        <td>{row.flt}</td>
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
                  {[
                    { v: 'CAR 1', p: 'ABC-1234', i: '2026-06-15', s: 'Active' },
                    { v: 'VAN 2', p: 'DEF-5678', i: '2026-05-03', s: 'Active' },
                    { v: 'TRK-007', p: 'GHI-9012', i: '2026-05-06', s: 'Maint' },
                    { v: 'CAR 2', p: 'WP-BC-5678', i: '2026-12-01', s: 'Active' },
                    { v: 'VAN-002', p: 'JKL-3456', i: '2026-05-04', s: 'Active' },
                    { v: 'TRK-010', p: 'MNO-7890', i: '2026-07-12', s: 'Active' },
                    { v: 'VAN-005', p: 'PQR-1234', i: '2026-05-20', s: 'Repair' },
                    { v: 'CAR-003', p: 'STU-5678', i: '2026-11-30', s: 'Active' },
                    { v: 'TRK-022', p: 'VWX-9012', i: '2026-05-01', s: 'Impound' },
                    { v: 'VAN-011', p: 'YZA-3456', i: '2026-08-15', s: 'Active' },
                  ].map((row, i) => (
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
                {[
                  'Renew trade licence before May 20 — contact City Planning Dept',
                  'TRK-007 and VAN-002 insurance both expiring this month — call broker',
                  'Follow up with Global Logistics regarding the pending PO-501 shipment',
                  'Prepare Q2 financial summary for the board meeting next Tuesday',
                  'Verify inventory levels for high-demand SKUs in Whiterock Retail',
                ].map((note, i) => (
                  <div key={i} className="bg-[#fffbeb] border border-[#fef3c7] rounded-lg p-2 relative group shadow-sm">
                    <p className="text-[11px] text-[#1e293b] leading-[1.3] m-0 pr-5">{note}</p>
                    <button className="absolute right-1.5 top-2 text-[#ef4444] opacity-20 group-hover:opacity-100 transition-all"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
                <div className="space-y-2 pt-1">
                  <textarea placeholder="Write a note..." className="w-full text-[11px] p-2 border border-[#e2e8f0] rounded-lg outline-none focus:border-[#4f46e5] min-h-[40px] resize-none" />
                  <button className="w-full bg-[#ffc107] text-[#212529] py-1.5 rounded-lg text-[11px] font-bold shadow-sm hover:bg-[#eab308]">
                    + Add Note
                  </button>
                </div>
              </div>
            </Widget>

            {/* 4. EMAILS (SUPER_ADMIN ONLY) */}
            {userRole === UserRole.SUPER_ADMIN && (
              <Widget title="Gmails / Emails" icon={Mail} color="bg-[#ef4444]" headerAction={<button className="text-[10px] bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] px-2 py-0.5 rounded font-bold hover:bg-[#bfdbfe]">Add Email</button>}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#4f46e5] text-white flex items-center justify-center text-[12px] font-bold"><Mail size={14} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-[#1e293b] truncate">admin@company.com</div>
                      <div className="text-[9px] text-[#64748b]">Primary Account</div>
                    </div>
                    <span className="px-2 py-0.5 bg-[#198754] text-white text-[9px] font-bold rounded">Connected</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#ea4335] text-white flex items-center justify-center text-[12px] font-bold"><Mail size={14} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-[#1e293b] truncate">support@company.com</div>
                      <div className="text-[9px] text-[#64748b]">Support Inbox</div>
                    </div>
                    <span className="px-2 py-0.5 bg-[#198754] text-white text-[9px] font-bold rounded">Connected</span>
                  </div>
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
                  <tr>
                    <td>Corporation Tax 2025</td>
                    <td>Jan–Dec 2025</td>
                    <td><strong>$15,450</strong></td>
                    <td className="text-center"><span className="status-pill bg-[#198754]">Paid</span></td>
                  </tr>
                  <tr>
                    <td>VAT Q1 2026</td>
                    <td>Jan–Mar 2026</td>
                    <td><strong>$8,320</strong></td>
                    <td className="text-center"><span className="status-pill bg-[#f59e0b]">Filed</span></td>
                  </tr>
                  <tr>
                    <td>VAT Q2 2026</td>
                    <td>Apr–Jun 2026</td>
                    <td><strong>$0</strong></td>
                    <td className="text-center"><span className="status-pill bg-[#6c757d]">Draft</span></td>
                  </tr>
                </tbody>
              </table>
            </Widget>

            {/* 6. TO-DO LIST */}
            <Widget title="To-Do List" icon={ListTodo} color="bg-[#8b5cf6]">
              <div className="space-y-1">
                {[
                  { t: 'Renew TRK-007 insurance', d: true },
                  { t: 'File VAT Q2 2026', d: false },
                  { t: 'Review supplier PO-2026-503 overdue', d: false },
                  { t: 'Update GDPR compliance cert', d: true },
                ].map((todo, i) => (
                  <div key={i} className="flex items-center gap-2 py-1 border-b border-[#f1f5f9] last:border-0 group">
                    <input type="checkbox" defaultChecked={todo.d} className="w-[14px] h-[14px] accent-[#4f46e5] cursor-pointer" />
                    <label className={`text-[11px] flex-1 cursor-pointer m-0 truncate ${todo.d ? 'text-[#94a3b8] line-through' : 'text-[#1e293b]'}`}>{todo.t}</label>
                    <button className="opacity-0 group-hover:opacity-100 text-[#ef4444]"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input type="text" placeholder="Add task..." className="flex-1 text-[11px] p-1.5 border border-[#e2e8f0] rounded-lg outline-none focus:border-[#4f46e5]" />
                  <button className="bg-[#3b82f6] text-white px-3 py-1 rounded-lg text-[11px] font-bold shadow-sm hover:bg-[#2563eb]">+ Add</button>
                </div>
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
                    {[
                      { s: 'HMRC Online', u: 'admin@businesscentral.com' },
                      { s: 'Companies House', u: 'john.smith@bc.com' },
                      { s: 'Allianz Portal', u: 'insurance@bc.com' },
                    ].map((pw, i) => (
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
                <div className="pl-row"><span className="flex items-center gap-2"><Circle className="w-1.5 h-1.5 fill-[#198754] text-[#198754]" /> Total Income</span><strong className="text-[#198754]">$482,800</strong></div>
                <div className="pl-row"><span className="flex items-center gap-2"><Circle className="w-1.5 h-1.5 fill-[#dc3545] text-[#dc3545]" /> Total Expenses</span><strong className="text-[#dc3545]">$237,585</strong></div>
                <div className="pl-row divider font-bold"><span>Gross Profit</span><strong>$245,215</strong></div>
                <div className="pl-row"><span className="flex items-center gap-2"><Circle className="w-1.5 h-1.5 fill-[#f59e0b] text-[#f59e0b]" /> Tax (20%)</span><strong className="text-[#f59e0b]">$49,043</strong></div>
                <div className="pl-row total"><span className="flex items-center gap-2"><Star className="w-3 h-3 fill-[#059669]" /> Net Profit</span><strong>$196,172</strong></div>
              </div>
            </Widget>

            {/* 9. SUPPLIER PAYMENTS */}
            <Widget title="Supplier Payments" icon={ShoppingCart} color="bg-[#f59e0b]">
               <table className="wt">
                <thead>
                  <tr>
                    <th className="text-left">PO #</th>
                    <th className="text-left">SUPPLIER</th>
                    <th className="text-left">AMOUNT</th>
                    <th className="text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { p: 'PO-2026-501', s: 'Prime Office', a: '$450', st: 'Pending' },
                    { p: 'PO-2026-502', s: 'Global Logistics', a: '$1,800', st: 'Paid' },
                    { p: 'PO-2026-503', s: 'TechConnect', a: '$2,750', st: 'Overdue' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td><strong>{row.p}</strong></td>
                      <td className="truncate">{row.s}</td>
                      <td><strong>{row.a}</strong></td>
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
                    <th className="text-left">AMOUNT</th>
                    <th className="text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { i: 'INV-2026-001', c: 'Alpha Trading', a: '$5,000', s: 'Paid' },
                    { i: 'INV-2026-002', c: 'Consulting Ltd', a: '$1,200', s: 'Sent' },
                    { i: 'INV-2026-003', c: 'Beta Logistics', a: '$3,800', s: 'Overdue' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td><strong>{row.i}</strong></td>
                      <td className="truncate">{row.c}</td>
                      <td><strong>{row.a}</strong></td>
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
                  {[
                    { b: 'BC Bank', n: 'LAKSHAN RAMAWICKRAMA', bl: '$142,350' },
                    { b: 'Barclays', n: 'Alpha Trading Co.', bl: '$58,200' },
                    { b: 'HSBC', n: 'Beta Logistics Ltd.', bl: '$23,750' },
                  ].map((row, i) => (
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
                  {[
                    { a: 'Office HVAC', p: 'Urgent', s: 'Pending' },
                    { a: 'Elevator A', p: 'Medium', s: 'Scheduled' },
                    { a: 'Van 2', p: 'Urgent', s: 'In Progress' },
                  ].map((row, i) => (
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
                  {[
                    { i: 'Sugar 1kg', c: 5, s: 'Reorder' },
                    { i: 'Notebook A4', c: 0, s: 'Out of Stock' },
                    { i: 'Milk 1L', c: 150, s: 'Good' },
                  ].map((row, i) => (
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
                  {[
                    { t: '2m', a: 'Admin updated VAT Q1 to Filed.' },
                    { t: '15m', a: 'John created user Sarah.' },
                    { t: '1h', a: 'Backup successful.' },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <span className="text-[#94a3b8] whitespace-nowrap">{act.t}</span>
                      <span className="text-[#1e293b] leading-[1.3] truncate">{act.a}</span>
                    </div>
                  ))}
                </div>
              </Widget>
            )}

            {/* 15. UPCOMING RENEWALS */}
            <Widget title="Upcoming Renewals" icon={CalendarClock} color="bg-[#8b5cf6]">
               <table className="wt">
                <thead>
                  <tr>
                    <th className="text-left">ENTITY</th>
                    <th className="text-right">DUE</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { e: 'Alpha Trading', d: '3 Days', u: true },
                    { e: 'TRK-007 (Fleet)', d: '12 Days' },
                    { e: 'Main Hub Retail', d: '28 Days' },
                  ].map((row, i) => (
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
