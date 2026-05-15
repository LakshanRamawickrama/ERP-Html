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
import { cn } from '@/lib/utils';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { usePermissions } from '@/hooks/usePermissions';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';
import { BusinessField } from '@/components/ui/BusinessField';
import { useSearchParams } from 'next/navigation';


type TabType = 'records' | 'invoices' | 'bank' | 'loans' | 'insurance' | 'tax';

export default function AccountingModule({ selectedBusiness = 'All Entities' }: { selectedBusiness?: string }) {
  const [activeTab, setActiveTab] = useState<TabType>('records');
  const [showCustomPolicyType, setShowCustomPolicyType] = useState(false);

  const permMap: Record<TabType, string> = {
    records: 'Financial Records',
    invoices: 'Invoices',
    bank: 'Bank Accounts',
    loans: 'Loans & Insurance',
    insurance: 'Loans & Insurance',
    tax: 'Tax Records'
  };

  const { canAdd, canEdit, canDelete } = usePermissions(permMap[activeTab], 'Accounting');
  const [isWide, setIsWide] = useState(false);
  const [recordCategory, setRecordCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [fileFields, setFileFields] = useState<Record<string, File>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterSub, setFilterSub] = useState<string>('All');
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  React.useEffect(() => {
    if (searchParams.get('view') === 'wide') {
      setIsWide(true);
    }
    const targetTab = searchParams.get('tab');
    if (targetTab && ['records', 'invoices', 'bank', 'loans', 'insurance', 'tax'].includes(targetTab)) {
      setActiveTab(targetTab as TabType);
    }
  }, [searchParams]);


  const [data, setData] = useState<any>({ records: [], invoices: [], banks: [], loans: [], dojo: [], insurance: [], vat: [] });

  const fetchAccounting = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ENDPOINTS.ACCOUNTING, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) { console.error('Accounting fetch failed:', res.status); return; }
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) { console.error('Accounting: non-JSON response'); return; }
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error('Accounting fetch error:', err);
    }
  };

  React.useEffect(() => {
    fetchAccounting();
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
    setFileFields({});
    setRecordCategory('');
    setShowCustomPolicyType(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const body = new FormData();

    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== undefined && !(v instanceof File)) {
        if (k === 'id') return;
        body.append(k, String(v));
      }
    });
    Object.entries(fileFields).forEach(([k, f]) => body.append(k, f));

    const endpointMap: any = {
      records: 'transactions/',
      invoices: 'invoices/',
      bank: 'banks/',
      loans: 'loans/',
      insurance: 'insurance/',
      tax: 'tax/',
      dojo: 'dojo/'
    };

    const subPath = endpointMap[activeTab] || 'transactions/';
    const baseUrl = `${API_ENDPOINTS.ACCOUNTING}${subPath}`;
    const url = editingId ? `${baseUrl}${editingId}/` : baseUrl;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body });
      if (res.ok) {
        fetchAccounting();
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleViewDoc = (docTitle: string, url?: string, type?: string) => {
    setSelectedDoc({ title: docTitle, fileUrl: url, type: type });
    setIsDrawerOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem('token');
    const type = deleteId.split('-')[0];
    const realId = deleteId.split('-')[1];

    const endpointMap: any = {
      record: 'transactions/',
      invoice: 'invoices/',
      bank: 'banks/',
      loan: 'loans/',
      dojo: 'dojo/',
      insurance: 'insurance/',
      tax: 'tax/'
    };

    const subPath = endpointMap[type] || 'transactions/';
    const url = `${API_ENDPOINTS.ACCOUNTING}${subPath}${realId}/`;

    try {
      const res = await fetch(url, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        fetchAccounting();
        setShowDeleteModal(false);
        setDeleteId(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === 'file' && target.files?.[0]) {
      const file = target.files[0];
      setFileFields(prev => ({ ...prev, [name]: file }));
      // Clear existing URL so UI shows replacement status
      const urlKey = name === 'pdf' ? 'pdf_url' : 'document_url';
      setFormData((prev: any) => ({ ...prev, [urlKey]: null }));
    } else {
      const val = target.value;
      setFormData((prev: any) => {
        const next = { ...prev, [name]: val };

        return next;
      });
      if (name === 'category') {
        if (val === 'ADD_NEW') {
          setRecordCategory('ADD_NEW');
        } else {
          setRecordCategory(val);
        }
      }
    }
  };

  const tabs = [
    { id: 'records', label: 'Financial Records', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'bank', label: 'Bank Details', icon: Landmark },
    { id: 'loans', label: 'Loans', icon: HandCoins },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
    { id: 'tax', label: 'VAT / Tax', icon: Coins },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-6">
            {tabs.map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
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
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>

          {!isWide && canAdd && (
            <div className="lg:col-span-4">
              <Card
                title={editingId ? `Edit ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` : `New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Record`}
                icon={editingId ? Edit : Plus}
                iconColor="bg-slate-800"
                headerAction={isWide && canAdd && (
                  <button 
                    onClick={() => setIsWide(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg shadow-sm hover:bg-slate-900 transition-all uppercase"
                  >
                    <Plus className="w-3 h-3" /> New Entry
                  </button>
                )}
              >
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {activeTab === 'records' && (
                    <>
                      <BusinessField
                        value={formData.biz || ''}
                        onChange={(v) => setFormData({ ...formData, biz: v })}
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Record Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Monthly Rent" />
                      <Field
                        label="Category"
                        name="category"
                        value={formData.category}
                        isSelect
                        options={['Supplier Payments', 'Rent', 'Mortgage', 'Accountant Fees', 'Bank Charges', 'ADD_NEW']}
                        onChange={handleInputChange}
                      />

                      {recordCategory === 'ADD_NEW' && (
                        <Field
                          label="Specify Category"
                          name="customCategory"
                          value={formData.customCategory}
                          onChange={(e: any) => setFormData({ ...formData, category: e.target.value, customCategory: e.target.value })}
                          placeholder="Enter new category name"
                        />
                      )}

                      {recordCategory === 'Supplier Payments' && <Field label="Supplier" name="supplier" value={formData.supplier} onChange={handleInputChange} isSelect options={['Global Supplies Ltd', 'Tech Connect Inc', 'Office Depot', 'Prime Logistics']} />}
                      
                      {recordCategory === 'Rent' && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Rent Term Start" name="rentStart" value={formData.rentStart} onChange={handleInputChange} type="date" />
                          <Field label="Rent Term End" name="rentEnd" value={formData.rentEnd} onChange={handleInputChange} type="date" />
                        </div>
                      )}

                      {recordCategory === 'Mortgage' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Paying Mode" name="mortMode" value={formData.mortMode} onChange={handleInputChange} isSelect options={['Monthly', 'Quarterly', 'Annually']} />
                            <Field label="Term (Years)" name="mortTerm" value={formData.mortTerm} onChange={handleInputChange} type="number" placeholder="e.g. 25" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Interest Rate (%)" name="mortRate" value={formData.mortRate} onChange={handleInputChange} type="number" step="0.01" placeholder="0.00" />
                            <Field label="Repayment (£)" name="mortRepay" value={formData.mortRepay} onChange={handleInputChange} type="number" step="0.01" placeholder="0.00" />
                          </div>
                        </>
                      )}



                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Type" name="type" value={formData.type} onChange={handleInputChange} isSelect options={['Income', 'Expense', 'Asset', 'Equity', 'Liability']} />
                        <Field label="Amount (£)" name="amount" value={formData.amount} onChange={handleInputChange} type="number" step="0.01" placeholder="0.00" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Payment Method" name="payment_method" value={formData.payment_method} onChange={handleInputChange} isSelect options={['Bank Transfer', 'Cash', 'Card', 'Cheque']} />
                        <Field label="Reference # / Transaction ID" name="reference_number" value={formData.reference_number} onChange={handleInputChange} placeholder="e.g. TXN-458921" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Payment Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={['Paid', 'Pending', 'Overdue']} />
                        <Field label="Date" name="date" value={formData.date} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Upload Document" name="document" onChange={handleInputChange} type="file" existingFile={formData.document_url} fileFields={fileFields} />
                      <Field label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} isTextArea />
                    </>
                  )}

                  {activeTab === 'invoices' && (
                    <>
                      <BusinessField
                        value={formData.biz || ''}
                        onChange={(v) => setFormData({ ...formData, biz: v })}
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Client Name" name="client" value={formData.client} onChange={handleInputChange} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Inv Number" name="num" value={formData.num} onChange={handleInputChange} />
                        <Field label="Invoice Type" name="type" value={formData.type} onChange={handleInputChange} isSelect options={data.invoiceTypes || []} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Amount ($)" name="amount" value={formData.amount} onChange={handleInputChange} type="number" />
                        <Field label="Payment Method" name="method" value={formData.method} onChange={handleInputChange} isSelect options={data.invoiceMethods || []} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Invoice Date" name="date" value={formData.date} onChange={handleInputChange} type="date" />
                        <Field label="Due Date" name="due" value={formData.due} onChange={handleInputChange} type="date" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Reference #" name="ref" value={formData.ref} onChange={handleInputChange} placeholder="e.g. TXN458921" />
                        <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.invoiceStatuses || []} />
                      </div>
                      <Field label="Attach PDF" name="pdf" onChange={handleInputChange} type="file" existingFile={formData.pdf_url} fileFields={fileFields} />
                      <Field label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} isTextArea />
                    </>
                  )}

                  {activeTab === 'bank' && (
                    <>
                      <BusinessField
                        value={formData.biz || ''}
                        onChange={(v) => setFormData({ ...formData, biz: v })}
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Bank Name" name="bank" value={formData.bank} onChange={handleInputChange} placeholder="e.g. Barclays" />
                      <Field label="Account Name" name="acc" value={formData.acc} onChange={handleInputChange} placeholder="Business Current" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Account Number" name="num" value={formData.num} onChange={handleInputChange} />
                        <Field label="Sort Code" name="sort" value={formData.sort} onChange={handleInputChange} />
                      </div>
                      <Field label="IBAN (Optional)" name="iban" value={formData.iban} onChange={handleInputChange} placeholder="GBXX XXXX..." />
                      <Field label="Account Type" name="type" value={formData.type} onChange={handleInputChange} isSelect options={data.bankTypes || []} />
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.bankStatuses || []} />
                      <Field label="Supporting Document" name="document" onChange={handleInputChange} type="file" existingFile={formData.document_url} fileFields={fileFields} />
                    </>
                  )}

                  {activeTab === 'loans' && (
                    <>
                      <BusinessField
                        value={formData.biz || ''}
                        onChange={(v) => setFormData({ ...formData, biz: v })}
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Loan Name" name="loan" value={formData.loan} onChange={handleInputChange} />
                      <Field label="Loan Purpose" name="purpose" value={formData.purpose} onChange={handleInputChange} placeholder="e.g. Equipment Financing" />
                      <Field label="Lender" name="lender" value={formData.lender} onChange={handleInputChange} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Total Amount ($)" name="total" value={formData.total} onChange={handleInputChange} type="number" />
                        <Field label="Outstanding O/S ($)" name="os" value={formData.os} onChange={handleInputChange} type="number" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Monthly Payment($)" name="monthly" value={formData.monthly} onChange={handleInputChange} type="number" />
                        <Field label="Interest Rate (%)" name="rate" value={formData.rate} onChange={handleInputChange} type="number" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" name="start" value={formData.start} onChange={handleInputChange} type="date" />
                        <Field label="End Date" name="end" value={formData.end} onChange={handleInputChange} type="date" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Next Payment" name="next" value={formData.next} onChange={handleInputChange} type="date" />
                        <Field label="Reminder (Days)" name="reminder_days" value={formData.reminder_days} onChange={handleInputChange} isSelect options={['7', '14', '30', '60']} />
                      </div>
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.loanStatuses || []} />
                      <Field label="Upload Documents (Agreement, Schedule, etc.)" name="document" onChange={handleInputChange} type="file" existingFile={formData.document_url} fileFields={fileFields} />
                    </>
                  )}

                   {activeTab === 'insurance' && (
                    <>
                      <BusinessField
                        value={formData.biz || ''}
                        onChange={(v) => setFormData({ ...formData, biz: v })}
                        businesses={data.options?.businesses || []}
                      />
                      <Field 
                        label="Policy Type" 
                        name="type" 
                        value={showCustomPolicyType ? 'ADD_NEW' : formData.type} 
                        onChange={(e: any) => {
                          const val = e.target.value;
                          if (val === 'ADD_NEW') {
                            setShowCustomPolicyType(true);
                            setFormData((prev: any) => ({ ...prev, type: '' }));
                          } else {
                            setShowCustomPolicyType(false);
                            setFormData((prev: any) => ({ ...prev, type: val }));
                          }
                        }} 
                        isSelect 
                        options={[
                          'Public Liability', 
                          'Employers Liability', 
                          'Vehicle Insurance', 
                          'Property / Building', 
                          'Professional Indemnity',
                          'Business Interruption',
                          'Product Liability',
                          'Cyber Insurance',
                          'ADD_NEW'
                        ]} 
                      />
                      {showCustomPolicyType && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                          <Field 
                            label="Custom Policy Type" 
                            name="custom_type" 
                            value={formData.type}
                            placeholder="Enter new policy type..." 
                            onChange={(e: any) => setFormData((prev: any) => ({ ...prev, type: e.target.value }))} 
                          />
                        </div>
                      )}
                      <Field label="Insurance Provider" name="provider" value={formData.provider} onChange={handleInputChange} placeholder="e.g. AXA, Aviva, Allianz" />
                      <Field label="Policy Number" name="policy" value={formData.policy} onChange={handleInputChange} placeholder="e.g. POL-882910" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Premium (£)" name="premium" value={formData.premium} onChange={handleInputChange} type="number" />
                        <Field label="Coverage (£)" name="coverage" value={formData.coverage} onChange={handleInputChange} type="number" />
                      </div>
                      <Field label="Insured Asset / Details" name="asset" value={formData.asset} onChange={handleInputChange} placeholder="Address, Registration, or Equipment" />
                      <Field label="Provider Contact" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="Phone or Email" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" name="start" value={formData.start} onChange={handleInputChange} type="date" />
                        <Field label="Renewal Date" name="expiry" value={formData.expiry} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Renewal Reminder (Days)" name="reminder_days" value={formData.reminder_days} onChange={handleInputChange} isSelect options={['15', '30', '60', '90']} />
                      <Field label="Policy Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={['Active', 'Expired', 'Pending Renewal']} />
                      <Field label="Attach Policy PDF" name="document" onChange={handleInputChange} type="file" existingFile={formData.document_url} fileFields={fileFields} />
                    </>
                  )}

                  {activeTab === 'tax' && (
                    <>
                      <BusinessField
                        value={formData.biz || ''}
                        onChange={(v) => setFormData({ ...formData, biz: v })}
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Tax Type" name="type" value={formData.type} onChange={handleInputChange} placeholder="Corporation Tax, VAT..." />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Tax Reference #" name="ref" value={formData.ref} onChange={handleInputChange} placeholder="e.g. VAT-123456789" />
                        <Field label="Transaction / Invoice Ref" name="txn_ref" value={formData.txn_ref} onChange={handleInputChange} placeholder="e.g. INV-2024-001" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Period Start" name="start" value={formData.start} onChange={handleInputChange} type="date" />
                        <Field label="Period End" name="end" value={formData.end} onChange={handleInputChange} type="date" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Filing Deadline" name="deadline" value={formData.deadline} onChange={handleInputChange} type="date" />
                        <Field label="Payment Due" name="due" value={formData.due} onChange={handleInputChange} type="date" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Tax Amount (£)" name="amount" value={formData.amount} onChange={handleInputChange} type="number" step="0.01" />
                        <Field label="Reminder (Days)" name="reminder_days" value={formData.reminder_days} onChange={handleInputChange} isSelect options={['7', '14', '30']} />
                      </div>
                      <Field label="Payment Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.vatStatuses || []} />
                      <Field label="Supporting Documents (Receipts, etc.)" name="document" onChange={handleInputChange} type="file" existingFile={formData.document_url} fileFields={fileFields} />
                    </>
                  )}



                  <button className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all">
                    {editingId ? 'Update Record' : 'Register Record'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={handleCancelEdit} className="w-full py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all mt-2">
                      Cancel Edit
                    </button>
                  )}
                </form>
              </Card>
            </div>
          )}

          <div className={isWide || !(canAdd || canEdit) ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card 
              title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Registry`} 
              icon={FileText}
              headerAction={
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search records..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:border-slate-800 transition-all w-48"
                    />
                  </div>
                  {activeTab === 'records' && (
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto no-scrollbar max-w-[600px]">
                      {['All', 'Supplier Payments', 'Rent', 'Mortgage'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterSub(cat)}
                          className={cn(
                            "px-3 py-1 text-[9px] font-bold rounded-md transition-all uppercase tracking-tight whitespace-nowrap",
                            filterSub === cat ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={() => setIsWide(!isWide)}
                    className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-bold text-slate-500 border border-slate-200 rounded-md hover:bg-white transition-all uppercase tracking-wider"
                  >
                    {isWide ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                    {isWide ? 'Standard' : 'Wide'} View
                  </button>
                </div>
              }
            >
              <div className="">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {activeTab === 'records' && (
                        <>
                          {isWide && <th className={thClass}>Business Name</th>}
                          <th className={thClass}>Record Title</th>
                          <th className={thClass}>Category</th>
                          <th className={thClass}>Type</th>
                          {isWide && <th className={thClass}>Record Details</th>}
                          {isWide && <th className={thClass}>Date</th>}
                          <th className={thClass}>Amount (£)</th>
                          {isWide && <th className={thClass}>Payment Method</th>}
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'invoices' && (
                        <>
                          {isWide && <th className={thClass}>Business Name</th>}
                          <th className={thClass}>Client Name</th>
                          <th className={thClass}>Inv Number</th>
                          {isWide && <th className={thClass}>Invoice Type</th>}
                          <th className={thClass}>Amount ($)</th>
                          {isWide && <th className={thClass}>Payment Method</th>}
                          <th className={thClass}>Invoice Date</th>
                          {isWide && <th className={thClass}>Due Date</th>}
                          {isWide && <th className={thClass}>Reference #</th>}
                          <th className={thClass}>Status</th>
                          {isWide && <th className={thClass}>Notes</th>}
                        </>
                      )}
                      {activeTab === 'bank' && (
                        <>
                          {isWide && <th className={thClass}>Business Name</th>}
                          <th className={thClass}>Bank Name</th>
                          <th className={thClass}>Account Name</th>
                          <th className={thClass}>Account Number</th>
                          {isWide && <th className={thClass}>Sort Code</th>}
                          {isWide && <th className={thClass}>IBAN</th>}
                          <th className={thClass}>Type</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'loans' && (
                        <>
                          {isWide && <th className={thClass}>Business Name</th>}
                          <th className={thClass}>{isWide ? 'Loan Name' : 'Loan Name / Purpose'}</th>
                          {isWide && <th className={thClass}>Purpose</th>}
                          <th className={thClass}>Lender</th>
                          <th className={thClass}>Total / O/S</th>
                          <th className={thClass}>Monthly / Rate</th>
                          {isWide && <th className={thClass}>Term Dates</th>}
                          {isWide && <th className={thClass}>Next Payment</th>}
                          {isWide && <th className={thClass}>Reminder</th>}
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'insurance' && (
                        <>
                          {isWide && <th className={thClass}>Business Name</th>}
                          <th className={thClass}>Policy Type</th>
                          <th className={thClass}>Provider</th>
                          <th className={thClass}>Policy #</th>
                          <th className={thClass}>Premium ($)</th>
                          {isWide && <th className={thClass}>Coverage ($)</th>}
                          {isWide && <th className={thClass}>Asset / Details</th>}
                          {isWide && <th className={thClass}>Contact</th>}
                          {isWide && <th className={thClass}>Start Date</th>}
                          <th className={thClass}>Renewal Date</th>
                          {isWide && <th className={thClass}>Reminder</th>}
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'tax' && (
                        <>
                          {isWide && <th className={thClass}>Business Name</th>}
                          <th className={thClass}>Tax Type</th>
                          {isWide && <th className={thClass}>Tax Reference #</th>}
                          {isWide && <th className={thClass}>Txn / Inv Ref</th>}
                          <th className={thClass}>Period (Start/End)</th>
                          <th className={thClass}>Deadlines (File/Pay)</th>
                          <th className={thClass}>Amount (£)</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}

                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'records' && (
                      data.records
                        ?.filter((r: any) => (selectedBusiness === 'All Entities' || r.biz === selectedBusiness) && (filterSub === 'All' || r.category === filterSub))
                        .filter((r: any) => !searchTerm || Object.values(r).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
                        .map((r: any, i: number) => (
                          <RecordRow 
                            key={i} 
                            {...r} 
                            isWide={isWide} 
                            canEdit={canEdit} 
                            canDelete={canDelete} 
                            onEdit={() => handleEdit(r.id, r, 'records')} 
                            onDelete={() => handleDeleteClick(`record-${r.id}`)} 
                            onView={() => handleViewDoc(r.title, r.document_url, r.category)} 
                          />
                        )) || null
                    )}
                    {activeTab === 'invoices' && (
                      data.invoices
                        ?.filter((r: any) => selectedBusiness === 'All Entities' || r.biz === selectedBusiness)
                        .filter((r: any) => !searchTerm || Object.values(r).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
                        .map((r: any, i: number) => <InvoiceRow key={i} {...r} isWide={isWide} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'invoices')} onDelete={() => handleDeleteClick(`invoice-${r.id}`)} onView={() => handleViewDoc(`Invoice ${r.num}`, r.pdf_url, 'Invoicing')} />) || null
                    )}
                    {activeTab === 'bank' && (
                      data.banks
                        ?.filter((r: any) => selectedBusiness === 'All Entities' || r.biz === selectedBusiness)
                        .filter((r: any) => !searchTerm || Object.values(r).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
                        .map((r: any, i: number) => <BankRow key={i} {...r} isWide={isWide} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'bank')} onDelete={() => handleDeleteClick(`bank-${r.id}`)} onView={() => handleViewDoc(`${r.bank_name} - ${r.account_name}`, r.document_url, 'Bank Record')} />) || null
                    )}
                    {activeTab === 'loans' && (
                      data.loans
                        ?.filter((r: any) => selectedBusiness === 'All Entities' || r.biz === selectedBusiness)
                        .filter((r: any) => !searchTerm || Object.values(r).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
                        .map((r: any, i: number) => <LoanRow key={i} {...r} isWide={isWide} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'loans')} onDelete={() => handleDeleteClick(`loan-${r.id}`)} onView={() => handleViewDoc(`${r.loan} Agreement`, r.document_url, 'Loan Document')} />) || null
                    )}
                    {activeTab === 'insurance' && (
                      data.insurance
                        ?.filter((r: any) => selectedBusiness === 'All Entities' || r.biz === selectedBusiness)
                        .filter((r: any) => !searchTerm || Object.values(r).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
                        .map((r: any, i: number) => <InsuranceRow key={i} {...r} isWide={isWide} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'insurance')} onDelete={() => handleDeleteClick(`insurance-${r.id}`)} onView={() => handleViewDoc(`${r.type} Policy`, r.document_url, 'Insurance')} />) || null
                    )}
                    {activeTab === 'tax' && (
                      data.vat
                        ?.filter((r: any) => selectedBusiness === 'All Entities' || r.biz === selectedBusiness)
                        .filter((r: any) => !searchTerm || Object.values(r).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
                        .map((r: any, i: number) => <TaxRow key={i} {...r} isWide={isWide} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'tax')} onDelete={() => handleDeleteClick(`tax-${r.id}`)} onView={() => handleViewDoc(`${r.type} Filing`, r.document_url, 'Taxation')} />) || null
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />
      <DocumentDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} documentData={selectedDoc} />
    </div>
  );
}

const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider";

function Pill({ type, label, value }: { type: 'income' | 'expense', label: string, value: string }) {
  const isIncome = type === 'income';
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isIncome ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
      {isIncome ? <ArrowDownCircle className="w-3.5 h-3.5" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
      <span className="text-[10px] font-bold">{label}: <span className="font-extrabold">{value}</span></span>
    </div>
  );
}

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, onChange, disabled, value, name, existingFile, fileFields }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">{label}</label>
      <div className="relative">
        {isSelect ? (
          <>
            <select
              name={name}
              value={value || ''}
              onChange={onChange}
              className="w-full h-[42px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 focus:bg-white font-medium appearance-none pr-10 cursor-pointer"
            >
              <option value="">Select Option...</option>
              {options.map((opt: string) => (
                <option key={String(opt)} value={String(opt)}>
                  {opt === 'ADD_NEW' ? '+ Add New Category...' : String(opt)}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </>
        ) : isTextArea ? (
          <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            rows={2}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 focus:bg-white font-medium"
            placeholder={placeholder}
          />
        ) : (
          <input
            name={name}
            {...(type !== 'file' ? { value: value || '' } : {})}
            onChange={onChange}
            disabled={disabled}
            type={type}
            className={`w-full h-[42px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 focus:bg-white font-medium ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            placeholder={placeholder}
          />
        )}
      </div>
      {type === 'file' && existingFile && (
        <div className="mt-1 flex items-center gap-2 bg-indigo-50/50 p-1.5 rounded-lg border border-indigo-100/50">
          <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Current File:</span>
          <a href={existingFile} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
            <Eye className="w-3 h-3" /> View Uploaded Document
          </a>
        </div>
      )}
      {type === 'file' && !existingFile && name in fileFields && (
        <div className="mt-1 flex items-center gap-2 bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100/50">
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Status:</span>
          <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 italic">
            <Plus className="w-3 h-3" /> Ready to upload: {(fileFields as any)[name]?.name}
          </span>
        </div>
      )}
    </div>
  );
}

