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
import { usePermissions } from '@/hooks/usePermissions';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';
import { BusinessField } from '@/components/ui/BusinessField';


type TabType = 'records' | 'invoices' | 'bank' | 'loans' | 'insurance' | 'tax' | 'dojo';

export default function AccountingModule() {
  const [activeTab, setActiveTab] = useState<TabType>('records');

  const permMap: Record<TabType, string> = {
    records: 'Financial Records',
    invoices: 'Invoices',
    bank: 'Bank Accounts',
    loans: 'Loans & Insurance',
    insurance: 'Loans & Insurance',
    tax: 'Tax Records',
    dojo: 'Dojo Settlements'
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


  const [data, setData] = useState<any>({ history: [], invoices: [], banks: [], loans: [], dojo: [], insurance: [], vat: [] });

  const fetchAccounting = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(API_ENDPOINTS.ACCOUNTING, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const d = await res.json();
    setData(d);
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
      setFileFields(prev => ({ ...prev, [name]: target.files![0] }));
    } else {
      const val = target.value;
      setFormData((prev: any) => {
        const next = { ...prev, [name]: val };
        if (activeTab === 'dojo' && (name === 'amount' || name === 'fee')) {
          const amt = parseFloat(next.amount || 0);
          const fee = parseFloat(next.fee || 0);
          next.net = (amt - fee).toFixed(2);
        }
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
    { id: 'dojo', label: 'Dojo Settlements', icon: CreditCard },
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

        <button onClick={() => setIsWide(!isWide)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase shadow-sm">
          {isWide ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          {isWide ? 'Standard' : 'Wide'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>

          {!isWide && canAdd && (
            <div className="lg:col-span-4">
              <Card
                title={editingId ? `Edit ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` : `New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Record`}
                icon={editingId ? Edit : Plus}
                iconColor="bg-slate-800"
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
                        options={[...(data.options || []), 'ADD_NEW']}
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

                      {recordCategory === 'Supplier Payments' && <Field label="Supplier" name="supplier" value={formData.supplier} onChange={handleInputChange} isSelect options={data.suppliers || []} />}
                      {recordCategory === 'Rent' && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Rent From" name="rentStart" value={formData.rentStart} onChange={handleInputChange} type="date" />
                          <Field label="Rent To" name="rentEnd" value={formData.rentEnd} onChange={handleInputChange} type="date" />
                        </div>
                      )}
                      {recordCategory === 'Mortgage' && (
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Payment Mode" name="payMode" value={formData.payMode} onChange={handleInputChange} isSelect options={data.paymentModes || []} />
                          <Field label="Rate (%)" name="interestRate" value={formData.interestRate} onChange={handleInputChange} type="number" step="0.01" />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Type" name="type" value={formData.type} onChange={handleInputChange} isSelect options={data.recordTypes || []} />
                        <Field label="Amount ($)" name="amount" value={formData.amount} onChange={handleInputChange} type="number" step="0.01" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Payment Method" name="payment_method" value={formData.payment_method} onChange={handleInputChange} isSelect options={data.paymentMethods || []} />
                        <Field label="Reference Number" name="reference_number" value={formData.reference_number} onChange={handleInputChange} placeholder="TXN458921 / INV-2026-001" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Payment Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.paymentStatuses || []} />
                        <Field label="Date" name="date" value={formData.date} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Upload Document" name="document" onChange={handleInputChange} type="file" />
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
                      <Field label="Attach PDF" name="pdf" onChange={handleInputChange} type="file" />
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
                      <Field label="Supporting Document" name="document" onChange={handleInputChange} type="file" />
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
                        <Field label="Reminder" name="renewal" value={formData.renewal} onChange={handleInputChange} isSelect options={data.loanReminders || []} />
                      </div>
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.loanStatuses || []} />
                      <Field label="Upload Documents (Agreement, Schedule, etc.)" name="document" onChange={handleInputChange} type="file" />
                    </>
                  )}

                  {activeTab === 'insurance' && (
                    <>
                      <BusinessField
                        value={formData.biz || ''}
                        onChange={(v) => setFormData({ ...formData, biz: v })}
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Policy Type" name="type" value={formData.type} onChange={handleInputChange} placeholder="e.g. Public Liability" />
                      <Field label="Provider" name="provider" value={formData.provider} onChange={handleInputChange} />
                      <Field label="Policy #" name="policy" value={formData.policy} onChange={handleInputChange} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Premium ($)" name="premium" value={formData.premium} onChange={handleInputChange} type="number" />
                        <Field label="Coverage ($)" name="coverage" value={formData.coverage} onChange={handleInputChange} type="number" />
                      </div>
                      <Field label="Insured Asset / Details" name="asset" value={formData.asset} onChange={handleInputChange} placeholder="Address, Registration, or Equipment" />
                      <Field label="Provider Contact" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="Phone or Email" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Date" name="startDate" value={formData.startDate} onChange={handleInputChange} type="date" />
                        <Field label="Expiry Date" name="expiry" value={formData.expiry} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Reminder" name="renewal" value={formData.renewal} onChange={handleInputChange} isSelect options={data.renewalReminders || []} />
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={['Active', 'Expired']} />
                      <Field label="Attach Policy PDF" name="document" onChange={handleInputChange} type="file" />
                    </>
                  )}

                  {activeTab === 'tax' && (
                    <>
                      <BusinessField
                        value={formData.biz || ''}
                        onChange={(v) => setFormData({ ...formData, biz: v })}
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Tax Type" name="type" value={formData.type} onChange={handleInputChange} placeholder="e.g. VAT Q1" />
                      <Field label="Reference #" name="ref" value={formData.ref} onChange={handleInputChange} placeholder="HMRC-123456" />
                      <Field label="Period" name="period" value={formData.period} onChange={handleInputChange} placeholder="Jan - Mar 2024" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Amount ($)" name="amount" value={formData.amount} onChange={handleInputChange} type="number" />
                        <Field label="Filing Date" name="date" value={formData.date} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.vatStatuses || []} />
                      <Field label="Filing Receipt" name="document" onChange={handleInputChange} type="file" />
                    </>
                  )}

                  {activeTab === 'dojo' && (
                    <>
                      <BusinessField
                        value={formData.biz || ''}
                        onChange={(v) => setFormData({ ...formData, biz: v })}
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Transaction Date" name="date" value={formData.date} onChange={handleInputChange} type="date" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Amount ($)" name="amount" value={formData.amount} onChange={handleInputChange} type="number" />
                        <Field label="Fee ($)" name="fee" value={formData.fee} onChange={handleInputChange} type="number" />
                      </div>
                      <Field label="Net ($)" name="net" value={formData.net} onChange={handleInputChange} type="number" disabled />
                      <Field label="Method" name="method" value={formData.method} onChange={handleInputChange} isSelect options={data.dojoMethods || []} />
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.paymentStatuses || []} />
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

          <div className={isWide || !canAdd ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Registry`} icon={FileText}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {activeTab === 'records' && (
                        <>
                          <th className={thClass}>Date</th>
                          <th className={thClass}>Title</th>
                          <th className={thClass}>Category</th>
                          <th className={thClass}>Amount</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'invoices' && (
                        <>
                          <th className={thClass}>Inv # / Type</th>
                          <th className={thClass}>Client / Ref</th>
                          <th className={thClass}>Amount / Method</th>
                          <th className={thClass}>Dates (Inv/Due)</th>
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
                          <th className={thClass}>Date</th>
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
                    {activeTab === 'records' && (data.history?.map((r: any, i: number) => <RecordRow key={i} {...r} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'records')} onDelete={() => handleDeleteClick(`record-${r.id}`)} onView={() => handleViewDoc(r.title, r.document_url, r.category)} />) || null)}
                    {activeTab === 'invoices' && (data.invoices?.map((r: any, i: number) => <InvoiceRow key={i} {...r} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'invoices')} onDelete={() => handleDeleteClick(`invoice-${r.id}`)} onView={() => handleViewDoc(`Invoice ${r.num}`, r.pdf_url, 'Invoicing')} />) || null)}
                    {activeTab === 'bank' && (data.banks?.map((r: any, i: number) => <BankRow key={i} {...r} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'bank')} onDelete={() => handleDeleteClick(`bank-${r.id}`)} onView={() => handleViewDoc(`${r.bank_name} - ${r.account_name}`, r.document_url, 'Bank Record')} />) || null)}
                    {activeTab === 'loans' && (data.loans?.map((r: any, i: number) => <LoanRow key={i} {...r} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'loans')} onDelete={() => handleDeleteClick(`loan-${r.id}`)} onView={() => handleViewDoc(`${r.loan} Agreement`, r.document_url, 'Loan Document')} />) || null)}
                    {activeTab === 'dojo' && (data.dojo?.map((r: any, i: number) => <DojoRow key={i} {...r} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'dojo')} onDelete={() => handleDeleteClick(`dojo-${r.id}`)} />) || null)}
                    {activeTab === 'insurance' && (data.insurance?.map((r: any, i: number) => <InsuranceRow key={i} {...r} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'insurance')} onDelete={() => handleDeleteClick(`insurance-${r.id}`)} onView={() => handleViewDoc(`${r.type} Policy`, r.document_url, 'Insurance')} />) || null)}
                    {activeTab === 'tax' && (data.vat?.map((r: any, i: number) => <TaxRow key={i} {...r} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(r.id, r, 'tax')} onDelete={() => handleDeleteClick(`tax-${r.id}`)} onView={() => handleViewDoc(`${r.type} Filing`, r.document_url, 'Taxation')} />) || null)}
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

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, onChange, disabled, value, name }: any) {
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
    </div>
  );
}

function RecordRow({ date, title, category, amount, status, ref, method, onEdit, onDelete, onView, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 text-slate-500 font-mono tracking-tighter text-xs">{date}</td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{title}</div>
        {ref && <div className="text-[10px] text-slate-400 font-medium">Ref: {ref}</div>}
      </td>
      <td className="px-4 py-4">
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${category === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{category}</div>
        {method && <div className="text-[10px] text-slate-400 font-medium mt-1">{method}</div>}
      </td>
      <td className="px-4 py-4 font-bold text-slate-800">${Number(amount).toLocaleString()}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions onEdit={onEdit} onDelete={onDelete} onView={onView} showEye canEdit={canEdit} canDelete={canDelete} /></td>
    </tr>
  );
}

function InvoiceRow({ num, client, amount, due, date, status, invoice_type, method, ref, onEdit, onDelete, onView, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{num}</div>
        <div className="text-[10px] text-slate-400 font-medium">{invoice_type}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-slate-600 font-medium">{client}</div>
        {ref && <div className="text-[10px] text-slate-400 font-medium">Ref: {ref}</div>}
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">${Number(amount).toLocaleString()}</div>
        <div className="text-[10px] text-slate-400 font-medium">{method}</div>
      </td>
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">
        <div>{date}</div>
        <div className="text-[10px] text-red-400">Due: {due}</div>
      </td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions showDownload onEdit={onEdit} onDelete={onDelete} onView={onView} canEdit={canEdit} canDelete={canDelete} /></td>
    </tr>
  );
}

function BankRow({ bank, acc, num, sort, type, status, onEdit, onDelete, onView, canEdit, canDelete }: any) {
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
      <td className="px-4 py-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">{type}</span></td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions showEye onEdit={onEdit} onDelete={onDelete} onView={onView} canEdit={canEdit} canDelete={canDelete} /></td>
    </tr>
  );
}

function LoanRow({ loan, purpose, lender, total, os, monthly, rate, status, onEdit, onDelete, onView, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{loan}</div>
        <div className="text-[10px] text-slate-400 font-medium">{purpose || lender}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">${Number(total).toLocaleString()}</div>
        <div className="text-[10px] text-red-500 font-bold">O/S: ${Number(os).toLocaleString()}</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">${Number(monthly).toLocaleString()}</div>
        <div className="text-[10px] text-slate-400 font-medium">{rate}% APR</div>
      </td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions showEye onEdit={onEdit} onDelete={onDelete} onView={onView} canEdit={canEdit} canDelete={canDelete} /></td>
    </tr>
  );
}

function DojoRow({ date, amount, fee, net, status, onEdit, onDelete, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">{date}</td>
      <td className="px-4 py-4 font-bold text-slate-800">${Number(amount).toLocaleString()}</td>
      <td className="px-4 py-4 text-red-500 font-medium">-${Number(fee).toLocaleString()}</td>
      <td className="px-4 py-4 font-extrabold text-slate-800">${Number(net).toLocaleString()}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions onEdit={onEdit} onDelete={onDelete} canEdit={canEdit} canDelete={canDelete} /></td>
    </tr>
  );
}

function InsuranceRow({ type, asset, provider, policy, premium, expiry, status, onEdit, onDelete, onView, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{type}</div>
        <div className="text-[10px] text-slate-400 font-medium">{asset || provider}</div>
      </td>
      <td className="px-4 py-4 font-mono text-slate-600 text-xs">{policy}</td>
      <td className="px-4 py-4 font-bold text-slate-800">${Number(premium).toLocaleString()}</td>
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">{expiry}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions showDownload onEdit={onEdit} onDelete={onDelete} onView={onView} canEdit={canEdit} canDelete={canDelete} /></td>
    </tr>
  );
}

function TaxRow({ type, period, amount, date, status, onEdit, onDelete, onView, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{type}</div>
        <div className="text-[10px] text-slate-400 font-medium">{period}</div>
      </td>
      <td className="px-4 py-4 font-bold text-slate-800">${Number(amount).toLocaleString()}</td>
      <td className="px-4 py-4 text-slate-500 font-mono text-xs">{date}</td>
      <td className="px-4 py-4"><StatusBadge status={status} /></td>
      <td className="px-4 py-4"><RowActions showDownload onEdit={onEdit} onDelete={onDelete} onView={onView} canEdit={canEdit} canDelete={canDelete} /></td>
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
      {showEye && <button onClick={onView} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"><Eye className="w-3.5 h-3.5" /></button>}
      {showDownload && <button onClick={onView} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"><FileSearch className="w-3.5 h-3.5" /></button>}
      {canDelete && <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
    </div>
  );
}
