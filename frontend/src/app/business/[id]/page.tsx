'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/layouts/PageWrapper';
import { API_ENDPOINTS } from '@/lib/api';
import {
  ArrowLeft, Building2, Truck, Package, Calculator, Boxes, Scale, Home, Eye,
  Globe, Phone, Mail, Clock, CreditCard, CalendarDays, Shield, MapPin, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentDrawer } from '@/components/ui/DocumentDrawer';

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: 'bg-emerald-100 text-emerald-700',
    Active: 'bg-emerald-100 text-emerald-700',
    Settled: 'bg-emerald-100 text-emerald-700',
    Operational: 'bg-emerald-100 text-emerald-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    'In Stock': 'bg-emerald-100 text-emerald-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Scheduled: 'bg-blue-100 text-blue-700',
    IN: 'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
    'Low Stock': 'bg-amber-100 text-amber-700',
    'Needs Attention': 'bg-amber-100 text-amber-700',
    Sent: 'bg-purple-100 text-purple-700',
    Expired: 'bg-red-100 text-red-700',
    Overdue: 'bg-red-100 text-red-700',
    'Out of Stock': 'bg-red-100 text-red-700',
    OUT: 'bg-red-100 text-red-700',
  };
  return (
    <span className={cn('px-1.5 py-px rounded text-[8px] font-black uppercase tracking-tight shrink-0', map[status] ?? 'bg-slate-100 text-slate-500')}>
      {status}
    </span>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ icon: Icon, iconBg, title, count, children, gridCols = 'grid-cols-1', tableContent }: {
  icon: React.ElementType; iconBg: string; title: string; count: number; children: React.ReactNode; gridCols?: string; tableContent?: React.ReactNode;
}) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300", viewMode === 'table' ? 'h-auto min-h-[400px]' : 'h-[400px]')}>
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm', iconBg)}>
            <Icon size={14} />
          </div>
          <span className="text-[13px] font-bold text-slate-800 tracking-tight">{title}</span>
          <div className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200 ml-1">
            {count}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tableContent && (
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={cn("p-1 rounded-md transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600")}
              >
                <Boxes size={12} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn("p-1 rounded-md transition-all", viewMode === 'table' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600")}
              >
                <Scale size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-white">
        {viewMode === 'grid' ? (
          <div className={cn('grid gap-2', gridCols)}>
            {children}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {tableContent}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Compact Card ─────────────────────────────────────────────────────────────

const kindAccents: Record<string, string> = {
  invoice:      'border-l-emerald-500',
  transaction:  'border-l-slate-400',
  bank:         'border-l-blue-500',
  loan:         'border-l-orange-500',
  insurance:    'border-l-teal-500',
  vat:          'border-l-yellow-500',
  dojo:         'border-l-purple-500',
  vehicle:      'border-l-blue-600',
  parcel:       'border-l-orange-600',
  product:      'border-l-yellow-600',
  movement:     'border-l-amber-500',
  supplier:     'border-l-orange-600',
  po:           'border-l-amber-600',
  document:     'border-l-slate-400',
  registration: 'border-l-indigo-500',
  maintenance:  'border-l-red-500',
  asset:        'border-l-blue-500',
  waste:        'border-l-green-500',
  licence:      'border-l-purple-500',
  reminder:     'border-l-rose-500',
};

const kindLabels: Record<string, string> = {
  invoice: 'Invoice', transaction: 'Transaction', bank: 'Bank Account',
  loan: 'Loan', insurance: 'Insurance', vat: 'VAT', dojo: 'Dojo',
  vehicle: 'Vehicle', parcel: 'Parcel Partner',
  product: 'Product', movement: 'Stock Move',
  supplier: 'Supplier', po: 'Purchase Order',
  document: 'Document', registration: 'Companies House',
  maintenance: 'Maintenance', asset: 'Asset', waste: 'Waste', licence: 'Licence', reminder: 'Reminder',
};

function Card({ kind, title, subtitle, fields, status, onView, href }: {
  kind: string;
  title: string;
  subtitle?: string;
  fields: { label: string; value: React.ReactNode }[];
  status?: string;
  onView?: () => void;
  href?: string;
}) {
  const router = useRouter();
  const accentClass = kindAccents[kind] ?? 'border-l-slate-200';
  const activeFields = fields.filter(f => f.value !== undefined && f.value !== null && f.value !== '');
  
  const handleClick = (e: React.MouseEvent) => {
    // If the click was on the "View" button, let it handle the event
    if ((e.target as HTMLElement).closest('button')) return;
    if (onView) {
      onView();
      return;
    }
    if (href) router.push(href);
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        'bg-white border border-slate-100 border-l-4 p-2.5 rounded-lg flex flex-col gap-1.5 hover:shadow-md hover:border-slate-200 transition-all group', 
        accentClass,
        href ? 'cursor-pointer active:scale-[0.98]' : ''
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          {kindLabels[kind] ?? kind}
        </span>
        <div className="flex items-center gap-1">
          {onView && (
            <button
              onClick={(e) => { e.stopPropagation(); onView(); }}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <Eye size={10} /> View
            </button>
          )}
          {status && <StatusBadge status={status} />}
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-800 truncate leading-tight">{title}</p>
        {subtitle && <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{subtitle}</p>}
      </div>
      {activeFields.length > 0 && (
        <div className="space-y-0.5 pt-1.5 mt-1 border-t border-slate-50">
          {activeFields.map((f, i) => (
            <div key={i} className="flex gap-1.5 text-[10px] leading-snug">
              <span className="text-slate-400 shrink-0 font-medium">{f.label}:</span>
              <span className="text-slate-700 font-bold truncate">{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Record Table ─────────────────────────────────────────────────────────────

function RecordTable({ data, type, onSelect }: { data: any[]; type: string; onSelect?: (item: any) => void }) {
  if (!data || data.length === 0) return (
    <div className="py-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
      No records found
    </div>
  );

  return (
    <table className="wt">
      <thead>
        <tr>
          {type === 'accounting' && (
            <>
              <th>NAME / TITLE</th>
              <th>CATEGORY / KIND</th>
              <th>AMOUNT</th>
              <th>DATE</th>
              <th className="text-center">STATUS</th>
            </>
          )}
          {type === 'fleet' && (
            <>
              <th>VEHICLE / PROVIDER</th>
              <th>REG / AREA</th>
              <th>INSURANCE / CONTACT</th>
              <th>MOT / SERVICE</th>
              <th className="text-center">STATUS</th>
            </>
          )}
          {type === 'inventory' && (
            <>
              <th>ITEM NAME</th>
              <th>SKU / CATEGORY</th>
              <th>STOCK LEVEL</th>
              <th>PRICE / TYPE</th>
              <th className="text-center">STATUS</th>
            </>
          )}
          {type === 'legal' && (
            <>
              <th>TITLE</th>
              <th>DOCUMENT TYPE</th>
              <th>EXPIRY / DUE</th>
              <th className="text-center">STATUS</th>
            </>
          )}
          {type === 'property' && (
            <>
              <th>ASSET / TASK</th>
              <th>LOCATION / TYPE</th>
              <th>CONTACT / PERSON</th>
              <th>DATE / DUE</th>
              <th className="text-center">STATUS</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={i} onClick={() => onSelect?.(r)} className={cn("transition-colors", onSelect ? "cursor-pointer hover:bg-slate-50" : "")}>
            {type === 'accounting' && (
              <>
                <td><strong className="text-slate-800">{r.name || r.title || 'Record'}</strong></td>
                <td><span className="text-[10px] text-slate-500 font-bold uppercase">{r._kind}</span></td>
                <td><span className="font-bold text-slate-700">{r.amount || '-'}</span></td>
                <td><span className="text-slate-500">{r.date || r.dueDate || '-'}</span></td>
                <td className="text-center"><StatusBadge status={r.status} /></td>
              </>
            )}
            {type === 'fleet' && (
              <>
                <td><strong className="text-slate-800">{r.vehicleName || r.provider}</strong></td>
                <td><span className="text-slate-500 font-bold">{r.vehicleNumber || r.area || '-'}</span></td>
                <td><span className="text-slate-500">{r.insuranceExpiry || r.contact || '-'}</span></td>
                <td><span className="text-slate-500">{r.motDate || r.serviceDate || '-'}</span></td>
                <td className="text-center"><StatusBadge status={r.status} /></td>
              </>
            )}
            {type === 'inventory' && (
              <>
                <td><strong className="text-slate-800">{r.item}</strong></td>
                <td><span className="text-slate-500 font-bold uppercase">{r.sku || r.category || '-'}</span></td>
                <td><span className={cn("font-bold", r.stockLevel === 'Low Stock' ? 'text-amber-600' : 'text-slate-700')}>{r.stockLevel || r.quantity || '-'}</span></td>
                <td><span className="text-slate-500 font-bold">{r.price || r.type || '-'}</span></td>
                <td className="text-center"><StatusBadge status={r.status} /></td>
              </>
            )}
            {type === 'legal' && (
              <>
                <td><strong className="text-slate-800">{r.title}</strong></td>
                <td><span className="text-slate-500 font-bold uppercase">{r.type || r._kind}</span></td>
                <td><span className="text-slate-500">{r.expiryDate || r.filingDue || '-'}</span></td>
                <td className="text-center"><StatusBadge status={r.status} /></td>
              </>
            )}
            {type === 'property' && (
              <>
                <td><strong className="text-slate-800">{r.name || r.title || r.asset || 'Task'}</strong></td>
                <td><span className="text-slate-500 font-bold uppercase">{r.location || r.assetType || r._kind}</span></td>
                <td><span className="text-slate-500">{r.contact || r.assignedPerson || r.contactPerson || '-'}</span></td>
                <td><span className="text-slate-500">{r.date || r.dueDate || r.issueDate || '-'}</span></td>
                <td className="text-center"><StatusBadge status={r.status} /></td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Accounting Records ───────────────────────────────────────────────────────

// ─── Accounting Records ───────────────────────────────────────────────────────

function AccountingRecord({ r, onSelect }: { r: any; onSelect?: (item: any) => void }) {
  const common = { status: r.status, onView: onSelect ? () => onSelect(r) : undefined, href: "/accounting" };
  if (r._kind === 'bank') return (
    <Card kind="bank" title={r.name} subtitle={r.accountName} {...common}
      fields={[
        { label: 'Account No', value: r.accountNumber },
        { label: 'Sort Code',  value: r.sortCode },
        { label: 'Type',       value: r.accountType },
      ]} />
  );
  if (r._kind === 'loan') return (
    <Card kind="loan" title={r.name} subtitle={r.lender} {...common}
      fields={[
        { label: 'Total',       value: r.totalAmount },
        { label: 'Outstanding', value: r.outstanding },
        { label: 'Monthly',     value: r.monthly },
        { label: 'Rate',        value: r.rate },
      ]} />
  );
  if (r._kind === 'insurance') return (
    <Card kind="insurance" title={r.name} subtitle={r.provider} {...common}
      fields={[
        { label: 'Policy No', value: r.policyNumber },
        { label: 'Premium',   value: r.premium },
        { label: 'Expiry',    value: r.expiry },
      ]} />
  );
  if (r._kind === 'vat') return (
    <Card kind="vat" title={r.name} subtitle={r.period} {...common}
      fields={[
        { label: 'Amount', value: r.amount },
        { label: 'Date',   value: r.date },
      ]} />
  );
  if (r._kind === 'dojo') return (
    <Card kind="dojo" title={`Dojo · ${r.date}`} subtitle={r.method} {...common} href="/payments"
      fields={[
        { label: 'Amount', value: r.amount },
        { label: 'Fee',    value: r.fee },
        { label: 'Net',    value: r.net },
      ]} />
  );
  if (r._kind === 'invoice') return (
    <Card kind="invoice" title={r.name} subtitle={r.title} {...common}
      fields={[
        { label: 'Amount',   value: r.amount },
        { label: 'Due Date', value: r.dueDate },
      ]} />
  );
  return (
    <Card kind="transaction" title={r.name} subtitle={r.category} {...common}
      fields={[
        { label: 'Type',   value: r.type },
        { label: 'Amount', value: r.amount },
        { label: 'Date',   value: r.dueDate },
        { label: 'Notes',  value: r.notes },
      ]} />
  );
}

// ─── Fleet Records ────────────────────────────────────────────────────────────

function FleetRecord({ r, onSelect }: { r: any; onSelect?: (item: any) => void }) {
  const common = { status: r.status, onView: onSelect ? () => onSelect(r) : undefined, href: "/fleet" };
  if (r._kind === 'parcel') return (
    <Card kind="parcel" title={r.provider} subtitle={r.area} {...common}
      fields={[
        { label: 'Vehicle',  value: r.vehicle },
        { label: 'Contact',  value: r.contact },
        { label: 'Phone',    value: r.phone },
        { label: 'Service',  value: r.serviceDate },
      ]} />
  );
  return (
    <Card kind="vehicle" title={r.vehicleName} subtitle={r.vehicleNumber} {...common}
      fields={[
        { label: 'Insurance', value: r.insuranceExpiry },
        { label: 'MOT',       value: r.motDate },
        { label: 'Road Tax',  value: r.roadTaxDate },
        { label: 'Delivery',  value: r.deliveryDate },
        { label: 'Notes',     value: r.notes },
      ]} />
  );
}

// ─── Inventory Records ────────────────────────────────────────────────────────

function InventoryRecord({ r, onSelect }: { r: any; onSelect?: (item: any) => void }) {
  const common = { onView: onSelect ? () => onSelect(r) : undefined, href: "/inventory" };
  if (r._kind === 'movement') return (
    <Card kind="movement" title={r.item} subtitle={r.date} status={r.type} {...common}
      fields={[
        { label: 'Qty',   value: r.quantity },
        { label: 'Notes', value: r.notes },
      ]} />
  );
  return (
    <Card kind="product" title={r.item} subtitle={r.category} status={r.status} {...common}
      fields={[
        { label: 'SKU',   value: r.sku },
        { label: 'Stock', value: r.stockLevel },
        { label: 'Price', value: r.price },
      ]} />
  );
}

// ─── Supplier Records ─────────────────────────────────────────────────────────

function SupplierRecord({ r, onSelect }: { r: any; onSelect?: (item: any) => void }) {
  const common = { status: r.status, onView: onSelect ? () => onSelect(r) : undefined, href: "/suppliers" };
  if (r._kind === 'po') return (
    <Card kind="po" title={r.number} subtitle={r.supplierName} {...common}
      fields={[
        { label: 'Product', value: r.product },
        { label: 'Qty',     value: r.quantity },
        { label: 'Amount',  value: r.amount },
        { label: 'Date',    value: r.date },
      ]} />
  );
  return (
    <Card kind="supplier" title={r.supplierName} subtitle={r.category} {...common}
      fields={[
        { label: 'Contact', value: r.contact },
        { label: 'Phone',   value: r.phone },
        { label: 'Email',   value: r.email },
      ]} />
  );
}

// ─── Legal Records ────────────────────────────────────────────────────────────

function LegalRecord({ r, onView, onSelect }: { r: any; onView: (doc: any) => void; onSelect?: (item: any) => void }) {
  const common = { status: r.status, href: "/legal" };
  
  const handleSelect = () => {
    if (onSelect) onSelect(r);
  };

  if (r._kind === 'registration') return (
    <Card kind="registration" title={r.title} subtitle={`CRN: ${r.crn}`} {...common}
      onView={() => {
        onView({ title: r.title, type: 'Companies House Registration', status: r.status, date: r.filingDue });
        if (onSelect) onSelect(r);
      }}
      fields={[
        { label: 'Manager',     value: r.manager },
        { label: 'SIC Code',    value: r.sicCode },
        { label: 'Filing Due',  value: r.filingDue },
        { label: 'Address',     value: r.address },
      ]} />
  );
  return (
    <Card kind="document" title={r.title} subtitle={r.type} {...common}
      onView={() => {
        onView(r);
        if (onSelect) onSelect(r);
      }}
      fields={[
        { label: 'Business', value: r.business },
        { label: 'Expiry',   value: r.expiryDate },
      ]} />
  );
}

// ─── Property Records ─────────────────────────────────────────────────────────

function PropertyRecord({ r, onSelect }: { r: any; onSelect?: (item: any) => void }) {
  const common = { status: r.status, onView: onSelect ? () => onSelect(r) : undefined, href: "/property" };
  if (r._kind === 'asset') return (
    <Card kind="asset" title={r.name} subtitle={r.assetType} {...common}
      fields={[
        { label: 'Location',    value: r.location },
        { label: 'Assigned To', value: r.assignedPerson },
        { label: 'Contact',     value: r.contact },
      ]} />
  );
  if (r._kind === 'waste') return (
    <Card kind="waste" title="Waste Collection" subtitle={r.date} {...common}
      fields={[
        { label: 'Contact', value: r.contactPerson },
        { label: 'Phone',   value: r.phone },
        { label: 'Address', value: r.address },
        { label: 'Notes',   value: r.notes },
      ]} />
  );
  if (r._kind === 'licence') return (
    <Card kind="licence" title={r.type} subtitle={r.authority} {...common}
      fields={[
        { label: 'Business', value: r.business },
        { label: 'Issued',   value: r.issueDate },
        { label: 'Expiry',   value: r.expiryDate },
      ]} />
  );
  if (r._kind === 'reminder') return (
    <Card kind="reminder" title={r.title} subtitle={r.priority} {...common} href="/reminders"
      fields={[
        { label: 'Due',         value: r.dueDate },
        { label: 'Description', value: r.description },
      ]} />
  );
  return (
    <Card kind="maintenance" title={r.asset || 'Maintenance'} subtitle={r.priority} {...common}
      fields={[
        { label: 'Issue',      value: r.issue },
        { label: 'Location',   value: r.location },
        { label: 'Technician', value: r.technician },
        { label: 'Date',       value: r.date },
      ]} />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BusinessDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const slug = id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'finance' | 'ops' | 'legal'>('overview');

  const handleViewDoc = (doc: any) => {
    setSelectedDoc({
      title: doc.title,
      type: doc.type,
      status: doc.status,
      date: doc.expiryDate,
    });
    setDrawerOpen(true);
  };

  const handleRecordSelect = (r: any) => {
    const modules: Record<string, string> = {
      bank: '/accounting', loan: '/accounting', insurance: '/accounting', vat: '/accounting', 
      invoice: '/accounting', transaction: '/accounting', vehicle: '/fleet', parcel: '/fleet',
      product: '/inventory', movement: '/inventory', supplier: '/suppliers', po: '/suppliers',
      registration: '/legal', document: '/legal', asset: '/property', waste: '/property',
      licence: '/property', reminder: '/reminders', maintenance: '/property'
    };

    const tabMap: Record<string, string> = {
      invoice: 'invoices', bank: 'bank', loan: 'loans', insurance: 'insurance', vat: 'tax', transaction: 'records',
      vehicle: 'vehicles', parcel: 'parcels',
      product: 'products', movement: 'movements',
      supplier: 'suppliers', po: 'orders',
      asset: 'assets', licence: 'licences', waste: 'waste', maintenance: 'maintenance'
    };

    const target = modules[r._kind] || '/dashboard';
    const tab = tabMap[r._kind] || '';
    const searchParam = r.name || r.title || r.item || r.vehicleName || r.plate || '';
    
    let url = `${target}?search=${encodeURIComponent(searchParam)}&view=wide`;
    if (tab) url += `&tab=${tab}`;
    
    router.push(url);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError(null);

    fetch(`${API_ENDPOINTS.BUSINESS}${slug}/`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('Business not found');
          throw new Error(`Server responded with ${res.status}`);
        }
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid server response (not JSON)');
        }

        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <PageWrapper title="Loading...">
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Synchronizing records...</p>
        </div>
      </div>
    </PageWrapper>
  );

  if (error || !data) return (
    <PageWrapper title="Error">
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <X size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-800">Oops! {error || 'Business not found'}</h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">We couldn't retrieve the details for this business. It might have been deleted or renamed.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-[#2c3e50] text-white rounded-xl font-bold text-xs"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </PageWrapper>
  );

  const business = data.business ?? {};
  const logo = business.logo_url;

  const infoParts = [
    { label: 'Category', value: business.category, icon: Building2 },
    { label: 'Co. No', value: business.company_number, icon: Shield },
    { label: 'VAT', value: business.tax_id, icon: CreditCard },
    { label: 'HQ', value: business.hq_location, icon: MapPin },
    { label: 'Currency', value: business.currency, icon: CreditCard },
  ].filter(p => p.value);

  const contactParts = [
    { label: 'Website', value: business.website, icon: Globe, isLink: true },
    { label: 'Phone', value: business.phone, icon: Phone },
    { label: 'Email', value: business.email, icon: Mail },
  ].filter(p => p.value);

  const hasPermission = (moduleName: string): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    if (!user.permissions) return false;
    
    try {
      let perms = user.permissions;
      if (typeof perms === 'string') {
        const clean = perms.replace(/'/g, '"').replace(/None/g, 'null').replace(/True/g, 'true').replace(/False/g, 'false');
        perms = JSON.parse(clean);
        if (typeof perms === 'string') perms = JSON.parse(perms);
      }
      
      const modPerms = perms[moduleName];
      return Array.isArray(modPerms) && modPerms.includes('view');
    } catch (e) {
      return false;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: Home, visible: true },
    { id: 'finance', label: 'Financial Matrix', icon: Calculator, visible: hasPermission('Accounting') || hasPermission('Financial Records') || hasPermission('Invoices') || hasPermission('Tax Records') || hasPermission('Merchant Services') },
    { id: 'ops', label: 'Operations & Fleet', icon: Truck, visible: hasPermission('Fleet Management') || hasPermission('Vehicle Fleet') || hasPermission('Inventory Management') || hasPermission('Suppliers') },
    { id: 'legal', label: 'Legal & Assets', icon: Scale, visible: hasPermission('Legal & Compliance') || hasPermission('Property Management') || hasPermission('Property Inventory') },
  ].filter(t => t.visible);

  return (
    <PageWrapper title="Business Hub">
      <>
        <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
          <div className="bg-white border-b border-slate-200 px-8 py-5 shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-slate-50">
                  {logo ? (
                    <img src={logo} alt={business.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <Building2 size={24} className="text-slate-300" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{business.name || slug}</h2>
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full shadow-sm uppercase tracking-widest">
                      {business.status || 'Active'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {infoParts.map((p, i) => (
                      <div key={i} className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                        <p.icon size={10} className="text-slate-400" />
                        <span>{p.value}</span>
                      </div>
                    ))}
                    <div className="h-3 w-[1px] bg-slate-200 mx-1 hidden md:block" />
                    {contactParts.map((p, i) => (
                      <div key={i} className="flex items-center gap-1 text-[10px] font-bold text-teal-600">
                        {p.isLink ? (
                          <a href={p.value.startsWith('http') ? p.value : `https://${p.value}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-teal-700 transition-colors">
                            <p.icon size={10} className="text-teal-400" />
                            <span className="underline decoration-teal-200 underline-offset-2">{p.value.replace(/^https?:\/\//, '')}</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-1">
                            <p.icon size={10} className="text-teal-400" />
                            <span>{p.value}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 lg:self-start">
                <button
                  onClick={() => router.push('/business')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 text-xs font-black rounded-2xl transition-all border border-slate-200 shadow-sm hover:shadow active:scale-95"
                >
                  <Building2 size={14} /> View All Entities
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95 ring-2 ring-slate-100"
                >
                  <ArrowLeft size={14} /> Back to Dashboard
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white border-b border-slate-200 px-8 flex items-center gap-6 shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 py-3 text-[10px] font-black uppercase tracking-wider transition-all relative",
                  activeTab === tab.id 
                    ? "text-indigo-600" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <tab.icon size={12} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full shadow-[0_-2px_10px_rgba(79,70,229,0.4)]" />
                )}
              </button>
            ))}
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto p-[0.75rem_0.75rem_1.5rem] no-scrollbar bg-[#f1f5f9]/30">
              <div className="mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all max-w-[1600px]">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       <div className="lg:col-span-2 space-y-8">
                          {hasPermission('Accounting') && (
                            <SectionCard icon={Calculator} iconBg="bg-[#3b82f6]" title="Recent Transactions" count={data.accounting?.length || 0} gridCols="grid-cols-3"
                              tableContent={<RecordTable data={data.accounting || []} type="accounting" onSelect={handleRecordSelect} />}
                            >
                              {data.accounting?.slice(0, 9).map((r: any, i: number) => <AccountingRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                            </SectionCard>
                          )}
                          {hasPermission('Vehicle Fleet') && (
                            <SectionCard icon={Truck} iconBg="bg-[#14b8a6]" title="Fleet Status" count={data.fleet?.length || 0} gridCols="grid-cols-3"
                              tableContent={<RecordTable data={data.fleet || []} type="fleet" onSelect={handleRecordSelect} />}
                            >
                              {data.fleet?.slice(0, 9).map((r: any, i: number) => <FleetRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                            </SectionCard>
                          )}
                       </div>
                       <div className="space-y-8">
                          {hasPermission('Reminders') && (
                            <SectionCard icon={Clock} iconBg="bg-[#ef4444]" title="Critical Reminders" count={data.property?.filter((p: any) => p._kind === 'reminder')?.length || 0}
                              tableContent={<RecordTable data={data.property?.filter((p: any) => p._kind === 'reminder') || []} type="property" onSelect={handleRecordSelect} />}
                            >
                              {data.property?.filter((p: any) => p._kind === 'reminder').slice(0, 5).map((r: any, i: number) => <PropertyRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                            </SectionCard>
                          )}
                          {hasPermission('Legal & Compliance') && (
                            <SectionCard icon={Shield} iconBg="bg-[#f59e0b]" title="Compliance Snapshot" count={data.legal?.length || 0}
                              tableContent={<RecordTable data={data.legal || []} type="legal" onSelect={handleRecordSelect} />}
                            >
                              {data.legal?.slice(0, 3).map((r: any, i: number) => <LegalRecord key={i} r={r} onView={handleViewDoc} onSelect={handleRecordSelect} />)}
                            </SectionCard>
                          )}
                       </div>
                    </div>
                  </div>
                )}
                {activeTab === 'finance' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {hasPermission('Invoices') && (
                      <SectionCard icon={Calculator} iconBg="bg-[#3b82f6]" title="Invoices & Statements" count={data.accounting?.filter((r: any) => r._kind === 'invoice').length || 0} gridCols="grid-cols-2"
                        tableContent={<RecordTable data={data.accounting?.filter((r: any) => r._kind === 'invoice') || []} type="accounting" onSelect={handleRecordSelect} />}
                      >
                        {data.accounting?.filter((r: any) => r._kind === 'invoice').map((r: any, i: number) => <AccountingRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                      </SectionCard>
                    )}
                    {hasPermission('Merchant Services') && (
                      <SectionCard icon={CreditCard} iconBg="bg-purple-600" title="Payment Service Records (Dojo/etc)" count={data.accounting?.filter((r: any) => r._kind === 'payment').length || 0} gridCols="grid-cols-2"
                        tableContent={<RecordTable data={data.accounting?.filter((r: any) => r._kind === 'payment') || []} type="accounting" onSelect={handleRecordSelect} />}
                      >
                        {data.accounting?.filter((r: any) => r._kind === 'payment').map((r: any, i: number) => <AccountingRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                      </SectionCard>
                    )}
                    {hasPermission('Tax Records') && (
                      <SectionCard icon={Clock} iconBg="bg-[#ef4444]" title="VAT & Tax Records" count={data.accounting?.filter((r: any) => r._kind === 'vat').length || 0} gridCols="grid-cols-2"
                        tableContent={<RecordTable data={data.accounting?.filter((r: any) => r._kind === 'vat') || []} type="accounting" onSelect={handleRecordSelect} />}
                      >
                        {data.accounting?.filter((r: any) => r._kind === 'vat').map((r: any, i: number) => <AccountingRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                      </SectionCard>
                    )}
                    {(hasPermission('Bank Accounts') || hasPermission('Loans & Insurance')) && (
                      <SectionCard icon={Building2} iconBg="bg-[#3b82f6]" title="Banking & Finance" count={data.accounting?.filter((r: any) => ['bank', 'loan', 'insurance'].includes(r._kind)).length || 0} gridCols="grid-cols-2"
                        tableContent={<RecordTable data={data.accounting?.filter((r: any) => ['bank', 'loan', 'insurance'].includes(r._kind)) || []} type="accounting" onSelect={handleRecordSelect} />}
                      >
                        {data.accounting?.filter((r: any) => ['bank', 'loan', 'insurance'].includes(r._kind)).map((r: any, i: number) => <AccountingRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                      </SectionCard>
                    )}
                  </div>
                )}
                {activeTab === 'ops' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {hasPermission('Vehicle Fleet') && (
                      <SectionCard icon={Truck} iconBg="bg-[#14b8a6]" title="Active Fleet Management" count={data.fleet?.filter((r: any) => r._kind === 'vehicle').length || 0} gridCols="grid-cols-2"
                        tableContent={<RecordTable data={data.fleet?.filter((r: any) => r._kind === 'vehicle') || []} type="fleet" onSelect={handleRecordSelect} />}
                      >
                        {data.fleet?.filter((r: any) => r._kind === 'vehicle').map((r: any, i: number) => <FleetRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                      </SectionCard>
                    )}
                    {(hasPermission('Parcel Services') || hasPermission('Delivery Tracking')) && (
                      <SectionCard icon={Package} iconBg="bg-[#14b8a6]" title="Parcel & Delivery Partners" count={data.fleet?.filter((r: any) => r._kind === 'parcel').length || 0} gridCols="grid-cols-2"
                        tableContent={<RecordTable data={data.fleet?.filter((r: any) => r._kind === 'parcel') || []} type="fleet" onSelect={handleRecordSelect} />}
                      >
                        {data.fleet?.filter((r: any) => r._kind === 'parcel').map((r: any, i: number) => <FleetRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                      </SectionCard>
                    )}
                    {hasPermission('Inventory Management') && (
                      <SectionCard icon={Boxes} iconBg="bg-[#f59e0b]" title="Inventory Matrix" count={data.inventory?.filter((r: any) => r._kind === 'product').length || 0} gridCols="grid-cols-2"
                        tableContent={<RecordTable data={data.inventory?.filter((r: any) => r._kind === 'product') || []} type="inventory" onSelect={handleRecordSelect} />}
                      >
                        {data.inventory?.filter((r: any) => r._kind === 'product').map((r: any, i: number) => <InventoryRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                      </SectionCard>
                    )}
                    {hasPermission('Suppliers') && (
                      <SectionCard icon={Package} iconBg="bg-[#f59e0b]" title="Supplier & Purchase Orders" count={data.supplier?.length || 0} gridCols="grid-cols-2"
                        tableContent={<RecordTable data={data.supplier || []} type="inventory" onSelect={handleRecordSelect} />}
                      >
                        {data.supplier?.map((r: any, i: number) => <SupplierRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                      </SectionCard>
                    )}
                  </div>
                )}
                {activeTab === 'legal' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {hasPermission('Legal & Compliance') && (
                      <SectionCard icon={Scale} iconBg="bg-[#f59e0b]" title="Legal Documentation" count={data.legal?.length || 0} gridCols="grid-cols-2"
                        tableContent={<RecordTable data={data.legal || []} type="legal" onSelect={handleRecordSelect} />}
                      >
                        {data.legal?.map((r: any, i: number) => <LegalRecord key={i} r={r} onView={handleViewDoc} onSelect={handleRecordSelect} />)}
                      </SectionCard>
                    )}
                    {hasPermission('Property Inventory') && (
                      <SectionCard icon={Home} iconBg="bg-[#3b82f6]" title="Property & Assets" count={data.property?.filter((r: any) => r._kind !== 'reminder').length || 0} gridCols="grid-cols-2"
                        tableContent={<RecordTable data={data.property?.filter((r: any) => r._kind !== 'reminder') || []} type="property" onSelect={handleRecordSelect} />}
                      >
                        {data.property?.filter((r: any) => r._kind !== 'reminder').map((r: any, i: number) => <PropertyRecord key={i} r={r} onSelect={handleRecordSelect} />)}
                      </SectionCard>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DocumentDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          documentData={selectedDoc}
        />
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

          .wt { width: 100%; border-collapse: collapse; font-size: 11px; }
          .wt th { font-size: 9px; font-weight: 800; text-transform: uppercase; color: #64748b; padding: 10px 8px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; text-align: left; background: #fcfcfd; }
          .wt td { padding: 8px; border-bottom: 1px solid #f8fafc; vertical-align: middle; color: #1e293b; }
          .wt tr:hover td { background: #f8fafc; }
        `}</style>
      </>
    </PageWrapper>
  );
}
