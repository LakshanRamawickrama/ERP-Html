'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  FileText, 
  Receipt, 
  Landmark, 
  HandCoins, 
  ShieldCheck, 
  Coins, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Plus,
  Maximize2,
  Minimize2,
  Edit,
  Trash2,
  Download,
  Eye,
  CreditCard,
  FileSearch,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

type TabType = 'records' | 'invoices' | 'bank' | 'loans' | 'insurance' | 'tax' | 'dojo';

export default function AccountingModule() {
  const [activeTab, setActiveTab] = useState<TabType>('records');
  const [isWide, setIsWide] = useState(false);
  const [recordCategory, setRecordCategory] = useState('');

  const tabs = [
    { id: 'records', label: 'Financial Records', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'bank', label: 'Bank Details', icon: Landmark },
    { id: 'loans', label: 'Loans', icon: HandCoins },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
    { id: 'tax', label: 'VAT / Tax', icon: Coins },
    { id: 'dojo', label: 'Dojo Settlements', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Module Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Accounting Module</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Financial Ecosystem & Ledger Management</p>
          </div>
          <div className="flex gap-3">
             <Pill type="income" label="Total Income" value="$12,450.00" />
             <Pill type="expense" label="Total Expenses" value="$8,320.00" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id 
                ? 'border-slate-800 text-slate-800' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-slate-800' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsWide(!isWide)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider shadow-sm"
        >
          {isWide ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          {isWide ? 'Standard' : 'Wide'} View
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && (
            <div className="lg:col-span-4">
              <Card 
                title={
                  activeTab === 'records' ? 'New Financial Record' :
                  activeTab === 'invoices' ? 'Create Invoice' :
                  activeTab === 'bank' ? 'Add Bank Account' :
                  activeTab === 'loans' ? 'New Loan Entry' :
                  activeTab === 'insurance' ? 'Register Policy' :
                  activeTab === 'tax' ? 'Tax Filing' : 'Log Settlement'
                } 
                icon={Plus} 
                iconColor="bg-slate-800"
              >
                <form className="space-y-4">
                  {activeTab === 'records' && (
                    <>
                      <Field label="Record Title" placeholder="e.g. Monthly Rent Payment" />
                      <Field 
                        label="Category" 
                        isSelect 
                        options={['Supplier Payments', 'Rent', 'Mortgage', 'Accountant Fees', 'Bank Charges', 'Insurance', 'VAT / Tax']} 
                        onChange={(e: any) => setRecordCategory(e.target.value)}
                      />
                      {recordCategory === 'Supplier Payments' && <Field label="Supplier" isSelect options={['Global Supplies Ltd', 'Tech Connect Inc', 'Office Depot']} />}
                      {recordCategory === 'Rent' && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Term Start" type="date" />
                          <Field label="Term End" type="date" />
                        </div>
                      )}
                      {recordCategory === 'Mortgage' && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Paying Mode" isSelect options={['Monthly', 'Quarterly', 'Annually']} />
                          <Field label="Interest Rate (%)" type="number" step="0.01" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Type" isSelect options={['Expense', 'Income']} />
                        <Field label="Amount ($)" type="number" step="0.01" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Payment Status" isSelect options={['Paid', 'Pending', 'Overdue']} />
                        <Field label="Date" type="date" />
                      </div>
                      <Field label="Upload Document" type="file" />
                      <Field label="Notes" isTextArea placeholder="Add any internal remarks..." />
                    </>
                  )}

                  {activeTab === 'invoices' && (
                    <>
                      <Field label="Client Name" placeholder="e.g. Alpha Trading Co." />
                      <Field label="Invoice Number" placeholder="INV-2026-001" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Amount ($)" type="number" step="0.01" />
                        <Field label="Due Date" type="date" />
                      </div>
                      <Field label="Status" isSelect options={['Sent', 'Paid', 'Overdue', 'Cancelled']} />
                      <Field label="Attach PDF" type="file" />
                      <Field label="Internal Notes" isTextArea />
                    </>
                  )}

                  {activeTab === 'bank' && (
                    <>
                      <Field label="Bank Name" placeholder="e.g. Business Central Bank" />
                      <Field label="Account Name" placeholder="Full legal name" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Account Number" />
                        <Field label="Sort Code" placeholder="00-00-00" />
                      </div>
                      <Field label="Type" isSelect options={['Business Current', 'Business Savings', 'Merchant Account', 'Corporate Card', 'Petty Cash']} />
                      <Field label="IBAN (Optional)" />
                      <Field label="Status" isSelect options={['Active', 'Inactive']} />
                    </>
                  )}

                  {activeTab === 'loans' && (
                    <>
                      <Field label="Loan Name / Type" placeholder="e.g. Growth Loan" />
                      <Field label="Lender" placeholder="Bank or Institution" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Total Amount ($)" type="number" />
                        <Field label="Outstanding ($)" type="number" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Monthly Payment ($)" type="number" />
                        <Field label="Interest Rate (%)" type="number" step="0.01" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" type="date" />
                        <Field label="End Date" type="date" />
                      </div>
                      <Field label="Status" isSelect options={['Active', 'Pending', 'Paid Off', 'Defaulted']} />
                    </>
                  )}

                  {activeTab === 'insurance' && (
                    <>
                      <Field label="Insurance Type" placeholder="e.g. Public Liability" />
                      <Field label="Provider Name" />
                      <Field label="Policy Number" />
                      <Field label="Premium Amount ($)" type="number" step="0.01" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" type="date" />
                        <Field label="Expiry Date" type="date" />
                      </div>
                      <Field label="Renewal Reminder" isSelect options={['30 Days Before', '15 Days Before', '7 Days Before']} />
                    </>
                  )}

                  {activeTab === 'tax' && (
                    <>
                      <Field label="Tax Type" placeholder="e.g. VAT Q1 2024" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Period Start" type="date" />
                        <Field label="Period End" type="date" />
                      </div>
                      <Field label="Tax Amount ($)" type="number" step="0.01" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Filing Date" type="date" />
                        <Field label="Payment Due" type="date" />
                      </div>
                      <Field label="Status" isSelect options={['Draft', 'Filed', 'Paid', 'Overdue']} />
                    </>
                  )}

                  {activeTab === 'dojo' && (
                    <>
                      <Field label="Transaction Date" type="date" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Amount ($)" type="number" step="0.01" />
                        <Field label="Fee ($)" type="number" step="0.01" />
                      </div>
                      <Field label="Net Amount ($)" type="number" disabled placeholder="Calculated automatically" />
                      <Field label="Payment Method" isSelect options={['Card', 'Digital Wallet']} />
                      <Field label="Settlement Date" type="date" />
                      <Field label="Status" isSelect options={['Paid', 'Pending', 'Overdue']} />
                    </>
                  )}

                  <button className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all transform active:scale-[0.98]">
                    {activeTab === 'invoices' ? 'Generate Invoice' : 'Save Record'}
                  </button>
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card 
              title={
                activeTab === 'records' ? 'Transaction History' :
                activeTab === 'invoices' ? 'Invoices Registry' :
                activeTab === 'bank' ? 'Bank Accounts Registry' :
                activeTab === 'loans' ? 'Loan Monitoring' :
                activeTab === 'insurance' ? 'Policies Registry' :
                activeTab === 'tax' ? 'Tax Registry' : 'Settlement Registry'
              } 
              icon={activeTab === 'records' ? FileText : activeTab === 'invoices' ? Receipt : activeTab === 'bank' ? Landmark : activeTab === 'dojo' ? CreditCard : FileSearch}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {activeTab === 'records' && (
                        <>
                          <th className={thClass}>Date</th>
                          <th className={thClass}>Title / Detail</th>
                          <th className={thClass}>Category</th>
                          <th className={thClass}>Amount</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'invoices' && (
                        <>
                          <th className={thClass}>Inv #</th>
                          <th className={thClass}>Client</th>
                          <th className={thClass}>Amount</th>
                          <th className={thClass}>Due Date</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'bank' && (
                        <>
                          <th className={thClass}>Bank / Acc Name</th>
                          <th className={thClass}>Acc / Sort</th>
                          <th className={thClass}>Type</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'loans' && (
                        <>
                          <th className={thClass}>Loan / Lender</th>
                          <th className={thClass}>Total / O/S</th>
                          <th className={thClass}>Monthly / Rate</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'insurance' && (
                        <>
                          <th className={thClass}>Type / Provider</th>
                          <th className={thClass}>Policy #</th>
                          <th className={thClass}>Premium</th>
                          <th className={thClass}>Expiry</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'tax' && (
                        <>
                          <th className={thClass}>Tax Type / Period</th>
                          <th className={thClass}>Amount</th>
                          <th className={thClass}>Filing Date</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'dojo' && (
                        <>
                          <th className={thClass}>Trans Date</th>
                          <th className={thClass}>Amount</th>
                          <th className={thClass}>Fee</th>
                          <th className={thClass}>Net</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'records' && (
                      <RecordRow date="2026-04-01" title="HQ Office Rent" sub="Rent (Apr 2026 - Mar 2027)" category="Expense" amount="-$2,500.00" status="Paid" />
                    )}
                    {activeTab === 'invoices' && (
                      <InvoiceRow num="INV-2026-001" client="Alpha Trading Co." amount="$5,000.00" due="2026-04-30" status="Paid" />
                    )}
                    {activeTab === 'bank' && (
                      <BankRow bank="Business Central Bank" acc="LAKSHAN RAMAWICKRAMA ERP" num="88776655" sort="00-11-22" type="Business Current" status="Active" />
                    )}
                    {activeTab === 'loans' && (
                      <LoanRow loan="SME Growth Loan" lender="BC Bank" total="$50,000" os="$32,450" monthly="$1,200" rate="5.2%" status="Active" />
                    )}
                    {activeTab === 'dojo' && (
                      <DojoRow date="2026-04-30" amount="$1,000.00" fee="$17.50" net="$982.50" status="Paid" />
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

function Pill({ type, label, value }: { type: 'income' | 'expense', label: string, value: string }) {
  const isIncome = type === 'income';
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
      isIncome ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
    }`}>
      {isIncome ? <ArrowDownCircle className="w-3.5 h-3.5" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
      <span className="text-[10px] font-bold">
        {label}: <span className="font-extrabold">{value}</span>
      </span>
    </div>
  );
}

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, onChange, disabled }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <select onChange={onChange} className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium">
          <option value="">Select Option...</option>
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea rows={2} className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" placeholder={placeholder} />
      ) : (
        <input disabled={disabled} type={type} className={`w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder={placeholder} />
      )}
    </div>
  );
}

function RecordRow({ date, title, sub, category, amount, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 text-slate-500 font-mono tracking-tighter text-xs">{date}</td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{title}</div>
        <div className="text-[10px] text-slate-400 font-medium">{sub}</div>
      </td>
      <td className="px-4 py-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${category === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{category}</span>
      </td>
      <td className="px-4 py-4 font-bold text-slate-800">{amount}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions /></td>
    </tr>
  );
}

function InvoiceRow({ num, client, amount, due, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 font-bold text-slate-800">{num}</td>
      <td className="px-4 py-4 text-slate-600 font-medium">{client}</td>
      <td className="px-4 py-4 font-bold text-slate-800">{amount}</td>
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">{due}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions showDownload /></td>
    </tr>
  );
}

function BankRow({ bank, acc, num, sort, type, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{bank}</div>
        <div className="text-[10px] text-slate-400 font-medium">{acc}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-mono text-slate-600 text-xs">{num}</div>
        <div className="text-[10px] text-slate-400 font-medium">{sort}</div>
      </td>
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">{type}</span>
      </td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions /></td>
    </tr>
  );
}

function LoanRow({ loan, lender, total, os, monthly, rate, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{loan}</div>
        <div className="text-[10px] text-slate-400 font-medium">{lender}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">{total}</div>
        <div className="text-[10px] text-red-500 font-bold">O/S: {os}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">{monthly}</div>
        <div className="text-[10px] text-slate-400 font-medium">{rate} APR</div>
      </td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions /></td>
    </tr>
  );
}

function DojoRow({ date, amount, fee, net, status }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">{date}</td>
      <td className="px-4 py-4 font-bold text-slate-800">{amount}</td>
      <td className="px-4 py-4 text-red-500 font-medium">{fee}</td>
      <td className="px-4 py-4 font-extrabold text-slate-800">{net}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions showEye /></td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === 'Paid' || status === 'Active';
  const isPending = status === 'Pending' || status === 'Sent' || status === 'Filed';
  const isOverdue = status === 'Overdue' || status === 'Defaulted';
  
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
      isPaid ? 'bg-emerald-50 text-emerald-600' : 
      isPending ? 'bg-amber-50 text-amber-600' : 
      'bg-red-50 text-red-600'
    }`}>
      {status}
    </span>
  );
}

function RowActions({ showDownload, showEye }: any) {
  return (
    <div className="flex gap-2">
      <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
        <Edit className="w-3.5 h-3.5" />
      </button>
      {showEye && (
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
          <Eye className="w-3.5 h-3.5" />
        </button>
      )}
      {showDownload && (
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
          <Download className="w-3.5 h-3.5" />
        </button>
      )}
      <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
