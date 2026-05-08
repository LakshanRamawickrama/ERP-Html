'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import {
  Briefcase,
  Landmark,
  PlusCircle,
  Edit,
  Eye,
  Maximize2,
  Minimize2,
  Trash2,
  X,
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';
import { usePermissions } from '@/hooks/usePermissions';

import { UserRole } from '@/constants/roles';
import {
  Building2, FileCheck, MapPin, User, Hash, Calendar, Shield
} from 'lucide-react';

type TabType = 'entities' | 'structure';

export default function BusinessModule({ userRole }: { userRole?: UserRole }) {
  const isSuperAdmin = userRole === UserRole.SUPER_ADMIN;
  const [activeTab, setActiveTab] = useState<TabType>(isSuperAdmin ? 'entities' : 'structure');

  const { canAdd, canEdit, canDelete } = usePermissions(
    activeTab === 'entities' ? 'Business Profile' : 'Company Structure'
  );
  const [isWide, setIsWide] = useState(false);
  const [data, setData] = useState<any>({ entities: [], structures: [], options: { categories: [] } });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<any>(null);
  const [isStructureDrawerOpen, setIsStructureDrawerOpen] = useState(false);
  const [structureFiles, setStructureFiles] = useState<{ balance_sheet?: File; pl_statement?: File }>({});

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        setLoading(false);
        return;
    }
    
    fetch(API_ENDPOINTS.BUSINESS, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch business data', err);
        setLoading(false);
      });
  }, []);

  // Admin: auto-fill structure form with their existing record
  useEffect(() => {
    if (!isSuperAdmin && activeTab === 'structure' && data.structures?.length > 0 && !editingId) {
      const s = data.structures[0];
      setEditingId(`structure-${s.id}`);
      setFormData(s);
    }
  }, [isSuperAdmin, activeTab, data.structures]);

  const handleEdit = (id: string, rowData: any, tab: TabType) => {
    setEditingId(id);
    setFormData(rowData);
    setActiveTab(tab);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
    setStructureFiles({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = activeTab === 'entities' ? 'entities/' : 'structures/';
    const idPart = editingId?.replace(/^(entity|structure)-/, '');
    const url = editingId
      ? `${API_ENDPOINTS.BUSINESS}${endpoint}${idPart}/`
      : `${API_ENDPOINTS.BUSINESS}${endpoint}`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('token');
      let body: BodyInit;
      const headers: Record<string, string> = { 'Authorization': `Bearer ${token}` };

      if (activeTab === 'structure' && (structureFiles.balance_sheet || structureFiles.pl_statement)) {
        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => { if (v != null) fd.append(k, String(v)); });
        if (structureFiles.balance_sheet) fd.append('balance_sheet', structureFiles.balance_sheet);
        if (structureFiles.pl_statement) fd.append('pl_statement', structureFiles.pl_statement);
        body = fd;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(formData);
      }

      const response = await fetch(url, { method, headers, body });

      if (response.ok) {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(API_ENDPOINTS.BUSINESS, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const newData = await res.json();
        setData(newData);
        setLoading(false);
        handleCancelEdit();
      } else {
        console.error('Save failed:', await response.text());
      }
    } catch (err) {
      console.error('Failed to save business data:', err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const endpoint = activeTab === 'entities' ? 'entities/' : 'structures/';
      const url = `${API_ENDPOINTS.BUSINESS}${endpoint}${deleteId}/`;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Refresh data
          const res = await fetch(API_ENDPOINTS.BUSINESS, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const newData = await res.json();
          setData(newData);
          setShowDeleteModal(false);
          setDeleteId(null);
        } else {
          console.error('Delete failed:', await response.text());
        }
      } catch (err) {
        console.error('Failed to delete business record:', err);
      }
    }
  };


  const handleViewDoc = (docTitle: string) => {
    setSelectedDoc({ title: docTitle });
    setIsDrawerOpen(true);
  };

  const handleViewStructure = (s: any) => {
    setSelectedStructure(s);
    setIsStructureDrawerOpen(true);
  };

  const entities = data.entities || [];
  const structures = data.structures || [];

  // Entity names not yet registered in Companies House (exclude current editing target)
  const registeredNames = new Set(structures.map((s: any) => s.name));
  const unregisteredEntities = entities
    .map((e: any) => e.name)
    .filter((name: string) => !registeredNames.has(name) || name === formData.name);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6">
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('entities')}
            className={`py-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'entities' ? 'border-[#2c3e50] text-[#2c3e50]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Basic Details
          </button>
        )}
        <button
          onClick={() => setActiveTab('structure')}
          className={`py-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'structure' ? 'border-[#2c3e50] text-[#2c3e50]' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Companies House Structure
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && canAdd && (
            <div className="lg:col-span-4">
              {activeTab === 'entities' ? (
                <Card title={editingId ? "Edit Business Entity" : "Register New Entity"} icon={editingId ? Edit : PlusCircle} iconColor="bg-[#2c3e50]">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Field 
                      label="Business Name" 
                      placeholder="e.g. Acme Corp" 
                      value={formData.name || ''} 
                      onChange={(v: string) => setFormData({...formData, name: v})}
                    />
                    <Field 
                      label="Company Number" 
                      placeholder="CH-12345678" 
                      value={formData.company_number || ''} 
                      onChange={(v: string) => setFormData({...formData, company_number: v})}
                    />
                    <Field 
                      label="Business Category" 
                      isSelect 
                      options={data.options?.categories || []} 
                      value={formData.category || ''} 
                      onChange={(v: string) => setFormData({...formData, category: v})}
                    />
                    <Field 
                      label="Tax ID / VAT Number" 
                      value={formData.tax_id || ''} 
                      onChange={(v: string) => setFormData({...formData, tax_id: v})}
                    />
                    <Field 
                      label="HQ Location" 
                      placeholder="e.g. London, UK" 
                      value={formData.hq_location || ''} 
                      onChange={(v: string) => setFormData({...formData, hq_location: v})}
                    />

                    <button className="w-full py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-all">
                      {editingId ? "Update Business" : "Register Business"}
                    </button>
                    {editingId && (
                      <button 
                        type="button"
                        onClick={handleCancelEdit}
                        className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all mt-2"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </Card>
              ) : (
                <Card title={editingId ? "Edit Company Registry" : "Companies House Registration"} icon={editingId ? Edit : Landmark} iconColor="bg-[#2c3e50]">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Field
                      label="Full Company Name"
                      isSelect
                      options={unregisteredEntities}
                      value={formData.name || ''}
                      onChange={(v: string) => setFormData({...formData, name: v})}
                    />
                    <Field 
                      label="Registration Number (CRN)" 
                      placeholder="8-digit number" 
                      value={formData.crn || ''} 
                      onChange={(v: string) => setFormData({...formData, crn: v})}
                    />
                    <Field 
                      label="Who Manages It (Directors)" 
                      placeholder="Name of Directors / Managers" 
                      value={formData.manager || ''} 
                      onChange={(v: string) => setFormData({...formData, manager: v})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Field 
                        label="SIC Code" 
                        placeholder="Nature of Business" 
                        value={formData.sic_code || ''} 
                        onChange={(v: string) => setFormData({...formData, sic_code: v})}
                      />
                    </div>
                    <Field 
                      label="Registered Office Address" 
                      isTextArea 
                      value={formData.address || ''} 
                      onChange={(v: string) => setFormData({...formData, address: v})}
                    />
                    <Field 
                      label="Confirmation Statement Due" 
                      type="date" 
                      value={formData.filing_due || ''} 
                      onChange={(v: string) => setFormData({...formData, filing_due: v})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Balance Sheet (PDF)</label>
                        <label className="block mt-1 border-2 border-dashed border-slate-200 rounded-lg p-2 text-center hover:bg-slate-50 cursor-pointer">
                          <p className="text-[10px] text-slate-500 font-medium">{structureFiles.balance_sheet ? structureFiles.balance_sheet.name : 'Click to upload'}</p>
                          <input type="file" className="hidden" accept=".pdf" onChange={e => setStructureFiles(p => ({ ...p, balance_sheet: e.target.files?.[0] }))} />
                        </label>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">P&L Statement (PDF)</label>
                        <label className="block mt-1 border-2 border-dashed border-slate-200 rounded-lg p-2 text-center hover:bg-slate-50 cursor-pointer">
                          <p className="text-[10px] text-slate-500 font-medium">{structureFiles.pl_statement ? structureFiles.pl_statement.name : 'Click to upload'}</p>
                          <input type="file" className="hidden" accept=".pdf" onChange={e => setStructureFiles(p => ({ ...p, pl_statement: e.target.files?.[0] }))} />
                        </label>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-all">
                      {editingId ? "Update Company Details" : "Register Company Details"}
                    </button>
                    {editingId && (
                      <button 
                        type="button"
                        onClick={handleCancelEdit}
                        className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all mt-2"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </Card>
              )}
            </div>
          )}

          {/* Table Column */}
          <div className={isWide || !canAdd ? 'lg:col-span-12' : 'lg:col-span-8'}>
            <Card 
              title={activeTab === 'entities' ? "Active Business Entities" : "Companies House Registry"} 
              icon={Briefcase}
              headerAction={
                <button 
                  onClick={() => setIsWide(!isWide)}
                  className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-md hover:bg-slate-100 transition-all"
                >
                  {isWide ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  {isWide ? 'Standard View' : 'Wide View'}
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    {activeTab === 'entities' ? (
                      <tr>
                        <th className={thClass}>Business Name</th>
                        <th className={thClass}>Company No.</th>
                        <th className={thClass}>Category</th>
                        {isWide && <th className={thClass}>HQ Location</th>}
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className={thClass}>Company Name</th>
                        <th className={thClass}>CRN</th>
                        <th className={thClass}>Managed By</th>
                        {isWide && <th className={thClass}>SIC Code</th>}
                        <th className={thClass}>Filing Due</th>
                        <th className={thClass}>Docs</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-8 text-center text-sm text-slate-500">Loading data...</td>
                      </tr>
                    ) : activeTab === 'entities' ? (
                      <>
                        {entities.map((e: any, idx: number) => (
                          <EntityRow
                            key={idx}
                            isWide={isWide}
                            name={e.name}
                            num={e.company_number}
                            cat={e.category}
                            hq={e.hq_location}
                            status={e.status}
                            onEdit={() => handleEdit(`entity-${e.id}`, e, 'entities')}
                            onDelete={() => handleDeleteClick(e.id)}
                            canEdit={canEdit} canDelete={canDelete}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        {structures.map((s: any, idx: number) => (
                          <StructureRow
                            key={idx}
                            isWide={isWide}
                            data={s}
                            name={s.name}
                            crn={s.crn}
                            manager={s.manager}
                            sic={s.sic_code}
                            due={s.filing_due}
                            isSuperAdmin={isSuperAdmin}
                            onEdit={() => handleEdit(`structure-${s.id}`, s, 'structure')}
                            onDelete={() => handleDeleteClick(s.id)}
                            onView={() => handleViewStructure(s)}
                            canEdit={canEdit} canDelete={canDelete}
                          />
                        ))}
                      </>
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

      <CompanyStructureDrawer
        isOpen={isStructureDrawerOpen}
        onClose={() => setIsStructureDrawerOpen(false)}
        data={selectedStructure}
      />
    </div>
  );
}

const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider";

function EntityRow({ name, num, cat, hq, isWide, onEdit, onDelete, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 font-bold text-slate-800">{name}</td>
      <td className="px-4 py-3 text-slate-500">{num}</td>
      <td className="px-4 py-3 text-slate-500">{cat}</td>
      {isWide && <td className="px-4 py-3 text-slate-500">{hq}</td>}
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {canEdit && (
            <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
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

function StructureRow({ data, name, crn, manager, sic, due, isWide, isSuperAdmin, onEdit, onDelete, onView, canEdit, canDelete }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 font-bold text-slate-800">{name}</td>
      <td className="px-4 py-3 text-slate-500 font-mono text-xs">{crn}</td>
      <td className="px-4 py-3 text-slate-500">{manager}</td>
      {isWide && <td className="px-4 py-3 text-slate-500">{sic}</td>}
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">{due}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1.5">
          {data?.balance_sheet_url ? (
            <a href={data.balance_sheet_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-500 border border-red-100 rounded text-[10px] font-bold hover:bg-red-100 transition-all">
              <FilePdf className="w-3 h-3" /> BS
            </a>
          ) : (
            <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-300 border border-slate-100 rounded text-[10px] font-bold cursor-default">
              <FilePdf className="w-3 h-3" /> BS
            </span>
          )}
          {data?.pl_url ? (
            <a href={data.pl_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-500 border border-red-100 rounded text-[10px] font-bold hover:bg-red-100 transition-all">
              <FilePdf className="w-3 h-3" /> P&L
            </a>
          ) : (
            <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-300 border border-slate-100 rounded text-[10px] font-bold cursor-default">
              <FilePdf className="w-3 h-3" /> P&L
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {isSuperAdmin && (
            <button
              onClick={onView}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-all"
            >
              <Eye className="w-3 h-3" /> View
            </button>
          )}
          {canEdit && (
            <button onClick={onEdit} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
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

function CompanyStructureDrawer({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: any }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (isOpen) { setMounted(true); document.body.style.overflow = 'hidden'; }
    else { const t = setTimeout(() => setMounted(false), 300); document.body.style.overflow = 'auto'; return () => clearTimeout(t); }
  }, [isOpen]);
  if (!mounted && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="px-6 py-5 bg-[#2c3e50] text-white flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black leading-tight">{data?.name || 'Company Details'}</h3>
                <p className="text-teal-200 text-[10px] font-bold mt-0.5 uppercase tracking-widest">Companies House Registration</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* CRN badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 font-mono text-xs font-bold rounded-full border border-slate-200">
                CRN: {data?.crn}
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">Active</span>
            </div>

            {/* Details grid */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
              <DetailRow icon={User} label="Director / Manager" value={data?.manager} />
              <DetailRow icon={Hash} label="SIC Code" value={data?.sic_code || '—'} />
              <DetailRow icon={Calendar} label="Confirmation Statement Due" value={data?.filing_due} highlight />
              <DetailRow icon={MapPin} label="Registered Address" value={data?.address || '—'} multiline />
            </div>

            {/* Documents */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Filed Documents</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Balance Sheet', key: 'balance_sheet_url' },
                  { label: 'P&L Statement', key: 'pl_url' },
                ].map(({ label, key }) => (
                  <div key={key} className="border border-slate-200 rounded-xl p-3 flex flex-col gap-1.5 bg-white">
                    <div className="flex items-center gap-1.5">
                      <FilePdf className="w-4 h-4 text-red-400" />
                      <span className="text-[10px] font-bold text-slate-600">{label}</span>
                    </div>
                    {data?.[key] ? (
                      <a href={data[key]} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline font-medium">Open file ↗</a>
                    ) : (
                      <span className="text-[10px] text-slate-400">Not uploaded</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance note */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <Shield className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                Ensure confirmation statement is filed by the due date to remain compliant with Companies House regulations.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Close</button>
            <button className="px-6 py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow hover:bg-[#34495e] transition-all">
              Download Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, highlight, multiline }: any) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3 h-3 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 ${highlight ? 'text-amber-600' : 'text-slate-800'} ${multiline ? 'whitespace-pre-line' : 'truncate'}`}>
          {value || '—'}
        </p>
      </div>
    </div>
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
          className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
        >
          <option value="">Select {label}</option>
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea 
          rows={2} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" 
          placeholder={placeholder} 
        />
      ) : (
        <input 
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 ${type === 'file' ? 'file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200' : ''}`} 
          placeholder={placeholder} 
        />
      )}
    </div>
  );
}

// Icon placeholder for FilePdf since it's not in standard lucide base sometimes
const FilePdf = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h3a1.5 1.5 0 0 0 0-3H9v4"/><path d="M9 12v3"/></svg>
);
