'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/layouts/PageWrapper';
import { API_ENDPOINTS } from '@/lib/api';
import {
  ArrowLeft, Building2, Truck, Package, Calculator,
  Boxes, Scale, Home, Landmark, ShieldCheck, BadgeDollarSign,
  FileText, Wrench, Recycle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: 'bg-emerald-100 text-emerald-700',
    Active: 'bg-emerald-100 text-emerald-700',
    Settled: 'bg-emerald-100 text-emerald-700',
    Valid: 'bg-emerald-100 text-emerald-700',
    'In Stock': 'bg-emerald-100 text-emerald-700',
    Operational: 'bg-emerald-100 text-emerald-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Scheduled: 'bg-blue-100 text-blue-700',
    Pending: 'bg-amber-100 text-amber-700',
    'Low Stock': 'bg-amber-100 text-amber-700',
    'Needs Attention': 'bg-amber-100 text-amber-700',
    Expired: 'bg-red-100 text-red-700',
    Overdue: 'bg-red-100 text-red-700',
    'Out of Stock': 'bg-red-100 text-red-700',
    Sent: 'bg-purple-100 text-purple-700',
    IN: 'bg-emerald-100 text-emerald-700',
    OUT: 'bg-red-100 text-red-700',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', map[status] ?? 'bg-slate-100 text-slate-600')}>
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', iconBg)}>
            <Icon size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-slate-800">{title}</span>
        </div>
        <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-[10px] font-black flex items-center justify-center">
          {count}
        </span>
      </div>
      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[340px] custom-scrollbar">
        {children}
      </div>
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────

function F({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-1 text-[11px] leading-snug">
      <span className="font-bold text-slate-700 shrink-0">{label}:</span>
      <span className="text-slate-600">{value}</span>
    </div>
  );
}

function Badge({ label, status }: { label: string; status: string }) {
  if (!status) return null;
  return (
    <div className="flex gap-1 text-[11px] leading-snug items-center">
      <span className="font-bold text-slate-700 shrink-0">{label}:</span>
      <StatusBadge status={status} />
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 grid grid-cols-2 gap-x-6 gap-y-1 hover:bg-slate-50 transition-colors">
      {children}
    </div>
  );
}

// ─── Kind label pill ──────────────────────────────────────────────────────────

function KindPill({ label, color }: { label: string; color: string }) {
  return (
    <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider', color)}>
      {label}
    </span>
  );
}

// ─── Accounting Records ───────────────────────────────────────────────────────

function AccountingRecord({ r }: { r: any }) {
  if (r._kind === 'bank') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Bank Account" color="bg-blue-100 text-blue-700" />
        <F label="Bank" value={r.name} />
        <F label="Account Name" value={r.accountName} />
        <F label="Account No." value={r.accountNumber} />
      </div>
      <div className="space-y-1">
        <F label="Sort Code" value={r.sortCode} />
        <F label="Type" value={r.accountType} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );

  if (r._kind === 'loan') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Loan" color="bg-orange-100 text-orange-700" />
        <F label="Name" value={r.name} />
        <F label="Lender" value={r.lender} />
        <F label="Total" value={r.totalAmount} />
        <F label="Outstanding" value={r.outstanding} />
      </div>
      <div className="space-y-1">
        <F label="Monthly" value={r.monthly} />
        <F label="Interest" value={r.rate} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );

  if (r._kind === 'insurance') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Insurance" color="bg-teal-100 text-teal-700" />
        <F label="Type" value={r.name} />
        <F label="Provider" value={r.provider} />
        <F label="Policy No." value={r.policyNumber} />
      </div>
      <div className="space-y-1">
        <F label="Premium" value={r.premium} />
        <F label="Expiry" value={r.expiry} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );

  if (r._kind === 'vat') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="VAT" color="bg-yellow-100 text-yellow-700" />
        <F label="Type" value={r.name} />
        <F label="Period" value={r.period} />
      </div>
      <div className="space-y-1">
        <F label="Amount" value={r.amount} />
        <F label="Date" value={r.date} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );

  if (r._kind === 'dojo') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Dojo Settlement" color="bg-purple-100 text-purple-700" />
        <F label="Date" value={r.date} />
        <F label="Method" value={r.method} />
        <F label="Amount" value={r.amount} />
      </div>
      <div className="space-y-1">
        <F label="Fee" value={r.fee} />
        <F label="Net" value={r.net} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );

  // invoice or transaction
  return (
    <Row>
      <div className="space-y-1">
        <KindPill label={r._kind === 'invoice' ? 'Invoice' : 'Transaction'} color={r._kind === 'invoice' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} />
        <F label="Name" value={r.name} />
        <F label="Category" value={r.category} />
        <F label="Amount" value={r.amount} />
        <F label="Notes" value={r.notes} />
      </div>
      <div className="space-y-1">
        <F label="Title" value={r.title} />
        <F label="Type" value={r.type} />
        <Badge label="Status" status={r.status} />
        <F label="Due Date" value={r.dueDate} />
      </div>
    </Row>
  );
}