function RecordRow({ title, category, amount, status, date, method, biz, isWide, onEdit, onDelete, onView, canEdit, canDelete, ...props }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-xs font-bold text-slate-600">{biz || 'Main Entity'}</div>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">{title}</div>
        {!isWide && <div className="text-[10px] text-slate-400 font-medium">{date}</div>}
      </td>
      <td className="px-4 py-4">
        <div className={cn(
          "px-2 py-0.5 rounded text-[9px] font-black uppercase inline-block border",
          category === 'Income' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          category === 'Rent' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
          category === 'Mortgage' ? "bg-blue-50 text-blue-600 border-blue-100" :
          category === 'VAT / Tax' ? "bg-amber-50 text-amber-600 border-amber-100" :
          "bg-slate-50 text-slate-600 border-slate-200"
        )}>{category}</div>
      </td>
      <td className="px-4 py-4">
        <div className={cn(
          "px-2 py-0.5 rounded text-[9px] font-black uppercase inline-block border",
          props.type === 'Income'   ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
          props.type === 'Expense'  ? "bg-red-50 text-red-600 border-red-100" :
          props.type === 'Asset'    ? "bg-sky-50 text-sky-600 border-sky-100" :
          props.type === 'Equity'   ? "bg-violet-50 text-violet-600 border-violet-100" :
          props.type === 'Liability'? "bg-orange-50 text-orange-600 border-orange-100" :
          "bg-slate-50 text-slate-400 border-slate-200"
        )}>{props.type || '—'}</div>
      </td>
      {isWide && (
        <td className="px-4 py-4">
          {category === 'Rent' && (
            <div className="text-[10px] text-slate-500 font-medium">
              Term: {props.rentStart} to {props.rentEnd}
            </div>
          )}
          {category === 'Mortgage' && (
            <div className="text-[10px] text-slate-500 font-medium">
              {props.mortMode} | {props.mortRate}% | {props.mortTerm} yrs
            </div>
          )}
          {category === 'Insurance' && (
            <div className="text-[10px] text-slate-500 font-medium">
              Pol: {props.insPolicy} | Exp: {props.insExpiry}
            </div>
          )}
          {category === 'VAT / Tax' && (
            <div className="text-[10px] text-slate-500 font-medium">
              Type: {props.taxType} | Due: {props.taxDue}
            </div>
          )}
          {category === 'Supplier Payments' && (
            <div className="text-[10px] text-slate-500 font-medium italic">
              Supplier: {props.supplier || 'N/A'}
            </div>
          )}
          {!['Rent', 'Mortgage', 'Insurance', 'VAT / Tax', 'Supplier Payments'].includes(category) && (
            <div className="text-[10px] text-slate-400 italic">No extra details</div>
          )}
        </td>
      )}
      {isWide && (
        <td className="px-4 py-4 text-slate-500 font-mono text-[11px]">{date}</td>
      )}
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">£{Number(amount).toLocaleString()}</div>
        {!isWide && <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{method || 'N/A'}</div>}
      </td>
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-[10px] font-bold text-slate-600">{method || 'N/A'}</div>
        </td>
      )}
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4">
        <RowActions 
          showDownload 
          showEye={!!props.document_url}
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
          canEdit={canEdit} 
          canDelete={canDelete} 
        />
      </td>
    </tr>
  );
}

