'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  FileText,
  MoreVertical,
  Clock,
  Eye,
  ExternalLink,
  Download,
  Image as ImageIcon,
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
    fileUrl?: string;
  } | null;
}

function isImage(url: string) {
  // Check common image extensions or if the URL looks like an image data/blob
  return /\.(png|jpe?g|gif|webp|bmp|svg|heic)(\?|$)/i.test(url) || url.startsWith('data:image/') || url.includes('blob:');
}

function isPdf(url: string) {
  return /\.pdf(\?|$)/i.test(url);
}

function isOffice(url: string) {
  return /\.(docx?|xlsx?|pptx?)(\?|$)/i.test(url);
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

  const fileUrl = documentData?.fileUrl;
  const hasRealFile = !!fileUrl;

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
                  {hasRealFile ? 'Uploaded Document' : 'Internal ERP Document'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasRealFile && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-[#fcfcfd]">
            {hasRealFile ? (
              /* ── Real file viewer ── */
              <div className="h-full flex flex-col">
                {isPdf(fileUrl!) ? (
                  <iframe
                    src={fileUrl}
                    className="flex-1 w-full border-none"
                    style={{ minHeight: '100%' }}
                    title={documentData?.title}
                  />
                ) : isImage(fileUrl!) ? (
                  <div className="flex-1 flex items-center justify-center p-6 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fileUrl}
                      alt={documentData?.title}
                      className="max-w-full max-h-full rounded-xl shadow-lg object-contain"
                    />
                  </div>
                ) : isOffice(fileUrl!) ? (
                  /* ── Office Document State ── */
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
                    <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm rotate-3 group-hover:rotate-0 transition-transform">
                      <FileText className="w-12 h-12 text-blue-500" />
                    </div>
                    <div className="space-y-3 max-w-sm">
                      <h4 className="text-xl font-bold text-slate-900">Microsoft Office Document</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Office documents (Word, Excel, PowerPoint) require external software to view. Please download the file to view it on your device.
                      </p>
                      <div className="pt-4">
                        <a
                          href={fileUrl}
                          download
                          className="inline-flex items-center gap-2 px-8 py-3 bg-[#2c3e50] text-white rounded-xl text-sm font-bold shadow-xl hover:bg-[#34495e] hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                          <Download className="w-4 h-4" /> Download to View
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Generic Fallback ── */
                  <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                    <div className="p-6 bg-slate-100 rounded-2xl">
                      <FileText className="w-12 h-12 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-700">Preview Not Supported</p>
                      <p className="text-xs text-slate-400">This file type cannot be previewed in the browser.</p>
                    </div>
                    <a
                      href={fileUrl}
                      download
                      className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 transition-all"
                    >
                      <Download className="w-4 h-4" /> Download File
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* ── No file state ── */
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                  <FileText className="w-12 h-12 text-slate-200" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900">No Document Uploaded</h4>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                    This record currently does not have a digital document attached. You can upload one via the Edit form.
                  </p>
                </div>
              </div>
            )}
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
              {hasRealFile ? (
                <a
                  href={fileUrl}
                  download
                  className="flex items-center gap-2 px-6 py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-lg hover:bg-[#34495e] transition-all"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              ) : (
                <button className="px-6 py-2 bg-[#2c3e50] text-white rounded-lg text-sm font-bold shadow-lg hover:bg-[#34495e] transition-all">
                  Download PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