// ─── Fleet Records ────────────────────────────────────────────────────────────

function FleetRecord({ r }: { r: any }) {
  if (r._kind === 'parcel') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Parcel Partner" color="bg-orange-100 text-orange-700" />
        <F label="Provider" value={r.provider} />
        <F label="Vehicle" value={r.vehicle} />
        <F label="Area" value={r.area} />
      </div>
      <div className="space-y-1">
        <F label="Contact" value={r.contact} />
        <F label="Phone" value={r.phone} />
        <F label="Service Date" value={r.serviceDate} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );

  return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Vehicle" color="bg-blue-100 text-blue-700" />
        <F label="Vehicle" value={r.vehicle} />
        <F label="Registration" value={r.registration} />
        <F label="Insurance" value={r.insurance} />
        <F label="MOT" value={r.mot} />
        <F label="Road Tax" value={r.roadTax} />
        <F label="Delivery Date" value={r.deliveryDate} />
        <F label="Notes" value={r.notes} />
      </div>
      <div className="space-y-1">
        <F label="Vehicle Name" value={r.vehicleName} />
        <F label="Plate" value={r.vehicleNumber} />
        <F label="Insurance Expiry" value={r.insuranceExpiry} />
        <F label="MOT Date" value={r.motDate} />
        <F label="Road Tax Date" value={r.roadTaxDate} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );
}

// ─── Inventory Records ────────────────────────────────────────────────────────

function InventoryRecord({ r }: { r: any }) {
  if (r._kind === 'movement') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Stock Movement" color="bg-amber-100 text-amber-700" />
        <F label="Item" value={r.item} />
        <F label="Date" value={r.date} />
        <F label="Notes" value={r.notes} />
      </div>
      <div className="space-y-1">
        <Badge label="Type" status={r.type} />
        <F label="Quantity" value={r.quantity} />
      </div>
    </Row>
  );

  return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Product" color="bg-yellow-100 text-yellow-700" />
        <F label="Item" value={r.item} />
        <F label="SKU" value={r.sku} />
        <F label="Stock" value={r.stock} />
        <F label="Price" value={r.price} />
      </div>
      <div className="space-y-1">
        <F label="Category" value={r.category} />
        <F label="Stock Level" value={r.stockLevel} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );
}

// ─── Supplier Records ─────────────────────────────────────────────────────────

function SupplierRecord({ r }: { r: any }) {
  if (r._kind === 'po') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Purchase Order" color="bg-amber-100 text-amber-700" />
        <F label="PO Number" value={r.number} />
        <F label="Supplier" value={r.supplierName} />
        <F label="Product" value={r.product} />
      </div>
      <div className="space-y-1">
        <F label="Quantity" value={r.quantity} />
        <F label="Amount" value={r.amount} />
        <F label="Date" value={r.date} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );

  return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Supplier" color="bg-orange-100 text-orange-700" />
        <F label="Supplier Name" value={r.supplierName} />
        <F label="Contact" value={r.contact} />
        <F label="Phone" value={r.phone} />
        <F label="Category" value={r.category} />
      </div>
      <div className="space-y-1">
        <F label="Supplier ID" value={r.supplierId} />
        <F label="Email" value={r.email} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );
}

