'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/layouts/PageWrapper';
import { API_ENDPOINTS } from '@/lib/api';
import {
  ArrowLeft, Building2, Truck, Package, Calculator, Boxes, Scale, Home, Eye,
  Globe, Phone, Mail, Clock, CreditCard, CalendarDays, Shield, MapPin
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

function SectionCard({ icon: Icon, iconBg, title, count, children }: {
  icon: React.ElementType; iconBg: string; title: string; count: number; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', iconBg)}>
            <Icon size={12} className="text-white" />
          </div>
          <span className="text-xs font-bold text-slate-800">{title}</span>
        </div>
        <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-[10px] font-black flex items-center justify-center">
          {count}
        </span>
      </div>
      <div className="overflow-y-auto max-h-[340px] custom-scrollbar p-2">
        <div className="grid grid-cols-3 gap-1.5">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Compact Card ─────────────────────────────────────────────────────────────

const kindColors: Record<string, string> = {
  invoice:     'bg-emerald-50  border-emerald-100',
  transaction: 'bg-slate-50    border-slate-200',
  bank:        'bg-blue-50     border-blue-100',
  loan:        'bg-orange-50   border-orange-100',
  insurance:   'bg-teal-50     border-teal-100',
  vat:         'bg-yellow-50   border-yellow-100',
  dojo:        'bg-purple-50   border-purple-100',
  vehicle:     'bg-blue-50     border-blue-100',
  parcel:      'bg-orange-50   border-orange-100',
  product:     'bg-yellow-50   border-yellow-100',
  movement:    'bg-amber-50    border-amber-100',
  supplier:    'bg-orange-50   border-orange-100',
  po:          'bg-amber-50    border-amber-100',
  document:     'bg-slate-50    border-slate-200',
  registration: 'bg-indigo-50   border-indigo-100',
  maintenance:  'bg-red-50      border-red-100',
  asset:        'bg-blue-50     border-blue-100',
  waste:        'bg-green-50    border-green-100',
  licence:      'bg-purple-50   border-purple-100',
  reminder:     'bg-rose-50     border-rose-100',
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

function Card({ kind, title, subtitle, fields, status, onView }: {
  kind: string;
  title: string;
  subtitle?: string;
  fields: { label: string; value: React.ReactNode }[];
  status?: string;
  onView?: () => void;
}) {
  const colorClass = kindColors[kind] ?? 'bg-slate-50 border-slate-200';
  const activeFields = fields.filter(f => f.value !== undefined && f.value !== null && f.value !== '');
  return (
    <div className={cn('rounded-lg border p-2 flex flex-col gap-1 hover:shadow-sm transition-shadow', colorClass)}>
      {/* Kind label + Status on same row */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
          {kindLabels[kind] ?? kind}
        </span>
        <div className="flex items-center gap-1">
          {onView && (
            <button
              onClick={onView}
              className="flex items-center gap-0.5 px-1.5 py-px rounded text-[8px] font-bold bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <Eye size={8} /> View
            </button>
          )}
          {status && <StatusBadge status={status} />}
        </div>
      </div>
      {/* Title + Subtitle */}
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">{title}</p>
        {subtitle && <p className="text-[9px] text-slate-500 truncate leading-tight">{subtitle}</p>}
      </div>
      {/* Fields */}
      {activeFields.length > 0 && (
        <div className="space-y-px border-t border-black/5 pt-1">
          {activeFields.map((f, i) => (
            <div key={i} className="flex gap-1 text-[9.5px] leading-snug">
              <span className="text-slate-400 shrink-0">{f.label}:</span>
              <span className="text-slate-700 font-semibold truncate">{f.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Accounting Records ───────────────────────────────────────────────────────

function AccountingRecord({ r }: { r: any }) {
  if (r._kind === 'bank') return (
    <Card kind="bank" title={r.name} subtitle={r.accountName} status={r.status}
      fields={[
        { label: 'Account No', value: r.accountNumber },
        { label: 'Sort Code',  value: r.sortCode },
        { label: 'Type',       value: r.accountType },
      ]} />
  );
  if (r._kind === 'loan') return (
    <Card kind="loan" title={r.name} subtitle={r.lender} status={r.status}
      fields={[
        { label: 'Total',       value: r.totalAmount },
        { label: 'Outstanding', value: r.outstanding },
        { label: 'Monthly',     value: r.monthly },
        { label: 'Rate',        value: r.rate },
      ]} />
  );
  if (r._kind === 'insurance') return (
    <Card kind="insurance" title={r.name} subtitle={r.provider} status={r.status}
      fields={[
        { label: 'Policy No', value: r.policyNumber },
        { label: 'Premium',   value: r.premium },
        { label: 'Expiry',    value: r.expiry },
      ]} />
  );
  if (r._kind === 'vat') return (
    <Card kind="vat" title={r.name} subtitle={r.period} status={r.status}
      fields={[
        { label: 'Amount', value: r.amount },
        { label: 'Date',   value: r.date },
      ]} />
  );
  if (r._kind === 'dojo') return (
    <Card kind="dojo" title={`Dojo · ${r.date}`} subtitle={r.method} status={r.status}
      fields={[
        { label: 'Amount', value: r.amount },
        { label: 'Fee',    value: r.fee },
        { label: 'Net',    value: r.net },
      ]} />
  );
  if (r._kind === 'invoice') return (
    <Card kind="invoice" title={r.name} subtitle={r.title} status={r.status}
      fields={[
        { label: 'Amount',   value: r.amount },
        { label: 'Due Date', value: r.dueDate },
      ]} />
  );
  return (
    <Card kind="transaction" title={r.name} subtitle={r.category} status={r.status}
      fields={[
        { label: 'Type',   value: r.type },
        { label: 'Amount', value: r.amount },
        { label: 'Date',   value: r.dueDate },
        { label: 'Notes',  value: r.notes },
      ]} />
  );
}

// ─── Fleet Records ────────────────────────────────────────────────────────────

function FleetRecord({ r }: { r: any }) {
  if (r._kind === 'parcel') return (
    <Card kind="parcel" title={r.provider} subtitle={r.area} status={r.status}
      fields={[
        { label: 'Vehicle',  value: r.vehicle },
        { label: 'Contact',  value: r.contact },
        { label: 'Phone',    value: r.phone },
        { label: 'Service',  value: r.serviceDate },
      ]} />
  );
  return (
    <Card kind="vehicle" title={r.vehicleName} subtitle={r.vehicleNumber} status={r.status}
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

function InventoryRecord({ r }: { r: any }) {
  if (r._kind === 'movement') return (
    <Card kind="movement" title={r.item} subtitle={r.date} status={r.type}
      fields={[
        { label: 'Qty',   value: r.quantity },
        { label: 'Notes', value: r.notes },
      ]} />
  );
  return (
    <Card kind="product" title={r.item} subtitle={r.category} status={r.status}
      fields={[
        { label: 'SKU',   value: r.sku },
        { label: 'Stock', value: r.stockLevel },
        { label: 'Price', value: r.price },
      ]} />
  );
}

// ─── Supplier Records ─────────────────────────────────────────────────────────

function SupplierRecord({ r }: { r: any }) {
  if (r._kind === 'po') return (
    <Card kind="po" title={r.number} subtitle={r.supplierName} status={r.status}
      fields={[
        { label: 'Product', value: r.product },
        { label: 'Qty',     value: r.quantity },
        { label: 'Amount',  value: r.amount },
        { label: 'Date',    value: r.date },
      ]} />
  );
  return (
    <Card kind="supplier" title={r.supplierName} subtitle={r.category} status={r.status}
      fields={[
        { label: 'Contact', value: r.contact },
        { label: 'Phone',   value: r.phone },
        { label: 'Email',   value: r.email },
      ]} />
  );
}

// ─── Legal Records ────────────────────────────────────────────────────────────

function LegalRecord({ r, onView }: { r: any; onView: (doc: any) => void }) {
  if (r._kind === 'registration') return (
    <Card kind="registration" title={r.title} subtitle={`CRN: ${r.crn}`} status={r.status}
      onView={() => onView({ title: r.title, type: 'Companies House Registration', status: r.status, date: r.filingDue })}
      fields={[
        { label: 'Manager',     value: r.manager },
        { label: 'SIC Code',    value: r.sicCode },
        { label: 'Filing Due',  value: r.filingDue },
        { label: 'Address',     value: r.address },
      ]} />
  );
  return (
    <Card kind="document" title={r.title} subtitle={r.type} status={r.status}
      onView={() => onView(r)}
      fields={[
        { label: 'Business', value: r.business },
        { label: 'Expiry',   value: r.expiryDate },
      ]} />
  );
}

// ─── Property Records ─────────────────────────────────────────────────────────

function PropertyRecord({ r }: { r: any }) {
  if (r._kind === 'asset') return (
    <Card kind="asset" title={r.name} subtitle={r.assetType} status={r.status}
      fields={[
        { label: 'Location',    value: r.location },
        { label: 'Assigned To', value: r.assignedPerson },
        { label: 'Contact',     value: r.contact },
      ]} />
  );
  if (r._kind === 'waste') return (
    <Card kind="waste" title="Waste Collection" subtitle={r.date} status={r.status}
      fields={[
        { label: 'Contact', value: r.contactPerson },
        { label: 'Phone',   value: r.phone },
        { label: 'Address', value: r.address },
        { label: 'Notes',   value: r.notes },
      ]} />
  );
  if (r._kind === 'licence') return (
    <Card kind="licence" title={r.type} subtitle={r.authority} status={r.status}
      fields={[
        { label: 'Business', value: r.business },
        { label: 'Issued',   value: r.issueDate },
        { label: 'Expiry',   value: r.expiryDate },
      ]} />
  );
  if (r._kind === 'reminder') return (
    <Card kind="reminder" title={r.title} subtitle={r.priority} status={r.status}
      fields={[
        { label: 'Due',         value: r.dueDate },
        { label: 'Description', value: r.description },
      ]} />
  );
  return (
    <Card kind="maintenance" title={r.asset || 'Maintenance'} subtitle={r.priority} status={r.status}
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
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleViewDoc = (doc: any) => {
    setSelectedDoc({
      title: doc.title,
      type: doc.type,
      status: doc.status,
      date: doc.expiryDate,
    });
    setDrawerOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_ENDPOINTS.BUSINESS}${slug}/`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error(err));
  }, [slug]);

  if (!data) return null;

  const business = data.business ?? {};
  const logo = business.logo_url;

  const infoParts = [
    { label: 'Category', value: business.category, icon: Building2 },
    { label: 'Co. No', value: business.company_number, icon: Shield },
    { label: 'VAT', value: business.tax_id, icon: CreditCard },
    { label: 'HQ', value: business.hq_location, icon: MapPin },
    { label: 'Currency', value: business.currency, icon: CreditCard },
    { label: 'Timezone', value: business.timezone, icon: Clock },
    { label: 'Fiscal Year', value: business.fiscal_year, icon: CalendarDays },
  ].filter(p => p.value);

  const contactParts = [
    { label: 'Website', value: business.website, icon: Globe, isLink: true },
    { label: 'Phone', value: business.phone, icon: Phone },
    { label: 'Email', value: business.email, icon: Mail },
  ].filter(p => p.value);

  return (
    <PageWrapper title="Business Profile">
      <div className="flex flex-col h-full overflow-hidden bg-[#f1f5f9]">

        <div className="bg-white border-b border-slate-200 px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
              {logo ? (
                <img src={logo} alt={business.name} className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 size={32} className="text-slate-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-800 leading-tight">{business.name || slug}</h2>
                <StatusBadge status={business.status || 'Active'} />
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                {infoParts.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                    <p.icon size={12} className="text-slate-400" />
                    <span>{p.value}</span>
                  </div>
                ))}
              </div>

              {contactParts.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 pt-2 border-t border-slate-100">
                  {contactParts.map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-teal-600">
                      <p.icon size={12} className="text-teal-500" />
                      {p.isLink ? (
                        <a href={p.value.startsWith('http') ? p.value : `https://${p.value}`} target="_blank" rel="noreferrer" className="hover:underline">
                          {p.value.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <span>{p.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/business')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all border border-slate-200"
            >
              <Building2 size={14} /> All Businesses
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] hover:bg-[#34495e] text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              <ArrowLeft size={14} /> Dashboard
            </button>
          </div>
        </div>

        {/* ── Sections Grid ── */}
        <div className="flex-1 p-5 grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-y-auto custom-scrollbar">

          <SectionCard icon={Calculator} iconBg="bg-slate-700" title="Accounting" count={data.accounting?.length || 0}>
            {data.accounting?.map((r: any, i: number) => <AccountingRecord key={i} r={r} />)}
          </SectionCard>

          <SectionCard icon={Truck} iconBg="bg-orange-500" title="Logistics / Fleet" count={data.fleet?.length || 0}>
            {data.fleet?.map((r: any, i: number) => <FleetRecord key={i} r={r} />)}
          </SectionCard>

          <SectionCard icon={Boxes} iconBg="bg-yellow-500" title="Inventory" count={data.inventory?.length || 0}>
            {data.inventory?.map((r: any, i: number) => <InventoryRecord key={i} r={r} />)}
          </SectionCard>

          <SectionCard icon={Package} iconBg="bg-amber-600" title="Supplier Management" count={data.supplier?.length || 0}>
            {data.supplier?.map((r: any, i: number) => <SupplierRecord key={i} r={r} />)}
          </SectionCard>

          <SectionCard icon={Scale} iconBg="bg-slate-600" title="Legal & Compliance" count={data.legal?.length || 0}>
            {data.legal?.map((r: any, i: number) => <LegalRecord key={i} r={r} onView={handleViewDoc} />)}
          </SectionCard>

          <SectionCard icon={Home} iconBg="bg-slate-500" title="Property Management" count={data.property?.length || 0}>
            {data.property?.map((r: any, i: number) => <PropertyRecord key={i} r={r} />)}
          </SectionCard>

        </div>
      </div>

      <DocumentDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        documentData={selectedDoc}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </PageWrapper>
  );
}
