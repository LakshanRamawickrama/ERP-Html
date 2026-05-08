'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { 
  Building2, 
  Wrench, 
  Trash2, 
  IdCard, 
  PlusCircle, 
  Edit, 
  CheckCircle2, 
  Maximize2,
  Minimize2,
  Phone,
  Calendar,
  FileText,
  FileSearch,
  AlertTriangle,
  User
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';
import { usePermissions } from '@/hooks/usePermissions';


type TabType = 'inventory' | 'requests' | 'waste' | 'licence';

export default function PropertyModule() {
  const { canAdd, canEdit, canDelete } = usePermissions('Property Management');
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [isWide, setIsWide] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [licenceFile, setLicenceFile] = useState<File | null>(null);
  const [data, setData] = useState<any>({ assets: [], requests: [], waste: [], licences: [] });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_ENDPOINTS.PROPERTY, {
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
    setLicenceFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (activeTab === 'licence') {
      const body = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) body.append(k, String(v));
      });
      if (licenceFile) body.append('document', licenceFile);

      const url = editingId
        ? `${API_ENDPOINTS.PROPERTY}licences/${editingId}/`
        : `${API_ENDPOINTS.PROPERTY}licences/`;
      const method = editingId ? 'PUT' : 'POST';
      try {
        const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body });
        if (res.ok) {
          const newData = await fetch(API_ENDPOINTS.PROPERTY, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json());
          setData(newData);
          handleCancelEdit();
        }
      } catch (err) {
        console.error('Property licence save error:', err);
      }
    } else {
      try {
        const response = await fetch(API_ENDPOINTS.PROPERTY, {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const newData = await fetch(API_ENDPOINTS.PROPERTY, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json());
          setData(newData);
          handleCancelEdit();
        }
      } catch (error) {
        console.error('Property save error:', error);
      }
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      console.log('Deleting item with ID:', deleteId);
      // In a real app, you would call an API here
      // For now, we'll just close the modal
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleViewDoc = (docTitle: string) => {
    setSelectedDoc({ title: docTitle });
    setIsDrawerOpen(true);
  };

  return (

    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        <TabButton active={activeTab === 'inventory'} label="Property Inventory" onClick={() => setActiveTab('inventory')} />
        <TabButton active={activeTab === 'requests'} label="Maintenance Requests" onClick={() => setActiveTab('requests')} />
        <TabButton active={activeTab === 'waste'} label="Waste Collection" onClick={() => setActiveTab('waste')} />
        <TabButton active={activeTab === 'licence'} label="Licences & Permits" onClick={() => setActiveTab('licence')} />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && canAdd && (
            <div className="lg:col-span-4">
              <Card
                title={
                  editingId ? (
                    activeTab === 'inventory' ? 'Edit Property Asset' : 
                    activeTab === 'requests' ? 'Edit Maintenance Request' : 
                    activeTab === 'waste' ? 'Edit Waste Collection' : 
                    'Edit Licence'
                  ) : (
                    activeTab === 'inventory' ? 'Add Property Asset' : 
                    activeTab === 'requests' ? 'New Maintenance Request' : 
                    activeTab === 'waste' ? 'Schedule Waste Collection' : 
                    'New Licence Registry'
                  )
                } 
                icon={editingId ? Edit : (activeTab === 'requests' ? Wrench : activeTab === 'waste' ? Trash2 : activeTab === 'licence' ? IdCard : PlusCircle)} 
                iconColor="bg-[#2c3e50]"
              >
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {activeTab === 'inventory' && (
                    <>
                      <Field 
                        label="Asset Name" 
                        placeholder="e.g. Unit 5 Air Con" 
                        value={formData.name || ''} 
                        onChange={(val: string) => setFormData({...formData, name: val})} 
                      />
                      <Field 
                        label="Location / Floor" 
                        placeholder="Floor 2, Room 204" 
                        value={formData.location || ''} 
                        onChange={(val: string) => setFormData({...formData, location: val})} 
                      />
                      <Field 
                        label="Asset Type" 
                        isSelect 
                        options={data.assetTypes || []} 
                        value={formData.asset_type || ''} 
                        onChange={(val: string) => setFormData({...formData, asset_type: val})} 
                      />
                      <Field 
                        label="Assigned Person" 
                        placeholder="Name of responsible person" 
                        value={formData.assigned_person || ''} 
                        onChange={(val: string) => setFormData({...formData, assigned_person: val})} 
                      />
                      <Field 
                        label="Contact Number" 
                        placeholder="+1 (555) 000-0000" 
                        value={formData.contact || ''} 
                        onChange={(val: string) => setFormData({...formData, contact: val})} 
                      />
                      <Field 
                        label="Notes" 
                        isTextArea 
                        placeholder="Specific instructions or property details" 
                        value={formData.notes || ''} 
                        onChange={(val: string) => setFormData({...formData, notes: val})} 
                      />
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Asset Documents</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer bg-slate-50">
                           <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                           <p className="text-[10px] text-slate-500 font-medium">Click or Drag & Drop Manual/Warranty</p>
                        </div>
                      </div>
                    </>
                  )}
                  {activeTab === 'requests' && (
                    <>
                      <Field 
                        label="Issue Description" 
                        placeholder="e.g. Broken window" 
                        value={formData.issue || ''} 
                        onChange={(val: string) => setFormData({...formData, issue: val})} 
                      />
                      <Field 
                        label="Request Date" 
                        type="date" 
                        value={formData.date || ''} 
                        onChange={(val: string) => setFormData({...formData, date: val})} 
                      />
                      <Field 
                        label="Select Asset" 
                        isSelect 
                        options={data.assets?.map((a: any) => a.name) || []} 
                        value={formData.asset_name || ''} 
                        onChange={(val: string) => {
                          const asset = data.assets.find((a: any) => a.name === val);
                          setFormData({...formData, asset_name: val, asset: asset?.id});
                        }} 
                      />
                      <Field 
                        label="Priority" 
                        isSelect 
                        options={data.priorities || []} 
                        value={formData.priority || ''} 
                        onChange={(val: string) => setFormData({...formData, priority: val})} 
                      />
                      <Field 
                        label="Assigned Technician" 
                        placeholder="Name of technician" 
                        value={formData.technician || ''} 
                        onChange={(val: string) => setFormData({...formData, technician: val})} 
                      />
                      <Field 
                        label="Request Notes" 
                        isTextArea 
                        placeholder="Describe specific details of the issue" 
                        value={formData.notes || ''} 
                        onChange={(val: string) => setFormData({...formData, notes: val})} 
                      />
                    </>
                  )}
                  {activeTab === 'waste' && (
                    <>
                      <Field 
                        label="Contact Name" 
                        placeholder="e.g. Building Manager" 
                        value={formData.contact_name || ''} 
                        onChange={(val: string) => setFormData({...formData, contact_name: val})} 
                      />
                      <Field 
                        label="Phone Number" 
                        type="tel" 
                        placeholder="e.g. +1 555-0199" 
                        value={formData.phone || ''} 
                        onChange={(val: string) => setFormData({...formData, phone: val})} 
                      />
                      <Field 
                        label="Collection Address" 
                        placeholder="Full address or unit location" 
                        value={formData.address || ''} 
                        onChange={(val: string) => setFormData({...formData, address: val})} 
                      />
                      <Field 
                        label="Pick-up Date" 
                        type="date" 
                        value={formData.pickup_date || ''} 
                        onChange={(val: string) => setFormData({...formData, pickup_date: val})} 
                      />
                      <Field 
                        label="Notes" 
                        isTextArea 
                        placeholder="e.g. Large items, hazardous waste..." 
                        value={formData.notes || ''} 
                        onChange={(val: string) => setFormData({...formData, notes: val})} 
                      />
                    </>
                  )}
                  {activeTab === 'licence' && (
                    <>
                      <Field 
                        label="Licence Type" 
                        placeholder="e.g. HMO Licence" 
                        value={formData.type || ''} 
                        onChange={(val: string) => setFormData({...formData, type: val})} 
                      />
                      <Field 
                        label="Business Name" 
                        placeholder="e.g. Property Central Ltd" 
                        value={formData.biz || ''} 
                        onChange={(val: string) => setFormData({...formData, biz: val})} 
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Field 
                          label="Issue Date" 
                          type="date" 
                          value={formData.issue_date || ''} 
                          onChange={(val: string) => setFormData({...formData, issue_date: val})} 
                        />
                        <Field 
                          label="Expiry Date" 
                          type="date" 
                          value={formData.expiry_date || ''} 
                          onChange={(val: string) => setFormData({...formData, expiry_date: val})} 
                        />
                      </div>
                      <Field 
                        label="Issuing Authority" 
                        placeholder="e.g. Local City Council" 
                        value={formData.auth || ''} 
                        onChange={(val: string) => setFormData({...formData, auth: val})} 
                      />
                      <Field 
                        label="Status" 
                        isSelect 
                        options={data.statuses || []} 
                        value={formData.status || ''} 
                        onChange={(val: string) => setFormData({...formData, status: val})} 
                      />
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Upload Document</label>
                        <label className="block mt-1 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 cursor-pointer">
                          <FileText className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                          <p className="text-[10px] text-slate-500 font-medium">{licenceFile ? licenceFile.name : 'Click to select file'}</p>
                          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => setLicenceFile(e.target.files?.[0] ?? null)} />
                        </label>
                      </div>
                    </>
                  )}
                  <button className="w-full py-3 bg-[#2c3e50] text-white rounded-xl text-sm font-bold shadow-lg hover:bg-[#34495e] transition-all transform active:scale-[0.98]">
                    {editingId ? 'Update Record' : (
                      activeTab === 'inventory' ? 'Register Asset' : 
                      activeTab === 'requests' ? 'Log Request' : 
                      activeTab === 'waste' ? 'Schedule Collection' : 
                      'Register Licence'
                    )}
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
              title={
                activeTab === 'inventory' ? 'Building Asset Registry' : 
                activeTab === 'requests' ? 'Pending & Active Requests' : 
                activeTab === 'waste' ? 'Waste Collection Schedule' : 
                'Licence & Permit Registry'
              } 
              icon={activeTab === 'inventory' ? Building2 : activeTab === 'requests' ? Wrench : activeTab === 'waste' ? Trash2 : IdCard}
              headerAction={
                <button onClick={() => setIsWide(!isWide)} className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-md hover:bg-slate-100 transition-all tracking-wide">
                  {isWide ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  {isWide ? 'Standard' : 'Wide'} View
                </button>
              }
            >
              <div className="overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {activeTab === 'inventory' && (
                        <>
                          <th className={thClass}>Asset</th>
                          <th className={thClass}>Location</th>
                          <th className={thClass}>Type</th>
                          <th className={thClass}>Document</th>
                          <th className={thClass}>Assigned / Contact</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'requests' && (
                        <>
                          <th className={thClass}>Date</th>
                          <th className={thClass}>Issue</th>
                          <th className={thClass}>Priority</th>
                          <th className={thClass}>Asset</th>
                          <th className={thClass}>Technician</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'waste' && (
                        <>
                          <th className={thClass}>Pick-up Date</th>
                          <th className={thClass}>Contact Person</th>
                          <th className={thClass}>Address / Location</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      {activeTab === 'licence' && (
                        <>
                          <th className={thClass}>Licence / Business</th>
                          <th className={thClass}>Authority</th>
                          <th className={thClass}>Expiry</th>
                          <th className={thClass}>Issue Date</th>
                          <th className={thClass}>Status</th>
                        </>
                      )}
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTab === 'inventory' && (
                      data.assets?.map((r: any, i: number) => (
                        <PropertyRow
                          key={i}
                          {...r}
                          onEdit={() => handleEdit(`asset-${i}`, r, 'inventory')}
                          onDelete={() => handleDeleteClick(`asset-${i}`)}
                          onView={() => handleViewDoc(r.doc)}
                          canEdit={canEdit} canDelete={canDelete}
                        />
                      )) || null
                    )}

                    {activeTab === 'requests' && (
                      data.requests?.map((r: any, i: number) => <RequestRow key={i} {...r} onEdit={() => handleEdit(`request-${i}`, r, 'requests')} onDelete={() => handleDeleteClick(`request-${i}`)} canEdit={canEdit} canDelete={canDelete} />) || null
                    )}
                    {activeTab === 'waste' && (
                      data.waste?.map((r: any, i: number) => <WasteRow key={i} {...r} onEdit={() => handleEdit(`waste-${i}`, r, 'waste')} onDelete={() => handleDeleteClick(`waste-${i}`)} canEdit={canEdit} canDelete={canDelete} />) || null
                    )}
                    {activeTab === 'licence' && (
                      data.licences?.map((r: any, i: number) => (
                        <LicenceRow
                          key={i}
                          {...r}
                          onEdit={() => handleEdit(`licence-${i}`, r, 'licence')}
                          onDelete={() => handleDeleteClick(`licence-${i}`)}
                          onView={() => handleViewDoc(r.type + " - " + r.biz)}
                          canEdit={canEdit} canDelete={canDelete}
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

function PropertyRow({ name, sub, type, doc, person, contact, status, onEdit, onDelete, onView, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <div className="font-bold text-slate-800">{name}</div>
      </td>
      <td className="px-4 py-3 text-slate-500 font-medium">{sub}</td>
      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">{type}</span></td>
      <td className="px-4 py-3">
        <button 
          onClick={onView}
          className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md w-fit hover:bg-white hover:shadow-sm transition-all cursor-pointer"
        >
          <FileText className="w-3 h-3 text-red-500" />
          {doc}
        </button>
      </td>

      <td className="px-4 py-3">
        <div className="text-[11px] leading-tight">
          <div className="font-bold text-slate-700">{person}</div>
          <div className="text-slate-400">{contact}</div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {canEdit && (
            <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {canDelete && (
            <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function RequestRow({ date, issue, asset, tech, prio, status, onEdit, onDelete, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 text-slate-500 font-mono tracking-tighter">{date}</td>
      <td className="px-4 py-3 font-bold text-slate-800">{issue}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
          prio === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
        }`}>{prio}</span>
      </td>
      <td className="px-4 py-3 text-slate-500 font-medium">{asset}</td>
      <td className="px-4 py-3 text-slate-600">{tech}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {canEdit && (
            <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {canDelete && (
            <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function WasteRow({ date, contact, phone, addr, status, onEdit, onDelete, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 text-slate-500 font-mono tracking-tighter">{date}</td>
      <td className="px-4 py-3">
        <div className="font-bold text-slate-800">{contact}</div>
        <div className="text-[10px] text-slate-400 font-medium">{phone}</div>
      </td>
      <td className="px-4 py-3 text-slate-500">{addr}</td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{status}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {canEdit && (
            <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {canDelete && (
            <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function LicenceRow({ type, biz, auth, expiry, issue, status, onEdit, onDelete, onView, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={onView}
            className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:bg-white hover:shadow-sm transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-red-500" />
          </button>
          <div className="flex flex-col">
            <div className="font-bold text-slate-800">{type}</div>
            <div className="text-[10px] text-slate-400 font-medium">{biz}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-slate-500 font-medium">{auth}</td>
      <td className="px-4 py-3 font-mono text-slate-600">{expiry}</td>
      <td className="px-4 py-3 font-mono text-slate-400 text-xs">{issue}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
          status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>{status}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {canEdit && (
            <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {canDelete && (
            <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea, value, onChange }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all"
        >
          <option value="">Select {label}</option>
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea 
          rows={2} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all" 
          placeholder={placeholder} 
        />
      ) : (
        <input 
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all`} 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}
