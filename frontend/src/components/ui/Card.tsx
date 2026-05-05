import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps {
  title: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  icon: Icon, 
  iconColor = 'bg-blue-500', 
  children, 
  headerAction,
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col ${className}`}>
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={`w-6 h-6 rounded-md ${iconColor} flex items-center justify-center text-white`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <h6 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
            {title}
          </h6>
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div className={cn("flex-1", noPadding ? "p-0" : "p-4")}>
        {children}
      </div>
    </div>
  );
};
