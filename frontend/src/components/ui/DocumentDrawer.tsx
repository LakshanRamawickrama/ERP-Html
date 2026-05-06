'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, 
  FileText, 
  MoreVertical,
  Calendar,
  User,
  Clock,
  Eye,
  AlertCircle
} from 'lucide-react';

interface DocumentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: {
    title: string;
    type?: string;
    status?: string;
    author?: string;
    date?: string;
    fileSize?: string;
    content?: any[];
  } | null;
}

export function DocumentDrawer({ isOpen, onClose, documentData }: DocumentDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = 'auto';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 leading-tight">
                  {documentData?.title || 'Document Viewer'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Internal ERP Document
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#fcfcfd]">
            <div className="max-w-xl mx-auto space-y-8">
              

              {/* Mock PDF Viewer */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold">PAGE 1 / 1</span>
                    <div className="flex items-center gap-1">
                       <button className="p-1 hover:text-white transition-colors">-</button>
                       <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded">100%</span>
                       <button className="p-1 hover:text-white transition-colors">+</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye className="w-3.5 h-3.5" />
                    <MoreVertical className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Document Body Mock */}
                <div className="p-12 space-y-8 font-serif text-slate-700 leading-relaxed">
                  <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1 uppercase">
                        {documentData?.title || 'OFFICIAL DOCUMENT'}
                      </h2>
                      <p className="text-xs font-bold text-slate-400">REF: ERP-DOC-2026-0042</p>
                    </div>
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                  </div>

                  {documentData?.content ? (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full text-left border-collapse text-[10px]">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            {Object.keys(documentData.content[0] || {}).filter(k => k !== 'id' && k !== 'slug').map((k) => (
                              <th key={k} className="p-2 font-bold text-slate-500 uppercase">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {documentData.content.map((row: any, i: number) => (
                            <tr key={i} className="border-b border-slate-100">
                              {Object.entries(row).filter(([k]) => k !== 'id' && k !== 'slug').map(([k, v]: any, j: number) => (
                                <td key={j} className="p-2 text-slate-600 font-medium">{String(v)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-50 rounded-full w-full" />
                      <div className="h-4 bg-slate-50 rounded-full w-[90%]" />
                      <div className="h-4 bg-slate-50 rounded-full w-[95%]" />
                      <div className="h-4 bg-slate-50 rounded-full w-[80%]" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-12 pt-8">
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Signature</p>
                      <div className="h-12 border-b border-slate-200 flex items-end pb-1 italic font-serif text-slate-400">
                        Signature Not Required
                      </div>
                    </div>
                    <div className="space-y-3">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification QR</p>
                       <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                          <div className="grid grid-cols-3 gap-0.5 p-1">
                             {[...Array(9)].map((_, i) => (
                               <div key={i} className={`w-2 h-2 ${i % 2 === 0 ? 'bg-slate-300' : 'bg-slate-200'}`} />
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                    This is an automatically generated document from the Enterprise Resource Planning system.
                    <br />© 2026 ERP-Global Solutions. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Last viewed: Just now</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-lg hover:bg-[#34495e] transition-all">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

