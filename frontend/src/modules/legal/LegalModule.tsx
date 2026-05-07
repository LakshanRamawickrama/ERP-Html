'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { 
  Gavel, 
  FileText, 
  PlusCircle, 
  Edit, 
  Maximize2,
  Minimize2,
  AlertTriangle,
  UploadCloud,
  ShieldCheck,
  FileBadge,
  Trash2
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';


export default function LegalModule() {
  const [isWide, setIsWide] = useState(false);
  const [data, setData] = useState<any>({ docs: [], summary: { expiredDocs: 0 } });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [docFile, setDocFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_ENDPOINTS.LEGAL, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(setData);
  }, []);

  const handleEdit = (id: string, rowData: any) => {
    setEditingId(id);
    setFormData(rowData);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
    setDocFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const body = new FormData();
    body.append('title', formData.title || '');
    body.append('type', formData.type || '');
    body.append('status', formData.status || 'Active');
    if (formData.expiry_date) body.append('expiry_date', formData.expiry_date);
    if (docFile) body.append('document_file', docFile);

    const url = editingId
      ? `${API_ENDPOINTS.LEGAL}documents/${editingId}/`
      : `${API_ENDPOINTS.LEGAL}documents/`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body });
      if (res.ok) {
        const refreshed = await fetch(API_ENDPOINTS.LEGAL, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json());
        setData(refreshed);
        handleCancelEdit();
      }
    } catch (err) {
      console.error('Legal save error:', err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const token = localStorage.getItem('token');
      try {
        await fetch(`${API_ENDPOINTS.LEGAL}documents/${deleteId}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const refreshed = await fetch(API_ENDPOINTS.LEGAL, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json());
        setData(refreshed);
      } catch (err) {
        console.error('Legal delete error:', err);
      }
    }
  };

  const handleViewDoc = (doc: any) => {
    setSelectedDoc({
      title: doc.title,
      type: doc.type,
      status: doc.status,
      date: doc.expiry_date,
      fileUrl: doc.document_url || null,
    });
    setIsDrawerOpen(true);
  };

  const docs = data.docs || [];


  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Toolbar / KPI */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex gap-6 py-4">
          <span className="text-xs font-bold text-[#2c3e50] border-b-2 border-[#2c3e50] pb-1">Document Registry</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-[10px] font-bold text-red-700">
            <AlertTriangle className="w-3 h-3" />
            <span>Expired Docs: <span className="opacity-80">{data.summary?.expiredDocs || 0}</span></span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className={`grid grid-cols-1 ${isWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          
          {/* Form Column */}
          {!isWide && (
            <div className="lg:col-span-4">
              <Card title={editingId ? "Edit Document" : "Register Document"} icon={editingId ? Edit : PlusCircle} iconColor="bg-[#2c3e50]">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Field label="Document Title" placeholder="Trade License" value={formData.title || ''} onChange={(v: string) => setFormData((p: any) => ({ ...p, title: v }))} />
                  <Field label="Document Type" isSelect options={data.options || []} value={formData.type || ''} onChange={(v: string) => setFormData((p: any) => ({ ...p, type: v }))} />
                  <Field label="Expiry Date" type="date" value={formData.expiry_date || ''} onChange={(v: string) => setFormData((p: any) => ({ ...p, expiry_date: v }))} />
                  <Field label="Status" isSelect options={['Active', 'Expired', 'Pending']} value={formData.status || 'Active'} onChange={(v: string) => setFormData((p: any) => ({ ...p, status: v }))} />

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Document File</label>
                    <label className="block border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-all cursor-pointer group">
                      <UploadCloud className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-blue-400 transition-colors" />
                      <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                        {docFile ? docFile.name : 'Click or Drag & Drop File Here'}
                      </p>
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => setDocFile(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>

                  <button type="submit" className="w-full py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-colors">
                    {editingId ? "Update Document" : "Save Document"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all mt-2"
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>
              </Card>
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-1' : 'lg:col-span-8'}>
            <Card title="Active Legal Documents" icon={FileBadge}
              headerAction={
                <button onClick={() => setIsWide(!isWide)} className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-md hover:bg-slate-100 transition-all tracking-wide">
                  {isWide ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  {isWide ? 'Standard' : 'Wide'} View
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className={thClass}>Title</th>
                      <th className={thClass}>Type</th>
                      <th className={thClass}>Authority</th>
                      <th className={thClass}>Document</th>
                      <th className={thClass}>Status</th>
                      <th className={thClass}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {docs.map((doc: any, i: number) => (
                      <DocRow 
                        key={i} 
                        {...doc} 
                        onEdit={() => handleEdit(`doc-${i}`, doc)} 
                        onDelete={() => handleDeleteClick(`doc-${i}`)}
                        onView={() => handleViewDoc(doc)}
                      />
                    ))}

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

function DocRow({ title, type, auth, file, status, onEdit, onDelete, onView }: any) {
  return (
    <tr className="hover:bg-slate-50/50 group">
      <td className="px-4 py-3 font-bold text-slate-800">{title}</td>
      <td className="px-4 py-3 text-slate-500 font-medium">{type}</td>
      <td className="px-4 py-3 text-slate-400 text-xs">{auth}</td>
      <td className="px-4 py-3">
        <button 
          onClick={onView}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded hover:bg-white hover:shadow-sm transition-all cursor-pointer"
        >
          <FileText className="w-3 h-3 text-red-500" /> {file}
        </button>
      </td>

      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
          status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>{status}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button 
            onClick={onEdit}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onDelete}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function Field({ label, placeholder, isSelect, options = [], isTextArea, type = 'text', value, onChange }: any) {
  const base = "w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500";
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <select value={value} onChange={e => onChange?.(e.target.value)} className={base}>
          <option value="">Select...</option>
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea rows={2} value={value} onChange={e => onChange?.(e.target.value)} className={base} placeholder={placeholder} />
      ) : (
        <input type={type} value={value} onChange={e => onChange?.(e.target.value)} className={base} placeholder={placeholder} />
      )}
    </div>
  );
}