// ─── Legal Records ────────────────────────────────────────────────────────────

function LegalRecord({ r }: { r: any }) {
  return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Document" color="bg-slate-100 text-slate-600" />
        <F label="Title" value={r.title} />
        <F label="Type" value={r.type} />
        <F label="Business" value={r.business} />
      </div>
      <div className="space-y-1">
        <F label="Document Type" value={r.documentType} />
        <F label="Expiry Date" value={r.expiryDate} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );
}

// ─── Property Records ─────────────────────────────────────────────────────────

function PropertyRecord({ r }: { r: any }) {
  if (r._kind === 'asset') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Asset" color="bg-blue-100 text-blue-700" />
        <F label="Name" value={r.name} />
        <F label="Type" value={r.assetType} />
        <F label="Location" value={r.location} />
      </div>
      <div className="space-y-1">
        <F label="Assigned To" value={r.assignedPerson} />
        <F label="Contact" value={r.contact} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );

  if (r._kind === 'waste') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Waste Collection" color="bg-green-100 text-green-700" />
        <F label="Date" value={r.date} />
        <F label="Contact" value={r.contactPerson} />
        <F label="Phone" value={r.phone} />
      </div>
      <div className="space-y-1">
        <F label="Address" value={r.address} />
        <Badge label="Status" status={r.status} />
        <F label="Notes" value={r.notes} />
      </div>
    </Row>
  );

  if (r._kind === 'licence') return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Licence" color="bg-purple-100 text-purple-700" />
        <F label="Type" value={r.type} />
        <F label="Business" value={r.business} />
        <F label="Authority" value={r.authority} />
      </div>
      <div className="space-y-1">
        <F label="Issue Date" value={r.issueDate} />
        <F label="Expiry Date" value={r.expiryDate} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );

  // maintenance
  return (
    <Row>
      <div className="space-y-1">
        <KindPill label="Maintenance" color="bg-red-100 text-red-700" />
        <F label="Issue" value={r.issue} />
        <F label="Asset" value={r.asset} />
        <F label="Location" value={r.location} />
        <F label="Date" value={r.date} />
      </div>
      <div className="space-y-1">
        <F label="Technician" value={r.technician} />
        <F label="Priority" value={r.priority} />
        <Badge label="Status" status={r.status} />
      </div>
    </Row>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BusinessDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const slug = id as string;
  const [data, setData] = useState<any>(null);

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

  const business = data.business ?? {
    name: slug?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    category: 'General', hqLocation: '', companyNumber: '', taxId: '',
  };

  return (
    <PageWrapper title="Business Profile">
      <div className="flex flex-col h-full overflow-hidden bg-[#f1f5f9]">
        {/* ── Banner ── */}
        <div className="bg-teal-600 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">{business.name}</h2>
              <div className="flex items-center gap-3 mt-0.5 text-teal-100 text-xs font-medium flex-wrap">
                {business.category && <span>{business.category}</span>}
                {business.companyNumber && <><span>•</span><span>Co. {business.companyNumber}</span></>}
                {business.hqLocation && <><span>•</span><span>{business.hqLocation}</span></>}
                {business.taxId && <><span>•</span><span>VAT: {business.taxId}</span></>}
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-colors border border-white/30"
          >
            <ArrowLeft size={12} /> Back to Dashboard
          </button>
        </div>

        {/* ── Grid ── */}
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
            {data.legal?.map((r: any, i: number) => <LegalRecord key={i} r={r} />)}
          </SectionCard>

          <SectionCard icon={Home} iconBg="bg-slate-500" title="Property Management" count={data.property?.length || 0}>
            {data.property?.map((r: any, i: number) => <PropertyRecord key={i} r={r} />)}
          </SectionCard>

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </PageWrapper>
  );
}