function InvoiceRow({ num, client, amount, due, date, status, invoice_type, method, ref, biz, notes, isWide, onEdit, onDelete, onView, canEdit, canDelete, ...props }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-xs font-bold text-slate-600">{biz || 'Main Entity'}</div>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="text-slate-600 font-bold text-xs">{client}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-black text-slate-800 text-xs">{num}</div>
        {!isWide && <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{invoice_type}</div>}
      </td>
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{invoice_type}</div>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="font-black text-slate-800 text-xs">${Number(amount).toLocaleString()}</div>
        {!isWide && <div className="text-[10px] text-slate-400 font-medium">{method}</div>}
      </td>
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{method}</div>
        </td>
      )}
      <td className="px-4 py-4 text-slate-500 font-mono text-[11px]">
        <div>{date}</div>
        {!isWide && <div className="text-[9px] text-red-400 font-bold tracking-tighter">Due: {due}</div>}
      </td>
      {isWide && (
        <td className="px-4 py-4 text-slate-500 font-mono text-[11px]">
          <div className="text-red-500 font-bold">{due}</div>
        </td>
      )}
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-[10px] text-slate-400 font-mono">{ref || '-'}</div>
        </td>
      )}
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      {isWide && (
        <td className="px-4 py-4 max-w-[150px] truncate">
          <div className="text-[10px] text-slate-500 italic" title={notes}>{notes || '-'}</div>
        </td>
      )}
      <td className="px-4 py-4">
        <RowActions 
          showDownload 
          showEye={!!props.pdf_url}
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
          canEdit={canEdit} 
          canDelete={canDelete} 
        />
      </td>
    </tr>
  );
}

