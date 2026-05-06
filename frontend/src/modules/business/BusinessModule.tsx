'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Briefcase, 
  Landmark, 
  PlusCircle, 
  Edit, 
  Eye, 
  Maximize2,
  Minimize2,} from 'lucide-react';

type TabType = 'entities' | 'structure';

export default function BusinessModule({ userRole }: { userRole?: string }) {
  const isSuperAdmin = userRole === 'Super Admin';
  const [activeTab, setActiveTab] = useState<TabType>(isSuperAdmin ? 'entities' : 'structure');
  const [isWide, setIsWide] = useState(false);
  const [data, setData] = useState<any>({ entities: [], structures: [], options: { categories: [] } });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/business')
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

  const entities = data.entities || [];
  const structures = data.structures || [];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h4 className="text-lg font-bold text-slate-800">Business Management</h4>
        <p className="text-xs text-slate-500">Unified Module for Portfolio Entities and Corporate Structure</p>
      </div>

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
          {!isWide && (
            <div className="lg:col-span-4">
              {activeTab === 'entities' ? (
                <Card title="Register New Entity" icon={PlusCircle} iconColor="bg-[#2c3e50]">
                  <form className="space-y-4">
                    <Field label="Business Name" placeholder="e.g. Acme Corp" />
                    <Field label="Company Number" placeholder="CH-12345678" />
                    <Field label="Business Category" isSelect options={data.options?.categories || []} />
                    <Field label="Tax ID / VAT Number" />
                    <button className="w-full py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-all">
                      Register Business
                    </button>
                  </form>
                </Card>
              ) : (
                <Card title="Companies House Registration" icon={Landmark} iconColor="bg-[#2c3e50]">
                  <form className="space-y-4">
                    <Field label="Full Company Name" placeholder="e.g. Whiterock Retail Ltd" />
                    <Field label="Registration Number (CRN)" placeholder="8-digit number" />
                    <Field label="Who Manages It (Directors)" placeholder="Name of Directors / Managers" />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Incorporation Date" type="date" />
                      <Field label="SIC Code" placeholder="Nature of Business" />
                    </div>
                    <Field label="Registered Office Address" isTextArea />
                    <Field label="Confirmation Statement Due" type="date" />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Balance Sheet (PDF)" type="file" />
                      <Field label="P&L Statement (PDF)" type="file" />
                    </div>
                    <button className="w-full py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#34495e] transition-all">
                      Register Company Details
                    </button>
                  </form>
                </Card>
              )}
            </div>
          )}

          {/* Table Column */}
          <div className={isWide ? 'lg:col-span-1' : 'lg:col-span-8'}>
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
                          <EntityRow key={idx} isWide={isWide} name={e.name} num={e.num} cat={e.cat} hq={e.hq} />
                        ))}
                      </>
                    ) : (
                      <>
                        {structures.map((s: any, idx: number) => (
                          <StructureRow key={idx} isWide={isWide} name={s.name} crn={s.crn} manager={s.manager} sic={s.sic} due={s.due} />
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
    </div>
  );
}

const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider";

function EntityRow({ name, num, cat, hq, isWide }: any) {
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
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <Edit className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function StructureRow({ name, crn, manager, sic, due, isWide }: any) {
  return (
    <tr className="hover:bg-slate-50/50">
      <td className="px-4 py-3 font-bold text-slate-800">{name}</td>
      <td className="px-4 py-3 text-slate-500">{crn}</td>
      <td className="px-4 py-3 text-slate-500">{manager}</td>
      {isWide && <td className="px-4 py-3 text-slate-500">{sic}</td>}
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">{due}</span>
      </td>
      <td className="px-4 py-3 flex gap-2">
        <span className="text-red-500 flex items-center gap-1 text-[10px] cursor-pointer hover:underline font-bold"><FilePdf className="w-3 h-3" /> BS</span>
        <span className="text-red-500 flex items-center gap-1 text-[10px] cursor-pointer hover:underline font-bold"><FilePdf className="w-3 h-3" /> P&L</span>
      </td>
      <td className="px-4 py-3">
        <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
          <Eye className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function Field({ label, placeholder, type = "text", isSelect, options = [], isTextArea }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      {isSelect ? (
        <select className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500">
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea rows={2} className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" placeholder={placeholder} />
      ) : (
        <input 
          type={type} 
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
