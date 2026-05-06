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
  Trash2
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';


type TabType = 'vehicles' | 'deliveries' | 'parcels';

export default function FleetModule() {
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');
  const [isWide, setIsWide] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const [data, setData] = useState<any>({ reminders: [], vehicles: [], deliveries: [], parcels: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  React.useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_ENDPOINTS.FLEET, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(setData);
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
      console.log('Deleting fleet record:', deleteId);
      // TODO: API call
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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
          <div className="hidden xl:flex gap-2">
            {reminders.map((r: any) => (
              <div key={r.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold ${
                r.level === 'expired' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-amber-50 border-amber-100 text-amber-700'
              }`}>
                <AlertTriangle className="w-3 h-3" />
                <span>{r.vehicle} - {r.type}: <span className="font-normal opacity-80">{r.status}</span></span>
              </div>
            ))}
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
          {!isWide && (
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
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {activeTab === 'vehicles' && (
                    <>
                      <Field label="Vehicle Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. CAR 1" />
                      <Field label="Plate Number" name="plate" value={formData.plate} onChange={handleInputChange} placeholder="ABC-1234" />
                      <Field label="Assigned Business" name="biz" value={formData.biz} onChange={handleInputChange} isSelect options={data.options?.businesses || []} />
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
                      <Field label="Notes" name="notes" value={formData.notes} onChange={handleInputChange} isTextArea placeholder="Standard company van, service due, etc." />
                    </>
                  )}

                  {activeTab === 'deliveries' && (
                    <>
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
          <div className={isWide ? 'lg:col-span-12' : 'lg:col-span-8'}>
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
                          <th className={thClass}>Docs</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'deliveries' && (
                        <>
                          <th className={thClass}>Date</th>
                          <th className={thClass}>Vehicle</th>
                          <th className={thClass}>Address / Contact</th>
                          <th className={thClass}>Notes</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'parcels' && (
                        <>
                          <th className={thClass}>Provider</th>
                          <th className={thClass}>Vehicle</th>
                          <th className={thClass}>Area / Contact</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'vehicles' && (
                      data.vehicles?.map((v: any, i: number) => (
                        <VehicleRow 
                          key={i} 
                          {...v} 
                          onEdit={() => handleEdit(`vehicle-${i}`, v, 'vehicles')} 
                          onDelete={() => handleDeleteClick(`vehicle-${i}`)}
                          onViewDoc={(title: string) => handleViewDoc(title, 'Fleet Compliance')}
                        />
                      )) || null
                    )}

                    {activeTab === 'deliveries' && (
                      data.deliveries?.map((d: any, i: number) => <DeliveryRow key={i} {...d} onEdit={() => handleEdit(`delivery-${i}`, d, 'deliveries')} onDelete={() => handleDeleteClick(`delivery-${i}`)} />) || null
                    )}
                    {activeTab === 'parcels' && (
                      data.parcels?.map((p: any, i: number) => <ParcelRow key={i} {...p} onEdit={() => handleEdit(`parcel-${i}`, p, 'parcels')} onDelete={() => handleDeleteClick(`parcel-${i}`)} />) || null
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

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, name, value, onChange }: any) {
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
          className="w-full mt-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-slate-800 transition-all font-medium" 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}

function VehicleRow({ name, plate, biz, mot, ins, tax, status, onEdit, onDelete, onViewDoc }: any) {
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
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <span title="MOT Doc" onClick={() => onViewDoc(`MOT Certificate - ${plate}`)}>
            <FileText className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110 transition-transform" />
          </span>
          <span title="Insurance Doc" onClick={() => onViewDoc(`Insurance Policy - ${plate}`)}>
            <FileText className="w-4 h-4 text-amber-500 cursor-pointer hover:scale-110 transition-transform" />
          </span>
          <span title="Tax Doc" onClick={() => onViewDoc(`Road Tax Log - ${plate}`)}>
            <FileText className="w-4 h-4 text-slate-500 cursor-pointer hover:scale-110 transition-transform" />
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase">{status}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function DeliveryRow({ date, v, vNum, addr, contact, notes, status, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 text-slate-500 text-xs font-medium">{date}</td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{v}</div>
        <div className="text-[10px] text-slate-400 font-mono">{vNum}</div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
            <MapPin className="w-3 h-3 text-slate-400" />
            {addr}
          </div>
          <div className="text-slate-400 flex items-center gap-1.5 text-[10px] font-medium">
            <User className="w-3 h-3" />
            {contact}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-slate-400 text-[10px] italic">{notes}</td>
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase">{status}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
            <FileSearch className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ParcelRow({ provider, v, vNum, area, contact, status, onEdit, onDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800">{provider}</div>
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          Partner
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="font-bold text-slate-800 text-xs">{v}</div>
        <div className="text-[10px] text-slate-400 font-mono">{vNum}</div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-slate-700 text-xs">{area}</div>
          <div className="text-slate-400 text-[10px] font-medium">{contact}</div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase">{status}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