function BankRow({ bank, acc, num, sort, type, status, biz, iban, isWide, onEdit, onDelete, onView, canEdit, canDelete, ...props }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-xs font-bold text-slate-600">{biz || 'Main Entity'}</div>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">{bank}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-slate-600 font-medium text-xs">{acc}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-mono text-xs font-bold text-slate-700">{num}</div>
        {!isWide && <div className="text-[10px] text-slate-400 font-medium font-mono">{sort}</div>}
      </td>
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-xs font-mono text-slate-500">{sort}</div>
        </td>
      )}
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-[10px] text-slate-400 font-mono">{iban || '-'}</div>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{props.account_type || '-'}</div>
      </td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4">
        <RowActions 
          showDownload
          showEye={!!props.document_url}
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
          canEdit={canEdit} 
          canDelete={canDelete} 
        />
      </td>
    </tr>
  );
}

function LoanRow({ loan, purpose, lender, total, os, monthly, rate, status, biz, start, end, next, renewal, isWide, onEdit, onDelete, onView, canEdit, canDelete, ...props }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-xs font-bold text-slate-600">{biz || 'Main Entity'}</div>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">{loan}</div>
        {!isWide && <div className="text-[10px] text-slate-400 font-medium italic">{purpose}</div>}
      </td>
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-[10px] text-slate-500 font-medium italic">{purpose || '-'}</div>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="text-slate-600 font-bold text-xs">{lender}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">${Number(total).toLocaleString()}</div>
        <div className="text-[10px] text-red-500 font-bold">O/S: ${Number(os).toLocaleString()}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">${Number(monthly).toLocaleString()}</div>
        <div className="text-[10px] text-slate-400 font-medium">{rate}% APR</div>
      </td>
      {isWide && (
        <td className="px-4 py-4 text-slate-500 font-mono text-[10px]">
          <div>S: {start}</div>
          <div className="text-red-400">E: {end}</div>
        </td>
      )}
      {isWide && (
        <td className="px-4 py-4 text-slate-500 font-mono text-[10px]">
          <div className="font-black text-slate-700">{next}</div>
        </td>
      )}
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
            {props.reminder_days ? `${props.reminder_days} Days` : '-'}
          </div>
        </td>
      )}
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4">
        <RowActions 
          showDownload
          showEye={!!props.document_url} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
          canEdit={canEdit} 
          canDelete={canDelete} 
        />
      </td>
    </tr>
  );
}



