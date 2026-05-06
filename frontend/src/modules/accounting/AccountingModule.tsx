'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
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
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';


type TabType = 'records' | 'invoices' | 'bank' | 'loans' | 'insurance' | 'tax' | 'dojo';

export default function AccountingModule() {
  const [activeTab, setActiveTab] = useState<TabType>('records');
  const [isWide, setIsWide] = useState(false);
  const [recordCategory, setRecordCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  const [data, setData] = useState<any>({ history: [], invoices: [], banks: [], loans: [], dojo: [], insurance: [], vat: [] });

  React.useEffect(() => {
    fetch(API_ENDPOINTS.ACCOUNTING).then(res => res.json()).then(setData);
  }, []);

  const handleEdit = (id: string, rowData: any, tab: TabType) => {
    setEditingId(id);
    setFormData(rowData);
    setActiveTab(tab);
    if (tab === 'records' && rowData.category) {
      setRecordCategory(rowData.category);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
    setRecordCategory('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      console.log('Updating record:', editingId, formData);
      // TODO: API call to update
    } else {
      console.log('Creating new record:', formData);
      // TODO: API call to create
    }
    handleCancelEdit();
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleViewDoc = (docTitle: string, type?: string) => {
    setSelectedDoc({ title: docTitle, type: type });
    setIsDrawerOpen(true);
  };

  const confirmDelete = () => {

    if (deleteId) {
      console.log('Deleting record:', deleteId);
      // TODO: API call to delete
      // After success:
      // setData(prev => ({ ...prev, history: prev.history.filter((_, i) => `record-${i}` !== deleteId) }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (name === 'category') {
      setRecordCategory(value);
    }
  };

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

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-6">
            {tabs.map((tab: any) => (
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
          
          <div className="hidden xl:flex gap-3 ml-6">
             <Pill type="income" label="Income" value={data.summary?.income || "$0.00"} />
             <Pill type="expense" label="Expenses" value={data.summary?.expenses || "$0.00"} />
          </div>
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
                  editingId ? (
                    activeTab === 'records' ? 'Edit Financial Record' :
                    activeTab === 'invoices' ? 'Edit Invoice' :
                    activeTab === 'bank' ? 'Edit Bank Account' :
                    activeTab === 'loans' ? 'Edit Loan Entry' :
                    activeTab === 'insurance' ? 'Edit Policy' :
                    activeTab === 'tax' ? 'Edit Tax Filing' : 'Edit Settlement'
                  ) : (
                    activeTab === 'records' ? 'New Financial Record' :
                    activeTab === 'invoices' ? 'Create Invoice' :
                    activeTab === 'bank' ? 'Add Bank Account' :
                    activeTab === 'loans' ? 'New Loan Entry' :
                    activeTab === 'insurance' ? 'Register Policy' :
                    activeTab === 'tax' ? 'Tax Filing' : 'Log Settlement'
                  )
                } 
                icon={editingId ? Edit : Plus} 
                iconColor="bg-slate-800"
              >
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {activeTab === 'records' && (
                    <>
                      <Field label="Record Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Monthly Rent Payment" />
                      <Field 
                        label="Category" 
                        name="category"
                        value={formData.category}
                        isSelect 
                        options={data.options || []} 
                        onChange={handleInputChange}
                      />
                      {recordCategory === 'Supplier Payments' && <Field label="Supplier" name="supplier" value={formData.supplier} onChange={handleInputChange} isSelect options={data.suppliers || []} />}
                      {recordCategory === 'Rent' && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Term Start" name="rentStart" value={formData.rentStart} onChange={handleInputChange} type="date" />
                          <Field label="Term End" name="rentEnd" value={formData.rentEnd} onChange={handleInputChange} type="date" />
                        </div>
                      )}
                      {recordCategory === 'Mortgage' && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Paying Mode" name="payMode" value={formData.payMode} onChange={handleInputChange} isSelect options={data.paymentModes || []} />
                          <Field label="Interest Rate (%)" name="interestRate" value={formData.interestRate} onChange={handleInputChange} type="number" step="0.01" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Type" name="type" value={formData.type} onChange={handleInputChange} isSelect options={data.recordTypes || []} />
                        <Field label="Amount ($)" name="amount" value={formData.amount} onChange={handleInputChange} type="number" step="0.01" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Payment Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.paymentStatuses || []} />
                        <Field label="Date" name="date" value={formData.date} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Upload Document" name="document" onChange={handleInputChange} type="file" />
                      <Field label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} isTextArea placeholder="Add any internal remarks..." />
                    </>
                  )}

                  {activeTab === 'invoices' && (
                    <>
                      <Field label="Client Name" name="client" value={formData.client} onChange={handleInputChange} placeholder="e.g. Alpha Trading Co." />
                      <Field label="Invoice Number" name="num" value={formData.num} onChange={handleInputChange} placeholder="INV-2026-001" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Amount ($)" name="amount" value={formData.amount} onChange={handleInputChange} type="number" step="0.01" />
                        <Field label="Due Date" name="due" value={formData.due} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.invoiceStatuses || []} />
                      <Field label="Attach PDF" name="pdf" onChange={handleInputChange} type="file" />
                      <Field label="Internal Notes" name="notes" value={formData.notes} onChange={handleInputChange} isTextArea />
                    </>
                  )}

                  {activeTab === 'bank' && (
                    <>
                      <Field label="Bank Name" name="bank" value={formData.bank} onChange={handleInputChange} placeholder="e.g. Business Central Bank" />
                      <Field label="Account Name" name="acc" value={formData.acc} onChange={handleInputChange} placeholder="Full legal name" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Account Number" name="num" value={formData.num} onChange={handleInputChange} />
                        <Field label="Sort Code" name="sort" value={formData.sort} onChange={handleInputChange} placeholder="00-00-00" />
                      </div>
                      <Field label="Type" name="type" value={formData.type} onChange={handleInputChange} isSelect options={data.bankTypes || []} />
                      <Field label="IBAN (Optional)" name="iban" value={formData.iban} onChange={handleInputChange} />
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.bankStatuses || []} />
                    </>
                  )}

                  {activeTab === 'loans' && (
                    <>
                      <Field label="Loan Name / Type" name="loan" value={formData.loan} onChange={handleInputChange} placeholder="e.g. Growth Loan" />
                      <Field label="Lender" name="lender" value={formData.lender} onChange={handleInputChange} placeholder="Bank or Institution" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Total Amount ($)" name="total" value={formData.total} onChange={handleInputChange} type="number" />
                        <Field label="Outstanding ($)" name="os" value={formData.os} onChange={handleInputChange} type="number" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Monthly Payment ($)" name="monthly" value={formData.monthly} onChange={handleInputChange} type="number" />
                        <Field label="Interest Rate (%)" name="rate" value={formData.rate} onChange={handleInputChange} type="number" step="0.01" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" name="startDate" value={formData.startDate} onChange={handleInputChange} type="date" />
                        <Field label="End Date" name="endDate" value={formData.endDate} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.loanStatuses || []} />
                    </>
                  )}

                  {activeTab === 'insurance' && (
                    <>
                      <Field label="Insurance Type" name="type" value={formData.type} onChange={handleInputChange} placeholder="e.g. Public Liability" />
                      <Field label="Provider Name" name="provider" value={formData.provider} onChange={handleInputChange} />
                      <Field label="Policy Number" name="policy" value={formData.policy} onChange={handleInputChange} />
                      <Field label="Premium Amount ($)" name="premium" value={formData.premium} onChange={handleInputChange} type="number" step="0.01" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" name="startDate" value={formData.startDate} onChange={handleInputChange} type="date" />
                        <Field label="Expiry Date" name="expiry" value={formData.expiry} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Renewal Reminder" name="renewal" value={formData.renewal} onChange={handleInputChange} isSelect options={data.renewalReminders || []} />
                    </>
                  )}

                  {activeTab === 'tax' && (
                    <>
                      <Field label="Tax Type" name="type" value={formData.type} onChange={handleInputChange} placeholder="e.g. VAT Q1 2024" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Period Start" name="periodStart" value={formData.periodStart} onChange={handleInputChange} type="date" />
                        <Field label="Period End" name="period" value={formData.period} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Tax Amount ($)" name="amount" value={formData.amount} onChange={handleInputChange} type="number" step="0.01" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Filing Date" name="date" value={formData.date} onChange={handleInputChange} type="date" />
                        <Field label="Payment Due" name="paymentDue" value={formData.paymentDue} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.vatStatuses || []} />
                    </>
                  )}

                  {activeTab === 'dojo' && (
                    <>
                      <Field label="Transaction Date" name="date" value={formData.date} onChange={handleInputChange} type="date" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Amount ($)" name="amount" value={formData.amount} onChange={handleInputChange} type="number" step="0.01" />
                        <Field label="Fee ($)" name="fee" value={formData.fee} onChange={handleInputChange} type="number" step="0.01" />
                      </div>
                      <Field label="Net Amount ($)" name="net" value={formData.net} onChange={handleInputChange} type="number" disabled placeholder="Calculated automatically" />
                      <Field label="Payment Method" name="method" value={formData.method} onChange={handleInputChange} isSelect options={data.dojoMethods || []} />
                      <Field label="Settlement Date" name="settlementDate" value={formData.settlementDate} onChange={handleInputChange} type="date" />
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.paymentStatuses || []} />
                    </>
                  )}

                  <button className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all transform active:scale-[0.98]">
                    {editingId ? 'Update Record' : (activeTab === 'invoices' ? 'Generate Invoice' : 'Save Record')}
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
                      data.history?.map((r: any, i: number) => (
                        <RecordRow 
                          key={i} 
                          {...r} 
                          onEdit={() => handleEdit(`record-${i}`, r, 'records')} 
                          onDelete={() => handleDeleteClick(`record-${i}`)}
                          onView={() => handleViewDoc(r.title, r.category)}
                        />
                      )) || null
                    )}
                    {activeTab === 'invoices' && (
                      data.invoices?.map((r: any, i: number) => (
                        <InvoiceRow 
                          key={i} 
                          {...r} 
                          onEdit={() => handleEdit(`invoice-${i}`, r, 'invoices')} 
                          onDelete={() => handleDeleteClick(`invoice-${i}`)}
                          onView={() => handleViewDoc(`Invoice ${r.num}`, 'Invoicing')}
                        />
                      )) || null
                    )}
                    {activeTab === 'bank' && (
                      data.banks?.map((r: any, i: number) => <BankRow key={i} {...r} onEdit={() => handleEdit(`bank-${i}`, r, 'bank')} onDelete={() => handleDeleteClick(`bank-${i}`)} />) || null
                    )}
                    {activeTab === 'loans' && (
                      data.loans?.map((r: any, i: number) => <LoanRow key={i} {...r} onEdit={() => handleEdit(`loan-${i}`, r, 'loans')} onDelete={() => handleDeleteClick(`loan-${i}`)} />) || null
                    )}
                    {activeTab === 'dojo' && (
                      data.dojo?.map((r: any, i: number) => (
                        <DojoRow 
                          key={i} 
                          {...r} 
                          onEdit={() => handleEdit(`dojo-${i}`, r, 'dojo')} 
                          onDelete={() => handleDeleteClick(`dojo-${i}`)}
                          onView={() => handleViewDoc(`Settlement ${r.date}`, 'Dojo Settlement')}
                        />
                      )) || null
                    )}
                    {activeTab === 'insurance' && (
                      data.insurance?.map((r: any, i: number) => (
                        <InsuranceRow 
                          key={i} 
                          {...r} 
                          onEdit={() => handleEdit(`insurance-${i}`, r, 'insurance')} 
                          onDelete={() => handleDeleteClick(`insurance-${i}`)}
                          onView={() => handleViewDoc(`${r.type} Policy`, 'Insurance')}
                        />
                      )) || null
                    )}
                    {activeTab === 'tax' && (
                      data.vat?.map((r: any, i: number) => (
                        <TaxRow 
                          key={i} 
                          {...r} 
                          onEdit={() => handleEdit(`tax-${i}`, r, 'tax')} 
                          onDelete={() => handleDeleteClick(`tax-${i}`)}
                          onView={() => handleViewDoc(`${r.type} Filing`, 'Taxation')}
                        />
                      )) || null
                    )}
                  </tbody>

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

      <DocumentDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        documentData={selectedDoc}
      />
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

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, onChange, disabled, value, name }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <select 
          name={name}
          value={value || ''}
          onChange={onChange} 
          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium"
        >
          <option value="">Select Option...</option>
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea 
          name={name}
          value={value || ''}
          onChange={onChange}
          rows={2} 
          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" 
          placeholder={placeholder} 
        />
      ) : (
        <input 
          name={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled} 
          type={type} 
          className={`w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}

function RecordRow({ date, title, sub, category, amount, status, onEdit, onDelete, onView }: any) {
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
      <td className="px-4 py-4">
        <RowActions 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
          showEye 
        />
      </td>
    </tr>
  );
}


function InvoiceRow({ num, client, amount, due, status, onEdit, onDelete, onView }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 font-bold text-slate-800">{num}</td>
      <td className="px-4 py-4 text-slate-600 font-medium">{client}</td>
      <td className="px-4 py-4 font-bold text-slate-800">{amount}</td>
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">{due}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4">
        <RowActions 
          showDownload 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
        />
      </td>
    </tr>
  );
}


function BankRow({ bank, acc, num, sort, type, status, onEdit, onDelete }: any) {
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
      <td className="px-4 py-4"><RowActions onEdit={onEdit} onDelete={onDelete} /></td>
    </tr>
  );
}

function LoanRow({ loan, lender, total, os, monthly, rate, status, onEdit, onDelete }: any) {
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
      <td className="px-4 py-4"><RowActions onEdit={onEdit} onDelete={onDelete} /></td>
    </tr>
  );
}

function DojoRow({ date, amount, fee, net, status, onEdit, onDelete, onView }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">{date}</td>
      <td className="px-4 py-4 font-bold text-slate-800">{amount}</td>
      <td className="px-4 py-4 text-red-500 font-medium">{fee}</td>
      <td className="px-4 py-4 font-extrabold text-slate-800">{net}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4">
        <RowActions 
          showEye 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
        />
      </td>
    </tr>
  );
}


function InsuranceRow({ type, provider, policy, premium, expiry, status, onEdit, onDelete, onView }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{type}</div>
        <div className="text-[10px] text-slate-400 font-medium">{provider}</div>
      </td>
      <td className="px-4 py-4 font-mono text-slate-600 text-xs">{policy}</td>
      <td className="px-4 py-4 font-bold text-slate-800">{premium}</td>
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">{expiry}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4">
        <RowActions 
          showDownload 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
        />
      </td>
    </tr>
  );
}


function TaxRow({ type, period, amount, date, status, onEdit, onDelete, onView }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{type}</div>
        <div className="text-[10px] text-slate-400 font-medium">{period}</div>
      </td>
      <td className="px-4 py-4 font-bold text-slate-800">{amount}</td>
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">{date}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4">
        <RowActions 
          showDownload 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
        />
      </td>
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

function RowActions({ showDownload, showEye, onEdit, onDelete, onView }: any) {
  return (
    <div className="flex gap-2">
      <button 
        onClick={onEdit}
        className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
      >
        <Edit className="w-3.5 h-3.5" />
      </button>
      {showEye && (
        <button 
          onClick={onView}
          className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      )}
      {showDownload && (
        <button 
          onClick={onView}
          className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
        >
          <FileSearch className="w-3.5 h-3.5" />
        </button>
      )}

      <button 
        onClick={onDelete}
        className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
