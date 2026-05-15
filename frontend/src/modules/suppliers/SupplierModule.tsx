'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { 
  Truck, 
  ShoppingCart, 
  Plus, 
  Edit, 
  Trash2, 
  Maximize2, 
  Minimize2,
  Mail,
  Phone,
  MapPin,
  Tag,
  Package,
  Calendar,
  DollarSign,
  Printer,
  FileText,
  FileSearch
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';
import { usePermissions } from '@/hooks/usePermissions';
import { BusinessField } from '@/components/ui/BusinessField';
import { AlertModal } from '@/components/ui/AlertModal';


type TabType = 'suppliers' | 'orders';

export default function SupplierModule({ selectedBusiness = 'All Entities' }: { selectedBusiness?: string }) {
  const { canAdd, canEdit, canDelete } = usePermissions('Suppliers');
  const [activeTab, setActiveTab] = useState<TabType>('suppliers');
  const [isWide, setIsWide] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [data, setData] = useState<any>({ suppliers: [], orders: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'info' as 'info' | 'warning' | 'error' });


  const fetchData = () => {
    fetch(API_ENDPOINTS.SUPPLIERS, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(async res => {
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          const text = await res.text();
          console.error("Fetch error details:", text);
          throw new Error('Fetch failed: ' + text.substring(0, 100));
        }
        return res.json();
      })
      .then(setData)
      .catch(err => {
        console.error("Supplier data fetch error:", err);
      });
  };

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');

  useEffect(() => {
    if (searchParams?.get('view') === 'wide') {
      setIsWide(true);
    }
    const targetTab = searchParams?.get('tab');
    if (targetTab === 'suppliers') setActiveTab('suppliers');
    if (targetTab === 'orders') setActiveTab('orders');
    
    const s = searchParams?.get('search');
    if (s) setSearchTerm(s);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, []);

  const filterData = (list: any[]) => {
    if (!list) return [];
    return list.filter((r: any) => {
      const bizMatch = selectedBusiness === 'All Entities' || r.biz === selectedBusiness;
      const searchMatch = !searchTerm || Object.values(r).some(v => 
        String(v).toLowerCase().includes(searchTerm.toLowerCase())
      );
      return bizMatch && searchMatch;
    });
  };

  const handleEdit = (id: string, rowData: any, tab: TabType) => {
    setEditingId(id);
    setFormData(rowData);
    setActiveTab(tab);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSupplier = activeTab === 'suppliers';
    const endpoint = isSupplier ? `${API_ENDPOINTS.SUPPLIERS}suppliers/` : `${API_ENDPOINTS.SUPPLIERS}orders/`;
    const url = editingId && !editingId.includes('supplier-') && !editingId.includes('order-') ? `${endpoint}${editingId}/` : endpoint;
    const method = editingId && !editingId.includes('supplier-') && !editingId.includes('order-') ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Save failed');
      
      fetchData();
      handleCancelEdit();
    } catch (err) {
      console.error('Submit error:', err);
      setAlertConfig({
        title: "Submission Error",
        message: "Failed to save the record. Please check your connection and try again.",
        type: 'error'
      });
      setShowAlert(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleViewDoc = (docTitle: string, type?: string) => {
    setSelectedDoc({ title: docTitle, type: type });
    setIsDrawerOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const isSupplier = activeTab === 'suppliers';
    const endpoint = isSupplier ? `${API_ENDPOINTS.SUPPLIERS}suppliers/` : `${API_ENDPOINTS.SUPPLIERS}orders/`;
    const url = `${endpoint}${deleteId}/`;

    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) throw new Error('Delete failed');
      
      fetchData();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Delete error:', err);
      setAlertConfig({
        title: "Deletion Failed",
        message: "We encountered an error while trying to delete this record.",
        type: 'error'
      });
      setShowAlert(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Tab Navigation & Search */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between flex-shrink-0 sticky top-0 z-10 gap-4 flex-wrap">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          <TabButton 
            active={activeTab === 'suppliers'} 
            label="Supplier Directory" 
            icon={Truck} 
            onClick={() => setActiveTab('suppliers')} 
          />
          <TabButton 
            active={activeTab === 'orders'} 
            label="Purchase Orders" 
            icon={ShoppingCart} 
            onClick={() => setActiveTab('orders')} 
          />
        </div>
        
        <div className="flex items-center gap-4 flex-1 justify-end min-w-[300px]">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FileSearch className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none"
            />
          </div>

          <button 
            onClick={() => setIsWide(!isWide)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider shadow-sm shrink-0"
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
          {!isWide && canAdd && (
            <div className="lg:col-span-4">
              <Card 
                title={editingId ? (activeTab === 'suppliers' ? 'Edit Supplier' : 'Edit Purchase Order') : (activeTab === 'suppliers' ? 'Register New Supplier' : 'Create Purchase Order')} 
                icon={editingId ? Edit : Plus} 
                iconColor="bg-slate-800"
              >
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {activeTab === 'suppliers' && (
                    <>
                      <Field label="Supplier ID" placeholder="AUTO-GENERATED" disabled value={data.metadata?.nextId || "SUP-..."} />
                      <Field label="Supplier Name" placeholder="e.g. Acme Supplies Ltd" value={formData.name || ''} onChange={(v: string) => setFormData({...formData, name: v})} />
                      <BusinessField 
                        value={formData.biz || ''} 
                        onChange={(v) => setFormData({...formData, biz: v})} 
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Category" isSelect options={data.options?.categories || []} value={formData.category || ''} onChange={(v: string) => setFormData({...formData, category: v})} />
                      <div className="grid grid-cols-1 gap-4">
                        <Field label="Email Address" type="email" placeholder="contact@vendor.com" value={formData.email || ''} onChange={(v: string) => setFormData({...formData, email: v})} />
                        <Field label="Phone Number" type="tel" placeholder="+44 20 0000 0000" value={formData.phone || ''} onChange={(v: string) => setFormData({...formData, phone: v})} />
                      </div>
                      <Field label="Business Address" isTextArea placeholder="Full headquarters address..." value={formData.address || ''} onChange={(v: string) => setFormData({...formData, address: v})} />
                      <Field label="Status" isSelect options={data.options?.statuses || []} value={formData.status || ''} onChange={(v: string) => setFormData({...formData, status: v})} />
                      <Field label="Internal Notes" isTextArea placeholder="Payment terms, delivery preferences, etc." value={formData.notes || ''} onChange={(v: string) => setFormData({...formData, notes: v})} />
                    </>
                  )}

                  {activeTab === 'orders' && (
                    <>
                      <BusinessField 
                        value={formData.biz || ''} 
                        onChange={(v) => setFormData({...formData, biz: v})} 
                        businesses={data.options?.businesses || []}
                      />
                      <Field 
                        label="Select Supplier" 
                        isSelect 
                        options={data.suppliers?.filter((s: any) => !formData.biz || s.biz === formData.biz).map((s: any) => s.name) || []} 
                        value={formData.supplier || ''} 
                        onChange={(v: string) => setFormData({...formData, supplier: v})} 
                      />
                      <Field label="PO Number" placeholder="e.g. PO-2026-001" value={formData.num || ''} onChange={(v: string) => setFormData({...formData, num: v})} />
                      <Field label="Order Amount ($)" type="number" step="0.01" value={formData.amount || ''} onChange={(v: string) => setFormData({...formData, amount: v})} />
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Details</div>
                         <div className="grid grid-cols-2 gap-3">
                             <Field label="Product Category" isSelect options={data.options?.productCategories || []} value={formData.product_category || ''} onChange={(v: string) => setFormData({...formData, product_category: v})} />
                            <Field label="Quantity" type="number" value={formData.qty || ''} onChange={(v: string) => setFormData({...formData, qty: v})} />
                         </div>
                         <Field label="Product Name" placeholder="e.g. Paper Reams (A4)" value={formData.product || ''} onChange={(v: string) => setFormData({...formData, product: v})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Delivery Due Date" type="date" value={formData.due || ''} onChange={(v: string) => setFormData({...formData, due: v})} />
                        <Field label="Reminder (Days)" isSelect options={['1', '3', '7', '14']} value={formData.reminder_days || '3'} onChange={(v: string) => setFormData({...formData, reminder_days: v})} />
                      </div>
                       <Field label="Order Status" isSelect options={data.options?.orderStatuses || []} value={formData.status || ''} onChange={(v: string) => setFormData({...formData, status: v})} />
                    </>
                  )}

                  <button className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all transform active:scale-[0.98]">
                    {editingId ? 'Update Record' : (activeTab === 'suppliers' ? 'Register Supplier' : 'Generate PO')}
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
          <div className={isWide || !canAdd ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card 
              title={activeTab === 'suppliers' ? 'Vendor Partner Registry' : 'Purchase Order History'} 
              icon={activeTab === 'suppliers' ? Truck : ShoppingCart}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {activeTab === 'suppliers' && (
                        <>
                          <th className={thClass}>Supplier Name</th>
                          <th className={thClass}>Category</th>
                          {isWide && <th className={thClass}>Business</th>}
                          <th className={thClass}>Contact Info</th>
                          {isWide && <th className={thClass}>Address</th>}
                          {isWide && <th className={thClass}>Notes</th>}
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'orders' && (
                        <>
                          <th className={thClass}>PO # / Supplier</th>
                          {isWide && <th className={thClass}>Business</th>}
                          <th className={thClass}>Product Details</th>
                          <th className={thClass}>Amount / Due</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'suppliers' && (
                      filterData(data.suppliers).map((s: any, i: number) => <SupplierRow key={i} {...s} isWide={isWide} onEdit={() => handleEdit(s.id || `supplier-${i}`, s, 'suppliers')} onDelete={() => handleDeleteClick(s.id || `supplier-${i}`)} canEdit={canEdit} canDelete={canDelete} />)
                    )}
                    {activeTab === 'orders' && (
                      filterData(data.orders).map((o: any, i: number) => (
                          <OrderRow
                            key={i}
                            {...o}
                            isWide={isWide}
                            onEdit={() => handleEdit(o.id || `order-${i}`, o, 'orders')}
                            onView={() => handleViewDoc(`Purchase Order ${o.num}`, 'Procurement')}
                            canEdit={canEdit}
                          />
                        ))
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

      <AlertModal 
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>

  );
}

const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider";

function TabButton({ active, label, icon: Icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
        active ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-800' : 'text-slate-400'}`} />
      {label}
    </button>
  );
}

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, disabled, value, onChange }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <select 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium"
        >
          <option value="">Select Option...</option>
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea 
          rows={2} 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" 
          placeholder={placeholder} 
        />
      ) : (
        <input 
          disabled={disabled} 
          type={type} 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium ${disabled ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`} 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}

function SupplierRow({ supId, name, category, email, phone, biz, addr, notes, status, isWide, onEdit, onDelete, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="text-[10px] text-slate-400 font-bold mb-0.5">{supId}</div>
        <div className="font-bold text-slate-800">{name}</div>
      </td>
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase border border-slate-200">{category}</span>
      </td>
      {isWide && (
        <td className="px-4 py-4">
          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase">{biz}</span>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
          <Mail className="w-3 h-3 text-slate-400" />
          {email}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium tracking-tight">
          <Phone className="w-3 h-3 text-slate-400" />
          {phone}
        </div>
      </td>
      {isWide && <td className="px-4 py-4 text-slate-500 text-[10px] max-w-[200px] truncate" title={addr}>{addr || "-"}</td>}
      {isWide && <td className="px-4 py-4 text-slate-400 text-[10px] italic max-w-[150px] truncate" title={notes}>{notes || "-"}</td>}
      <td className="px-4 py-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
        }`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          {canEdit && (
            <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function OrderRow({ num, supplier, product, qty, amount, due, biz, status, isWide, onEdit, onView, canEdit }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{num}</div>
        <div className="text-[10px] text-slate-400 font-medium">{supplier}</div>
      </td>
      {isWide && (
        <td className="px-4 py-4">
          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase">{biz}</span>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">{product}</div>
        <div className="text-[10px] text-slate-400 font-medium">Qty: {qty} units</div>
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">{amount}</div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-1">
          <Calendar className="w-3 h-3" />
          {due}
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
          status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
          'bg-red-50 text-red-600'
        }`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onView}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>

    </tr>
  );
}