function InsuranceRow({ type, asset, provider, policy, premium, expiry, status, biz, coverage, contact, start, renewal, isWide, onEdit, onDelete, onView, canEdit, canDelete, ...props }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-xs font-bold text-slate-600">{biz || 'Main Entity'}</div>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">{type}</div>
        {!isWide && <div className="text-[10px] text-slate-400 font-medium">{asset || provider}</div>}
      </td>
      <td className="px-4 py-4">
        <div className="text-slate-600 font-bold text-xs">{provider}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-mono text-slate-500 text-[11px]">{policy}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">${Number(premium).toLocaleString()}</div>
      </td>
      {isWide && (
        <td className="px-4 py-4 font-bold text-slate-800 text-xs">${Number(coverage).toLocaleString()}</td>
      )}
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-[10px] text-slate-500 italic truncate max-w-[150px]" title={asset}>{asset || '-'}</div>
        </td>
      )}
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-[10px] text-slate-500 font-medium">{contact || '-'}</div>
        </td>
      )}
      {isWide && (
        <td className="px-4 py-4 text-slate-500 font-mono text-[11px]">
          {start || '-'}
        </td>
      )}
      <td className="px-4 py-4 text-slate-500 font-mono text-[11px]">{expiry}</td>
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{props.reminder_days ? `${props.reminder_days} Days` : '-'}</div>
        </td>
      )}
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4">
        <RowActions 
          showDownload 
          showEye={!!props.document_url}
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
          canEdit={canEdit} 
          canDelete={canDelete} 
        />
      </td>
    </tr>
  );
}

