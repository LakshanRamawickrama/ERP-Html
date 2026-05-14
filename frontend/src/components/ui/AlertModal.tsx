'use client';

import React from 'react';
import { Info, X, ShieldAlert, AlertCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'info' | 'warning' | 'error';
}

export function AlertModal({ 
  isOpen, 
  onClose, 
  title = "Information", 
  message,
  type = 'info'
}: AlertModalProps) {
  if (!isOpen) return null;

  const config = {
    info: {
      icon: Info,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
    },
    error: {
      icon: ShieldAlert,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
      button: 'bg-red-600 hover:bg-red-700 shadow-red-200'
    }
  }[type];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center ${config.color} border ${config.border} shadow-sm`}>
              <Icon className="w-6 h-6" />
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-all hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
            {message}
          </p>
          
          <button
            onClick={onClose}
            className={`w-full py-3.5 rounded-2xl ${config.button} text-white text-sm font-bold shadow-lg transition-all transform active:scale-[0.98] hover:shadow-xl`}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
