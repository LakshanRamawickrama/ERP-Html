'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Edit,
  History,
  Printer,
  Eye,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusinessField } from '@/components/ui/BusinessField';
import { usePermissions } from '@/hooks/usePermissions';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';
import { PAYMENT_RECORDS } from '@/lib/db';

export default function PaymentModule() {
  const { canAdd, canEdit, canDelete } = usePermissions('Payment Services');
  const [isWide, setIsWide] = useState(false);
  const [provider, setProvider] = useState<string>('');
  const [customProvider, setCustomProvider] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterProvider, setFilterProvider] = useState<string>('All');

  // Initialize with seed data
  const [data, setData] = useState<any>({ transactions: PAYMENT_RECORDS, businesses: [] });
  const [formData, setFormData] = useState<any>({
    biz: '',
    type: 'Bill payment',
    transDate: new Date().toISOString().split('T')[0],
    transRef: '',
    gross: 0,
    comm: 0,
    net: 0,
    settlementDate: '',
    status: 'Pending',
    method: 'Cash',
    bankAccount: 'Main Business Account (...1234)',
    location: '',
    staff: '',
    notes: '',
    drawDate: '',
    ticketNum: '',
    gameType: 'Lotto',
    prize: 0,
    claimStatus: 'Unclaimed',
    billType: '',
    custRef: '',
    providerName: '',
    voucherCode: ''
  });

  const fetchPayments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API_ENDPOINTS.PAYMENTS, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const result = await res.json();
        if (result.transactions && result.transactions.length > 0) {
           setData(result);
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    if (field === 'gross' || field === 'comm') {
      const gross = parseFloat(newFormData.gross) || 0;
      const comm = parseFloat(newFormData.comm) || 0;
      newFormData.net = (gross - comm).toFixed(2);
    }
    setFormData(newFormData);
  };

  const handleEdit = (id: string, rowData: any) => {
    setEditingId(id);
    setFormData(rowData);
    setProvider(rowData.provider);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
        biz: '', type: 'Bill payment', transDate: new Date().toISOString().split('T')[0],
        transRef: '', gross: 0, comm: 0, net: 0, settlementDate: '', status: 'Pending',
        method: 'Cash', bankAccount: 'Main Business Account (...1234)', location: '', staff: '', notes: ''
    });
    setProvider('');
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_ENDPOINTS.PAYMENTS}${deleteId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPayments();
      } else {
        setData((prev: any) => ({
          ...prev,
          transactions: prev.transactions.filter((t: any) => t.id !== deleteId)
        }));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
    setShowDeleteModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('token');
    
    const finalProvider = provider === 'ADD_NEW' ? customProvider : provider;
    const payload = { ...formData, provider: finalProvider };

    try {
      const url = editingId ? `${API_ENDPOINTS.PAYMENTS}${editingId}/` : API_ENDPOINTS.PAYMENTS;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchPayments();
        handleCancelEdit();
      } else {
        const newRecord = { ...payload, id: editingId || `pay-${Date.now()}` };
        setData((prev: any) => ({
          ...prev,
          transactions: editingId 
            ? prev.transactions.map((t: any) => t.id === editingId ? newRecord : t)
            : [newRecord, ...prev.transactions]
        }));
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDoc = (t: any) => {
    setSelectedDoc({
      title: `${t.provider} - ${t.transRef}`,
      type: t.type,
      status: t.status,
      date: t.transDate,
      url: t.docUrl
    });
    setIsDrawerOpen(true);
  };

  const commonProviders = [
    'Dojo', 'Barclaycard', 'Worldpay', 'SumUp', 
    'Revolut Business', 'Square', 'Stripe', 'Global Payments'
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] animate-in fade-in duration-500 overflow-y-auto p-6">
      
      <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
        
        {/* Form Column */}
        {!isWide && canAdd && (
          <div className="lg:col-span-4">
            <Card 
              title={editingId ? "Update Transaction" : "New Merchant Transaction"} 
              icon={editingId ? Edit : Plus} 
              iconColor="bg-amber-500"
              headerAction={isWide && canAdd && (
                <button 
                  onClick={() => setIsWide(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-bold rounded-lg shadow-sm hover:bg-amber-600 transition-all uppercase"
                >
                  <Plus className="w-3 h-3" /> New Entry
                </button>
              )}
            >
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Field 
                    label="Service Provider" 
                    isSelect 
                    options={['Dojo', 'PayPoint', 'PayZone', 'Lottery', 'ADD_NEW']} 
                    value={provider}
                    onChange={setProvider}
                  />

                  {provider === 'ADD_NEW' && (
                    <Field 
                      label="Custom Provider Name" 
                      placeholder="e.g. Worldpay" 
                      value={customProvider} 
                      onChange={setCustomProvider} 
                    />
                  )}

                  {provider === 'ADD_NEW' && (
                    <div className="space-y-2 animate-in fade-in">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Select</label>
                      <div className="flex flex-wrap gap-2">
                        {commonProviders.map(p => (
                          <span 
                            key={p} 
                            onClick={() => setProvider(p)}
                            className={cn(
                              "px-2 py-1 rounded-md text-[9px] font-bold cursor-pointer transition-all border",
                              provider === p ? "bg-amber-500 text-white border-amber-600" : "bg-white text-slate-600 border-slate-200"
                            )}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <BusinessField 
                    value={formData.biz || ''} 
                    onChange={(v) => handleInputChange('biz', v)} 
                    businesses={data.businesses || []}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Field 
                      label="Service Type" 
                      isSelect 
                      options={['Bill payment', 'Top-up', 'Lottery sale', 'Parcel', 'Other']} 
                      value={formData.type}
                      onChange={(v: string) => handleInputChange('type', v)}
                    />
                    <Field 
                      label="Date" 
                      type="date" 
                      value={formData.transDate}
                      onChange={(v: string) => handleInputChange('transDate', v)}
                    />
                  </div>

                  <Field 
                    label="Transaction Reference" 
                    placeholder="e.g. TR-123456" 
                    value={formData.transRef}
                    onChange={(v: string) => handleInputChange('transRef', v)}
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Gross (£)" type="number" value={formData.gross} onChange={(v: string) => handleInputChange('gross', v)} />
                    <Field label="Comm. (£)" type="number" value={formData.comm} onChange={(v: string) => handleInputChange('comm', v)} />
                    <Field label="Net (£)" type="number" value={formData.net} disabled />
                  </div>

                  {/* Conditional Sections */}
                  {provider === 'Dojo' && (
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-4 animate-in zoom-in-95">
                      <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Dojo Settlement</div>
                      <Field label="Settlement Status" isSelect options={['Pending', 'Processing', 'Paid', 'Failed', 'Reversed', 'Refunded']} value={formData.status} onChange={(v: string) => handleInputChange('status', v)} />
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Upload Settlement Docs</label>
                        <input type="file" className="w-full text-[10px] file:bg-indigo-600 file:text-white file:border-none file:px-3 file:py-1.5 file:rounded-md file:mr-3 cursor-pointer" />
                      </div>
                    </div>
                  )}

                  {provider === 'Lottery' && (
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-4 animate-in zoom-in-95">
                      <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Lottery Details</div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Draw Date" type="date" value={formData.drawDate} onChange={(v: string) => handleInputChange('drawDate', v)} />
                        <Field label="Game Type" isSelect options={['Lotto', 'EuroMillions', 'Thunderball', 'Set For Life', 'Scratchcard', 'Other']} value={formData.gameType} onChange={(v: string) => handleInputChange('gameType', v)} />
                      </div>
                      <Field label="Ticket Number" value={formData.ticketNum} onChange={(v: string) => handleInputChange('ticketNum', v)} />
                      <div className="grid grid-cols-2 gap-3">
                         <Field label="Prize (£)" type="number" value={formData.prize} onChange={(v: string) => handleInputChange('prize', v)} />
                         <Field label="Claim Status" isSelect options={['Unclaimed', 'Claimed', 'Expired']} value={formData.claimStatus} onChange={(v: string) => handleInputChange('claimStatus', v)} />
                      </div>
                    </div>
                  )}

                  {(provider === 'PayPoint' || provider === 'PayZone') && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4 animate-in zoom-in-95">
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{provider} Details</div>
                      <Field label="Bill Type" placeholder="Gas, Electricity, Water..." value={formData.billType} onChange={(v: string) => handleInputChange('billType', v)} />
                      <Field label="Account Ref" value={formData.custRef} onChange={(v: string) => handleInputChange('custRef', v)} />
                      <Field label="Provider Name" value={formData.providerName} onChange={(v: string) => handleInputChange('providerName', v)} />
                      <Field label="Voucher Code" value={formData.voucherCode} onChange={(v: string) => handleInputChange('voucherCode', v)} />
                    </div>
                  )}

                  <Field label="Notes" isTextArea value={formData.notes} onChange={(v: string) => handleInputChange('notes', v)} />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || !provider}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : (editingId ? 'Update Record' : 'Save Transaction')}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="w-full py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
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
            title="Merchant Transaction History" 
            icon={History}
            headerAction={
              <div className="flex items-center gap-3">
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {['All', 'Dojo', 'PayPoint', 'PayZone', 'Lottery'].map(p => (
                    <button
                      key={p}
                      onClick={() => setFilterProvider(p)}
                      className={cn(
                        "px-3 py-1 text-[10px] font-bold rounded-md transition-all uppercase tracking-tight",
                        filterProvider === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
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
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className={thClass}>Provider / Ref</th>
                    {isWide && <th className={thClass}>Entity</th>}
                    <th className={thClass}>Date / Type</th>
                    {isWide && <th className={thClass}>Service Details</th>}
                    <th className={thClass}>Financials</th>
                    <th className={thClass}>Status</th>
                    {isWide && <th className={thClass}>Notes</th>}
                    <th className={thClass}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.transactions
                    ?.filter((t: any) => filterProvider === 'All' || t.provider === filterProvider)
                    .map((t: any) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800">{t.provider}</div>
                          <div className="text-[10px] text-slate-400 font-medium font-mono">{t.transRef}</div>
                        </td>
                        {isWide && (
                          <td className="px-4 py-3">
                            <div className="text-xs font-bold text-slate-600">{t.biz || 'N/A'}</div>
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <div className="text-xs font-bold text-slate-700">{t.transDate}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-tight">{t.type}</div>
                        </td>
                        {isWide && (
                          <td className="px-4 py-3">
                            {t.provider === 'Lottery' ? (
                              <div className="space-y-1">
                                <div className="text-[10px] font-bold text-orange-600">Ticket: {t.ticketNum || '-'}</div>
                                <div className="text-[9px] text-slate-500">{t.gameType} | Prize: £{t.prize || 0}</div>
                              </div>
                            ) : (t.provider === 'PayPoint' || t.provider === 'PayZone') ? (
                              <div className="space-y-1">
                                <div className="text-[10px] font-bold text-blue-600">Bill: {t.billType || '-'}</div>
                                <div className="text-[9px] text-slate-500">Ref: {t.custRef || '-'}</div>
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-400 italic">No extra details</div>
                            )}
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <div className="text-xs font-black text-slate-800">G: £{t.gross}</div>
                          <div className="text-[10px] text-red-500 font-bold">C: £{t.comm} | N: £{t.net}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", 
                            t.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                            t.status === 'Failed' ? 'bg-red-50 text-red-600' : 
                            'bg-amber-50 text-amber-600'
                          )}>
                            {t.status}
                          </span>
                        </td>
                        {isWide && (
                          <td className="px-4 py-3 max-w-[150px] truncate">
                            <div className="text-[10px] text-slate-500" title={t.notes}>{t.notes || '-'}</div>
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {t.docUrl && (
                              <button onClick={() => handleViewDoc(t)} className="p-1.5 border border-slate-200 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all">
                                <Eye size={14} />
                              </button>
                            )}
                            {canEdit && (
                              <button onClick={() => handleEdit(t.id, t)} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
                                <Edit size={14} />
                              </button>
                            )}
                            {canDelete && (
                              <button onClick={() => handleDeleteClick(t.id)} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all">
                                <Trash2 size={14} />
                              </button>
                            )}
                            <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
                              <Printer size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {(!data.transactions || data.transactions.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
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

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, disabled, value, onChange }: any) {
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
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea 
          rows={2} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" 
          placeholder={placeholder} 
        />
      ) : (
        <input 
          disabled={disabled} 
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium ${disabled ? 'bg-slate-100 opacity-60' : ''}`} 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}