function TaxRow({ type, start, end, amount, deadline, due, status, ref, txn_ref, biz, isWide, onEdit, onDelete, onView, canEdit, canDelete, ...props }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      {isWide && (
        <td className="px-4 py-4">
          <div className="text-xs font-bold text-slate-600">{biz || 'Main Entity'}</div>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">{type}</div>
      </td>
      {isWide && (
        <td className="px-4 py-4 font-mono text-slate-500 text-[11px]">{ref || '-'}</td>
      )}
      {isWide && (
        <td className="px-4 py-4 font-mono text-slate-500 text-[11px]">{txn_ref || '-'}</td>
      )}
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">
        <div className="flex flex-col">
          <span>{start}</span>
          <span>{end}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold text-slate-400">File: {deadline}</span>
          <span className="text-[9px] uppercase font-bold text-red-400">Pay: {due}</span>
        </div>
      </td>
      <td className="px-4 py-4 font-bold text-slate-800 text-xs">£{Number(amount).toLocaleString()}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4">
        <RowActions 
          showDownload 
          showEye={!!props.document_url}
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView} 
          canEdit={canEdit} 
          canDelete={canDelete} 
        />
      </td>
    </tr>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === 'Paid' || status === 'Active' || status === 'Settled';
  const isPending = status === 'Pending' || status === 'Sent' || status === 'Filed' || status === 'Partially Paid';
  const isDraft = status === 'Draft';

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isPaid ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
      isPending ? 'bg-amber-50 border-amber-100 text-amber-600' :
        isDraft ? 'bg-slate-50 border-slate-100 text-slate-600' :
          'bg-red-50 border-red-100 text-red-600'
      }`}>
      {status}
    </span>
  );
}

function RowActions({ showDownload, showEye, onEdit, onDelete, onView, canEdit, canDelete }: any) {
  return (
    <div className="flex gap-2">
      {canEdit && <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"><Edit className="w-3.5 h-3.5" /></button>}
      {(showEye || showDownload) && <button onClick={onView} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"><Eye className="w-3.5 h-3.5" /></button>}
      {canDelete && <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
    </div>
  );
}
