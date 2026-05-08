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
  FileText
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';
import { usePermissions } from '@/hooks/usePermissions';


type TabType = 'suppliers' | 'orders';

export default function SupplierModule() {
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


  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_ENDPOINTS.SUPPLIERS, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  const handleEdit = (id: string, rowData: any, tab: TabType) => {
    setEditingId(id);
    setFormData(rowData);
    setActiveTab(tab);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      console.log('Updating:', editingId, formData);
    } else {
      console.log('Creating:', formData);
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
      console.log('Deleting:', deleteId);
      // TODO: API call
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
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
        <button 
          onClick={() => setIsWide(!isWide)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider shadow-sm"
        >
          {isWide ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          {isWide ? 'Standard' : 'Wide'} View
        </button>
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
                      <Field label="Supplier Name" placeholder="e.g. Acme Supplies Ltd" />
                      <Field label="Category" isSelect options={data.options?.categories || []} />
                      <div className="grid grid-cols-1 gap-4">
                        <Field label="Email Address" type="email" placeholder="contact@vendor.com" />
                        <Field label="Phone Number" type="tel" placeholder="+44 20 0000 0000" />
                      </div>
                      <Field label="Business Address" isTextArea placeholder="Full headquarters address..." />
                      <Field label="Status" isSelect options={data.options?.statuses || []} />
                      <Field label="Internal Notes" isTextArea placeholder="Payment terms, delivery preferences, etc." />
                    </>
                  )}

                  {activeTab === 'orders' && (
                    <>
                      <Field label="Select Supplier" isSelect options={data.options?.names || []} />
                      <Field label="PO Number" placeholder="e.g. PO-2026-001" />
                      <Field label="Order Amount ($)" type="number" step="0.01" />
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Details</div>
                         <div className="grid grid-cols-2 gap-3">
                             <Field label="Product Category" isSelect options={data.options?.productCategories || []} />
                            <Field label="Quantity" type="number" />
                         </div>
                         <Field label="Product Name" placeholder="e.g. Paper Reams (A4)" />
                      </div>
                      <Field label="Delivery Due Date" type="date" />
                       <Field label="Order Status" isSelect options={data.options?.orderStatuses || []} />
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
                          <th className={thClass}>Contact Info</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'orders' && (
                        <>
                          <th className={thClass}>PO # / Supplier</th>
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
                      data.suppliers?.map((s: any, i: number) => <SupplierRow key={i} {...s} onEdit={() => handleEdit(`supplier-${i}`, s, 'suppliers')} onDelete={() => handleDeleteClick(`supplier-${i}`)} canEdit={canEdit} canDelete={canDelete} />) || null
                    )}
                    {activeTab === 'orders' && (
                      data.orders?.map((o: any, i: number) => (
                        <OrderRow
                          key={i}
                          {...o}
                          onEdit={() => handleEdit(`order-${i}`, o, 'orders')}
                          onView={() => handleViewDoc(`Purchase Order ${o.num}`, 'Procurement')}
                          canEdit={canEdit}
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

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, disabled, value }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <select className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium">
          <option value="">Select Option...</option>
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea rows={2} className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" placeholder={placeholder} />
      ) : (
        <input 
          disabled={disabled} 
          type={type} 
          defaultValue={value}
          className={`w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium ${disabled ? 'bg-slate-100 opacity-60 cursor-not-allowed' : ''}`} 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}

function SupplierRow({ id, name, category, email, phone, status, onEdit, onDelete, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="text-[10px] text-slate-400 font-bold mb-0.5">{id}</div>
        <div className="font-bold text-slate-800">{name}</div>
      </td>
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase border border-slate-200">{category}</span>
      </td>
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

function OrderRow({ num, supplier, product, qty, amount, due, status, onEdit, onView, canEdit }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{num}</div>
        <div className="text-[10px] text-slate-400 font-medium">{supplier}</div>
      </td>
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
