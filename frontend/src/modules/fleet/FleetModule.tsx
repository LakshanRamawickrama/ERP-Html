'use client';

import React, { useState } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { 
  Truck, 
  Package, 
  Calendar, 
  MapPin, 
  Phone, 
  FileText, 
  AlertTriangle,
  PlusCircle, 
  Edit, 
  Maximize2,
  Minimize2,
  FileSearch,
  Box,
  User,
  ExternalLink,
  Trash2,
  Droplets
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';
import { usePermissions } from '@/hooks/usePermissions';
import { BusinessField } from '@/components/ui/BusinessField';
import { useSearchParams } from 'next/navigation';


type TabType = 'vehicles' | 'deliveries' | 'parcels';

export default function FleetModule({ selectedBusiness = 'All Entities' }: { selectedBusiness?: string }) {
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');
  
  const permMap: Record<TabType, string> = {
    vehicles: 'Vehicle Fleet',
    deliveries: 'Delivery Tracking',
    parcels: 'Parcel Services'
  };
  
  const { canAdd, canEdit, canDelete } = usePermissions(permMap[activeTab], 'Fleet Management');
  const [isWide, setIsWide] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [fileFields, setFileFields] = useState<Record<string, File>>({});

  const [data, setData] = useState<any>({ reminders: [], vehicles: [], deliveries: [], parcels: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  React.useEffect(() => {
    if (searchParams.get('view') === 'wide') {
      setIsWide(true);
    }
    const targetTab = searchParams.get('tab');
    if (targetTab && ['vehicles', 'deliveries', 'parcels'].includes(targetTab)) {
      setActiveTab(targetTab as TabType);
    }
  }, [searchParams]);


  React.useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_ENDPOINTS.FLEET, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => {
      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) throw new Error('Fetch failed');
      return res.json();
    }).then(setData)
    .catch(err => console.error('Fleet fetch error:', err));
  }, []);

  const handleEdit = (id: string, rowData: any, tab: TabType) => {
    setEditingId(id);
    setFormData(rowData);
    setActiveTab(tab);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
    setFileFields({});
    setFormKey(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const body = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== undefined && !(v instanceof File)) body.append(k, String(v));
    });
    Object.entries(fileFields).forEach(([k, f]) => body.append(k, f));

    const endpointMap: Record<string, string> = {
      vehicles: 'vehicles/',
      deliveries: 'deliveries/',
      parcels: 'parcels/'
    };
    const subPath = endpointMap[activeTab] || 'vehicles/';

    const url = editingId
      ? `${API_ENDPOINTS.FLEET}${subPath}${editingId}/`
      : `${API_ENDPOINTS.FLEET}${subPath}`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body });
      if (res.ok) {
        const res = await fetch(API_ENDPOINTS.FLEET, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const refreshed = await res.json();
          setData(refreshed);
        }
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Fleet save error:', err);
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
    const endpointMap: Record<string, string> = {
      vehicles: 'vehicles/',
      deliveries: 'deliveries/',
      parcels: 'parcels/'
    };
    const subPath = endpointMap[activeTab] || 'vehicles/';
    const url = `${API_ENDPOINTS.FLEET}${subPath}${deleteId}/`;

    try {
      const res = await fetch(url, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const res = await fetch(API_ENDPOINTS.FLEET, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const refreshed = await res.json();
          setData(refreshed);
        }
        setShowDeleteModal(false);
        setDeleteId(null);
      }
    } catch (err) {
      console.error('Fleet delete error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === 'file' && target.files?.[0]) {
      setFileFields(prev => ({ ...prev, [name]: target.files![0] }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: target.value }));
    }
  };

  const reminders = data.reminders || [];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Tab Navigation & Reminders */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          <TabButton 
            active={activeTab === 'vehicles'} 
            label="Vehicle Fleet" 
            icon={Truck} 
            onClick={() => setActiveTab('vehicles')} 
          />
          <TabButton 
            active={activeTab === 'deliveries'} 
            label="Delivery Tracking" 
            icon={MapPin} 
            onClick={() => setActiveTab('deliveries')} 
          />
          <TabButton 
            active={activeTab === 'parcels'} 
            label="Parcel Services" 
            icon={Box} 
            onClick={() => setActiveTab('parcels')} 
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-slate-800 transition-all w-48 lg:w-64"
            />
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <button 
            onClick={() => setIsWide(!isWide)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider shadow-sm"
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
                title={
                  editingId ? (
                    activeTab === 'vehicles' ? "Edit Vehicle" : 
                    activeTab === 'deliveries' ? "Edit Delivery" : 
                    "Edit Parcel Partner"
                  ) : (
                    activeTab === 'vehicles' ? "Register Vehicle" : 
                    activeTab === 'deliveries' ? "New Delivery Entry" : 
                    "Manage Parcel Partner"
                  )
                } 
                icon={editingId ? Edit : PlusCircle} 
                iconColor="bg-slate-800"
              >
                <form key={formKey} className="space-y-4" onSubmit={handleSubmit}>
                  {activeTab === 'vehicles' && (
                    <>
                      <Field label="Vehicle Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. CAR 1" />
                      <Field label="Plate Number" name="plate" value={formData.plate} onChange={handleInputChange} placeholder="ABC-1234" />
                      <div className="grid grid-cols-2 gap-4">
                        <BusinessField 
                          value={formData.biz || ''} 
                          onChange={(v) => setFormData((prev: any) => ({ ...prev, biz: v }))} 
                          businesses={data.options?.businesses || []}
                        />
                        <Field label="Fuel Type" name="fuelType" value={formData.fuelType} onChange={handleInputChange} isSelect options={['Petrol', 'Diesel', 'Electric', 'Hybrid']} icon={Droplets} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Insurance Exp." name="ins" value={formData.ins} onChange={handleInputChange} type="date" />
                        <Field label="Insurance Doc" name="insDoc" onChange={handleInputChange} type="file" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="MOT Date" name="mot" value={formData.mot} onChange={handleInputChange} type="date" />
                        <Field label="MOT Doc" name="motDoc" onChange={handleInputChange} type="file" />
                      </div>
                       <div className="grid grid-cols-2 gap-4">
                        <Field label="Road Tax Date" name="tax" value={formData.tax} onChange={handleInputChange} type="date" />
                        <Field label="Tax Doc" name="taxDoc" onChange={handleInputChange} type="file" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Other Document" name="otherDoc" onChange={handleInputChange} type="file" />
                        <Field label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} isTextArea placeholder="Service due, etc." />
                      </div>
                    </>
                  )}

                  {activeTab === 'deliveries' && (
                    <>
                      <BusinessField 
                        value={formData.biz || ''} 
                        onChange={(v) => setFormData((prev: any) => ({ ...prev, biz: v }))} 
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Select Vehicle" name="v" value={formData.v} onChange={handleInputChange} isSelect options={data.options?.vehicles || []} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Pickup Date" name="pickupDate" value={formData.pickupDate} onChange={handleInputChange} type="date" />
                        <Field label="Delivery Date" name="date" value={formData.date} onChange={handleInputChange} type="date" />
                      </div>
                      <Field label="Delivery Address" name="addr" value={formData.addr} onChange={handleInputChange} placeholder="123 Street, City" />
                      <Field label="Contact Person" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="Receiver's name" />
                      <Field label="Contact Number" name="contactNum" value={formData.contactNum} onChange={handleInputChange} placeholder="+44 7..." />
                      <Field label="Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.options?.deliveryStatuses || []} />
                      <Field label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} isTextArea placeholder="Gate code, specific instructions..." />
                    </>
                  )}

                  {activeTab === 'parcels' && (
                    <>
                      <BusinessField 
                        value={formData.biz || ''} 
                        onChange={(v) => setFormData((prev: any) => ({ ...prev, biz: v }))} 
                        businesses={data.options?.businesses || []}
                      />
                      <Field label="Service Provider" name="provider" value={formData.provider} onChange={handleInputChange} placeholder="DHL, FedEx, UPS..." />
                      <Field label="Assigned Vehicle" name="v" value={formData.v} onChange={handleInputChange} isSelect options={data.options?.vehicleShort || []} />
                      <Field label="Service Date" name="date" value={formData.date} onChange={handleInputChange} type="date" />
                      <Field label="Area / Address" name="area" value={formData.area} onChange={handleInputChange} placeholder="City Central Coverage" />
                      <Field label="Contact Name" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="Partner manager name" />
                      <Field label="Contact Number" name="contactNum" value={formData.contactNum} onChange={handleInputChange} placeholder="Partner phone" />
                      <Field label="Agreement Status" name="status" value={formData.status} onChange={handleInputChange} isSelect options={data.options?.agreementStatuses || []} />
                      <Field label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} isTextArea placeholder="Weekly billing, special rates..." />
                    </>
                  )}

                  <button className="w-full py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-700 transition-all transform active:scale-[0.98]">
                    {editingId ? 'Update Record' : 'Save Record'}
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
              title={activeTab === 'vehicles' ? "Fleet Inventory" : activeTab === 'deliveries' ? "Delivery History" : "Service Partners"} 
              icon={activeTab === 'vehicles' ? Truck : activeTab === 'deliveries' ? MapPin : Box}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {activeTab === 'vehicles' && (
                        <>
                          <th className={thClass}>Vehicle / Plate</th>
                          <th className={thClass}>Business</th>
                          <th className={thClass}>MOT / Insurance / Tax</th>
                          {isWide && <th className={thClass}>Fuel Type</th>}
                          <th className={thClass}>Docs</th>
                          {isWide && <th className={thClass}>Notes</th>}
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'deliveries' && (
                        <>
                          <th className={thClass}>Dates (P/D)</th>
                          <th className={thClass}>Vehicle</th>
                          {isWide && <th className={thClass}>Business</th>}
                          {isWide && <th className={thClass}>Address / Contact</th>}
                          {isWide && <th className={thClass}>Notes</th>}
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'parcels' && (
                        <>
                          <th className={thClass}>Provider</th>
                          <th className={thClass}>Vehicle / Date</th>
                          {isWide && <th className={thClass}>Business</th>}
                          {isWide && <th className={thClass}>Area / Contact</th>}
                          {isWide && <th className={thClass}>Notes</th>}
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                   <tbody className="divide-y divide-slate-100">
                    {activeTab === 'vehicles' && (
                      data.vehicles
                        ?.filter((v: any) => selectedBusiness === 'All Entities' || v.biz === selectedBusiness)
                        .filter((v: any) => !searchTerm || Object.values(v).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
                        .map((v: any, i: number) => (
                        <VehicleRow
                          key={i}
                          {...v}
                          isWide={isWide}
                          canEdit={canEdit}
                          canDelete={canDelete}
                          onEdit={() => handleEdit(v.id || `vehicle-${i}`, v, 'vehicles')}
                          onDelete={() => handleDeleteClick(v.id || `vehicle-${i}`)}
                          onViewDoc={(title: string, url?: string) => handleViewDoc(title, url, 'Fleet Compliance')}
                        />
                      )) || null
                    )}

                    {activeTab === 'deliveries' && (
                      data.deliveries
                        ?.filter((d: any) => selectedBusiness === 'All Entities' || d.biz === selectedBusiness)
                        .filter((d: any) => !searchTerm || Object.values(d).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
                        .map((d: any, i: number) => <DeliveryRow key={i} {...d} isWide={isWide} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(d.id || `delivery-${i}`, d, 'deliveries')} onDelete={() => handleDeleteClick(d.id || `delivery-${i}`)} />) || null
                    )}
                    {activeTab === 'parcels' && (
                      data.parcels
                        ?.filter((p: any) => selectedBusiness === 'All Entities' || p.biz === selectedBusiness)
                        .filter((p: any) => !searchTerm || Object.values(p).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
                        .map((p: any, i: number) => <ParcelRow key={i} {...p} isWide={isWide} canEdit={canEdit} canDelete={canDelete} onEdit={() => handleEdit(p.id || `parcel-${i}`, p, 'parcels')} onDelete={() => handleDeleteClick(p.id || `parcel-${i}`)} />) || null
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

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, name, value, onChange, icon: Icon }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 h-4">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      {isSelect ? (
        <select 
          name={name}
          value={value || ''}
          onChange={onChange}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium appearance-none"
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
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" 
          placeholder={placeholder} 
        />
      ) : (
        <input 
          name={name}
          {...(type !== 'file' ? { value: value || '' } : {})}
          onChange={onChange}
          type={type} 
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}

function VehicleRow({ name, plate, biz, mot, ins, tax, fuel_type, status, notes, onEdit, onDelete, onViewDoc, ins_doc_url, mot_doc_url, tax_doc_url, other_doc_url, canEdit, canDelete, isWide }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{name}</div>
        <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{plate}</div>
      </td>
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase">{biz}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 w-8">MOT:</span>
            <span className="font-bold text-red-500">{mot}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 w-8">INS:</span>
            <span className="font-bold text-amber-600">{ins}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-400 w-8">TAX:</span>
            <span className="font-bold text-slate-700">{tax}</span>
          </div>
        </div>
      </td>
      {isWide && (
        <td className="px-4 py-4">
          <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">{fuel_type || '—'}</span>
        </td>
      )}
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <span title="MOT Doc" onClick={() => onViewDoc(`MOT Certificate - ${plate}`, mot_doc_url)}>
            <FileText className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110 transition-transform" />
          </span>
          <span title="Insurance Doc" onClick={() => onViewDoc(`Insurance Policy - ${plate}`, ins_doc_url)}>
            <FileText className="w-4 h-4 text-amber-500 cursor-pointer hover:scale-110 transition-transform" />
          </span>
          <span title="Tax Doc" onClick={() => onViewDoc(`Road Tax Log - ${plate}`, tax_doc_url)}>
            <FileText className="w-4 h-4 text-slate-500 cursor-pointer hover:scale-110 transition-transform" />
          </span>
          <span title="Other Doc" onClick={() => onViewDoc(`Other Document - ${plate}`, other_doc_url)}>
            <FileText className="w-4 h-4 text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
          </span>
        </div>
      </td>
      {isWide && (
        <td className="px-4 py-4 text-slate-400 text-[10px] italic max-w-[150px] truncate" title={notes}>
          {notes || "-"}
        </td>
      )}
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase">{status}</span>
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

function DeliveryRow({ date, pickupDate, v, vNum, biz, addr, contact, contactNum, notes, status, onEdit, onDelete, canEdit, canDelete, isWide }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors text-[11px]">
      <td className="px-4 py-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-slate-400 w-8 italic">Pick:</span>
            <span className="font-bold text-slate-600">{pickupDate || '—'}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-slate-400 w-8 italic">Del:</span>
            <span className="font-bold text-blue-600">{date || '—'}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{v}</div>
        <div className="text-[10px] text-slate-400 font-mono tracking-tighter">{vNum}</div>
      </td>
      {isWide && (
        <td className="px-4 py-4">
          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase">{biz}</span>
        </td>
      )}
      {isWide && (
        <td className="px-4 py-4">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-slate-700 flex items-center gap-1.5 text-[10px]">
              <MapPin className="w-3 h-3 text-slate-400" />
              {addr}
            </div>
            <div className="text-slate-400 flex items-center gap-1.5 text-[10px] font-medium">
              <User className="w-3 h-3" />
              {contact} {contactNum && <span className="text-slate-300 ml-1">({contactNum})</span>}
            </div>
          </div>
        </td>
      )}
      {isWide && <td className="px-4 py-4 text-slate-400 text-[10px] italic max-w-[150px] truncate" title={notes}>{notes}</td>}
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase">{status}</span>
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

function ParcelRow({ provider, v, date, area, contact, contactNum, biz, notes, status, onEdit, onDelete, canEdit, canDelete, isWide }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors text-[11px]">
      <td className="px-4 py-4 font-bold text-slate-800">{provider}</td>
      <td className="px-4 py-4">
        <div className="font-medium text-slate-700">{v}</div>
        <div className="text-[10px] text-slate-400 italic">{date}</div>
      </td>
      {isWide && (
        <td className="px-4 py-4">
          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase">{biz}</span>
        </td>
      )}
      {isWide && (
        <td className="px-4 py-4">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-slate-700 flex items-center gap-1.5 text-[10px]">
              <MapPin className="w-3 h-3 text-slate-400" />
              {area}
            </div>
            <div className="text-slate-400 flex items-center gap-1.5 text-[10px] font-medium">
              <User className="w-3 h-3" />
              {contact} {contactNum && <span className="text-slate-300 ml-1">({contactNum})</span>}
            </div>
          </div>
        </td>
      )}
      {isWide && <td className="px-4 py-4 text-slate-400 text-[10px] italic max-w-[150px] truncate" title={notes}>{notes || "-"}</td>}
      <td className="px-4 py-4">
        <span className={`px-2 py-0.5 ${status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'} text-[10px] font-bold rounded-full border uppercase`}>{status}</span>
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
