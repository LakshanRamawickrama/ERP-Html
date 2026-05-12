'use client';

import React, { useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { 
  Boxes, 
  Package, 
  ArrowLeftRight, 
  PlusCircle, 
  Edit, 
  Maximize2,
  Minimize2,
  AlertTriangle,
  ClipboardList,
  Trash2
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { usePermissions } from '@/hooks/usePermissions';
import { BusinessField } from '@/components/ui/BusinessField';

type TabType = 'stock' | 'move';

export default function InventoryModule() {
  const { canAdd, canEdit, canDelete } = usePermissions('Inventory Management');
  const [activeTab, setActiveTab] = useState<TabType>('stock');
  const [isWide, setIsWide] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({ type: 'IN' });

  const [data, setData] = useState<any>({ alerts: [], stock: [], moves: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchInventory = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(API_ENDPOINTS.INVENTORY, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const d = await res.json();
    setData(d);
  };

  React.useEffect(() => {
    fetchInventory();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id: string, rowData: any, tab: TabType) => {
    setEditingId(id);
    setFormData(rowData);
    setActiveTab(tab);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ type: 'IN' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const endpoint = activeTab === 'stock' ? 'products/' : 'movements/';
    
    let realId = editingId;
    if (realId?.includes('-')) realId = null;

    const url = realId 
      ? `${API_ENDPOINTS.INVENTORY}${endpoint}${realId}/`
      : `${API_ENDPOINTS.INVENTORY}${endpoint}`;
    
    const method = realId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchInventory();
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Inventory save error:', err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem('token');
    const type = deleteId.split('-')[0];
    const endpoint = type === 'stock' ? 'products/' : 'movements/';
    const realId = deleteId.split('-')[1];

    const url = `${API_ENDPOINTS.INVENTORY}${endpoint}${realId}/`;

    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchInventory();
        setShowDeleteModal(false);
        setDeleteId(null);
      }
    } catch (err) {
      console.error('Inventory delete error:', err);
    }
  };

  const alerts = data.alerts || [];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex gap-6">
          <TabButton active={activeTab === 'stock'} label="Master Inventory" onClick={() => setActiveTab('stock')} />
          <TabButton active={activeTab === 'move'} label="Stock Movements (In/Out)" onClick={() => setActiveTab('move')} />
        </div>

        {/* Automated alerts moved to central Reminders module */}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && canAdd && (
            <div className="lg:col-span-4">
              <Card 
                title={editingId ? (activeTab === 'stock' ? "Edit Item" : "Edit Movement") : (activeTab === 'stock' ? "Add New Item" : "Log Movement")} 
                icon={editingId ? Edit : PlusCircle} 
                iconColor="bg-[#2c3e50]"
              >
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {activeTab === 'stock' && (
                    <>
                      <BusinessField 
                        value={formData.biz || ''} 
                        onChange={(v) => setFormData((prev: any) => ({ ...prev, biz: v }))} 
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Item Name *" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Milk Packet 1L" />
                      <Field label="Category *" name="category" value={formData.category} onChange={handleInputChange} isSelect options={data.inventoryCategories || []} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Initial Stock" name="quantity" value={formData.quantity} onChange={handleInputChange} type="number" />
                        <Field label="Min Stock Level" name="min_stock" value={formData.min_stock} onChange={handleInputChange} type="number" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Unit Price" name="price" value={formData.price} onChange={handleInputChange} type="number" />
                        <Field label="Supplier Ref" name="supplier_ref" value={formData.supplier_ref} onChange={handleInputChange} placeholder="SUP-XXX" />
                      </div>
                      <Field label="Status" name="status" value={formData.status || 'Active'} onChange={handleInputChange} isSelect options={['Active', 'Discontinued']} />
                      <Field label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} isTextArea />
                    </>
                  )}
                  {activeTab === 'move' && (
                    <>
                      <BusinessField 
                        value={formData.biz || ''} 
                        onChange={(v) => setFormData((prev: any) => ({ ...prev, biz: v }))} 
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Select Item *" name="product_name" value={formData.product_name} onChange={handleInputChange} isSelect options={data.inventoryItems || []} />
                      <div className="flex gap-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-transparent cursor-pointer transition-all has-[:checked]:bg-white has-[:checked]:border-slate-200 has-[:checked]:shadow-sm text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          <input type="radio" name="type" value="IN" checked={formData.type !== 'OUT'} onChange={handleInputChange} className="accent-slate-800" /> Stock In (+)
                        </label>
                        <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-transparent cursor-pointer transition-all has-[:checked]:bg-white has-[:checked]:border-slate-200 has-[:checked]:shadow-sm text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          <input type="radio" name="type" value="OUT" checked={formData.type === 'OUT'} onChange={handleInputChange} className="accent-slate-800" /> Stock Out (-)
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Movement Date" name="movement_date" value={formData.movement_date} onChange={handleInputChange} type="date" />
                        <Field label="Quantity *" name="quantity" value={formData.quantity} onChange={handleInputChange} type="number" />
                      </div>
                      <Field label="Reason / Type" name="reason" value={formData.reason} onChange={handleInputChange} isSelect options={['Purchase', 'Sale', 'Damage', 'Return', 'Adjustment', 'Internal Use']} />
                      <Field label="Reference (Invoice #)" name="reference" value={formData.reference} onChange={handleInputChange} placeholder="INV-2024-001" />
                      <Field label="Handled By" name="handled_by" value={formData.handled_by} onChange={handleInputChange} placeholder="Staff name" />
                      <Field label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} isTextArea />
                    </>
                  )}
                  <button className="w-full py-3 bg-[#2c3e50] text-white rounded-xl text-sm font-bold shadow-lg hover:bg-[#34495e] transition-all transform active:scale-[0.98]">
                    {editingId ? 'Update Record' : 'Log Transaction'}
                  </button>
                  {editingId && (
                    <button 
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all mt-2"
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
              title={activeTab === 'stock' ? "Master Inventory List" : "Transaction History"} 
              icon={activeTab === 'stock' ? ClipboardList : ArrowLeftRight}
              headerAction={
                <button onClick={() => setIsWide(!isWide)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all tracking-wider uppercase shadow-sm">
                  {isWide ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  {isWide ? 'Standard' : 'Wide'} View
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    {activeTab === 'stock' ? (
                      <tr>
                        <th className={thClass}>Item Name</th>
                        <th className={thClass}>Category</th>
                        <th className={thClass}>Stock</th>
                        <th className={thClass}>Price</th>
                        {isWide && <th className={thClass}>Supplier Ref</th>}
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Action</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className={thClass}>Date</th>
                        <th className={thClass}>Item</th>
                        <th className={thClass}>Type</th>
                        <th className={thClass}>Qty</th>
                        <th className={thClass}>Reason / Ref</th>
                        <th className={thClass}>Action</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'stock' ? (
                      data.stock?.map((item: any, i: number) => (
                        <StockRow key={i} {...item} isWide={isWide} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(item.id, item, 'stock')} onDelete={() => handleDeleteClick(`stock-${item.id}`)} />
                      )) || null
                    ) : (
                      data.moves?.map((move: any, i: number) => (
                        <MoveRow key={i} {...move} canDelete={canDelete} onDelete={() => handleDeleteClick(`move-${move.id}`)} />
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
    </div>
  );
}

const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider";

function TabButton({ active, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`py-4 text-xs font-bold border-b-2 transition-all ${
        active ? 'border-[#2c3e50] text-[#2c3e50]' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {label}
    </button>
  );
}

function StockRow({ name, category, quantity, status, supplier_ref, price, isWide, onEdit, onDelete, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 font-bold text-slate-800">{name}</td>
      <td className="px-4 py-4 text-slate-500 text-xs">{category}</td>
      <td className="px-4 py-4 font-bold text-slate-900">{quantity}</td>
      <td className="px-4 py-4 font-mono text-xs text-slate-600">£{Number(price).toFixed(2)}</td>
      {isWide && <td className="px-4 py-4 text-slate-400 text-[10px] font-mono italic">{supplier_ref || "-"}</td>}
      <td className="px-4 py-4">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase ${status === 'Active' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>{status}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          {canEdit && <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"><Edit className="w-3.5 h-3.5" /></button>}
          {canDelete && <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
        </div>
      </td>
    </tr>
  );
}

function MoveRow({ date, product_name, type, quantity, reason, reference, onDelete, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 text-slate-400 text-[10px] font-mono tracking-tight">{date}</td>
      <td className="px-4 py-4 font-bold text-slate-800 text-xs">{product_name}</td>
      <td className="px-4 py-4">
        {type === 'IN' ? (
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase">In (+)</span>
        ) : (
          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-100 uppercase">Out (-)</span>
        )}
      </td>
      <td className="px-4 py-4 font-bold text-slate-900">{quantity}</td>
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-slate-600 text-[10px] font-bold">{reason || "Adjustment"}</span>
          <span className="text-slate-400 text-[9px] font-mono">{reference || "-"}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        {canDelete && <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>}
      </td>
    </tr>
  );
}

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, disabled, value, name, onChange }: any) {
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
          type={type} 
          disabled={disabled}
          className={`w-full mt-1.5 p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium ${disabled ? 'bg-slate-100 cursor-not-allowed text-slate-400' : 'bg-slate-50'}`} 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}
