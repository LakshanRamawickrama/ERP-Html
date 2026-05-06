'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageWrapper from '@/components/layouts/PageWrapper';
import {
  ArrowLeft,
  Building2,
  Truck,
  Package,
  Calculator,
  Boxes,
  Scale,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Data is now fetched via API from /api/business/[id]

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: 'bg-emerald-100 text-emerald-700',
    Active: 'bg-emerald-100 text-emerald-700',
    Valid: 'bg-emerald-100 text-emerald-700',
    Current: 'bg-emerald-100 text-emerald-700',
    'In Stock': 'bg-emerald-100 text-emerald-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Open: 'bg-blue-100 text-blue-700',
    Pending: 'bg-amber-100 text-amber-700',
    'Low Stock': 'bg-amber-100 text-amber-700',
    Expiring: 'bg-amber-100 text-amber-700',
    Expired: 'bg-red-100 text-red-700',
    Overdue: 'bg-red-100 text-red-700',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', map[status] ?? 'bg-slate-100 text-slate-600')}>
      {status}
    </span>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon,
  iconBg,
  title,
  count,
  children,
}: {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
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
      {/* Records */}
      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[340px] custom-scrollbar">
        {children}
      </div>
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-1 text-[11px] leading-snug">
      <span className="font-bold text-slate-700 shrink-0">{label}:</span>
      <span className="text-slate-600">{value}</span>
    </div>
  );
}

// ─── Record Panels ────────────────────────────────────────────────────────────

function AccountingRecord({ r }: { r: any }) {
  return (
    <div className="p-3 grid grid-cols-2 gap-x-6 gap-y-1 hover:bg-slate-50 transition-colors">
      <div className="space-y-1">
        <FieldRow label="Name" value={r.name} />
        <FieldRow label="Category" value={r.category} />
        <FieldRow label="Amount" value={r.amount} />
        <FieldRow label="Payment Method" value={r.paymentMethod} />
        <FieldRow label="Reminder Date" value={r.reminderDate} />
        <FieldRow label="Notes" value={r.notes} />
      </div>
      <div className="space-y-1">
        <FieldRow label="Title" value={r.title} />
        <FieldRow label="Type" value={r.type} />
        <div className="flex gap-1 text-[11px] leading-snug items-center">
          <span className="font-bold text-slate-700 shrink-0">Status:</span>
          <StatusBadge status={r.status} />
        </div>
        <FieldRow label="Due Date" value={r.dueDate} />
        <FieldRow label="Upload Date" value={r.uploadDate} />
      </div>
    </div>
  );
}

function FleetRecord({ r }: { r: any }) {
  return (
    <div className="p-3 grid grid-cols-2 gap-x-6 gap-y-1 hover:bg-slate-50 transition-colors">
      <div className="space-y-1">
        <FieldRow label="Vehicle" value={r.vehicle} />
        <FieldRow label="Registration" value={r.registration} />
        <FieldRow label="Insurance" value={r.insurance} />
        <FieldRow label="MOT" value={r.mot} />
        <FieldRow label="Road Tax Date" value={r.roadTax} />
        <FieldRow label="Delivery Date" value={r.deliveryDate} />
        <FieldRow label="Notes" value={r.notes} />
      </div>
      <div className="space-y-1">
        <FieldRow label="Vehicle Name" value={r.vehicleName} />
        <FieldRow label="Vehicle Number" value={r.vehicleNumber} />
        <FieldRow label="Insurance Expiry" value={r.insuranceExpiry} />
        <FieldRow label="MOT Date" value={r.motDate} />
        <FieldRow label="Road Tax Date" value={r.roadTaxDate} />
        <div className="flex gap-1 text-[11px] leading-snug items-center">
          <span className="font-bold text-slate-700 shrink-0">Status:</span>
          <StatusBadge status={r.status} />
        </div>
      </div>
    </div>
  );
}

function InventoryRecord({ r }: { r: any }) {
  return (
    <div className="p-3 grid grid-cols-2 gap-x-6 gap-y-1 hover:bg-slate-50 transition-colors">
      <div className="space-y-1">
        <FieldRow label="Item" value={r.item} />
        <FieldRow label="Products" value={r.products} />
        <FieldRow label="Stock" value={r.stock} />
        <FieldRow label="Supplier" value={r.supplier} />
        <div className="flex gap-1 text-[11px] leading-snug items-center">
          <span className="font-bold text-slate-700 shrink-0">Status:</span>
          <StatusBadge status={r.status} />
        </div>
        <FieldRow label="Notes" value={r.notes} />
      </div>
      <div className="space-y-1">
        <FieldRow label="Item Name" value={r.itemName} />
        <FieldRow label="Category" value={r.category} />
        <FieldRow label="Stock Level" value={r.stockLevel} />
        <FieldRow label="Supplier Name" value={r.supplierName} />
      </div>
    </div>
  );
}

function SupplierRecord({ r }: { r: any }) {
  return (
    <div className="p-3 grid grid-cols-2 gap-x-6 gap-y-1 hover:bg-slate-50 transition-colors">
      <div className="space-y-1">
        <FieldRow label="Supplier Name" value={r.supplierName} />
        <FieldRow label="Contact" value={r.contact} />
        <FieldRow label="Phone" value={r.phone} />
        <FieldRow label="Address" value={r.address} />
        <FieldRow label="Payment Status" value={r.paymentStatus} />
        <FieldRow label="Due Date" value={r.dueDate} />
        <FieldRow label="Notes" value={r.notes} />
      </div>
      <div className="space-y-1">
        <FieldRow label="Supplier ID" value={r.supplierId} />
        <FieldRow label="Contact Details" value={r.contactDetails} />
        <FieldRow label="Email" value={r.email} />
        <FieldRow label="Payment Terms" value={r.paymentTerms} />
        <FieldRow label="Upload Docs" value={r.uploadDocs} />
      </div>
    </div>
  );
}

function LegalRecord({ r }: { r: any }) {
  return (
    <div className="p-3 grid grid-cols-2 gap-x-6 gap-y-1 hover:bg-slate-50 transition-colors">
      <div className="space-y-1">
        <FieldRow label="Type" value={r.type} />
        <FieldRow label="Business" value={r.business} />
        <FieldRow label="Issue Date" value={r.issueDate} />
        <FieldRow label="Upload File" value={r.uploadFile} />
        {r.notes && <FieldRow label="Notes" value={r.notes} />}
      </div>
      <div className="space-y-1">
        <FieldRow label="Document Type" value={r.documentType} />
        <FieldRow label="Business Name" value={r.businessName} />
        <FieldRow label="Expiry Date" value={r.expiryDate} />
        <div className="flex gap-1 text-[11px] leading-snug items-center">
          <span className="font-bold text-slate-700 shrink-0">Status:</span>
          <StatusBadge status={r.status} />
        </div>
      </div>
    </div>
  );
}

function PropertyRecord({ r }: { r: any }) {
  return (
    <div className="p-3 grid grid-cols-2 gap-x-6 gap-y-1 hover:bg-slate-50 transition-colors">
      <div className="space-y-1">
        <FieldRow label="Type" value={r.type} />
        <FieldRow label="Property" value={r.property} />
        <FieldRow label="Address" value={r.address} />
        <FieldRow label="Info Name" value={r.infoName} />
        <FieldRow label="Priority" value={r.priority} />
        <div className="flex gap-1 text-[11px] leading-snug items-center">
          <span className="font-bold text-slate-700 shrink-0">Status:</span>
          <StatusBadge status={r.status} />
        </div>
        <FieldRow label="Notes" value={r.notes} />
      </div>
      <div className="space-y-1">
        <FieldRow label="Request Type" value={r.requestType} />
        <FieldRow label="Property Name" value={r.propertyName} />
        <FieldRow label="Description" value={r.description} />
        <FieldRow label="Assigned To" value={r.assignedTo} />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BusinessDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const slug = id as string;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/business/${slug}`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error(err));
  }, [slug]);

  if (!data) return null;

  const business = data.business ?? {
    name: slug?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    category: 'General',
    email: 'N/A',
    phone: 'N/A',
  };

  return (
    <PageWrapper title="Business Profile">
      <div className="flex flex-col h-full overflow-hidden bg-[#f1f5f9]">
        {/* ── Business Banner ── */}
        <div className="bg-teal-600 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">{business.name}</h2>
              <div className="flex items-center gap-3 mt-0.5 text-teal-100 text-xs font-medium">
                <span>{business.category}</span>
                <span>•</span>
                <span>{business.email}</span>
                <span>•</span>
                <span>{business.phone}</span>
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

        {/* ── 6-Section Grid ── */}
        <div className="flex-1 p-5 grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-y-auto custom-scrollbar">
          {/* 1. Accounting */}
          <SectionCard icon={Calculator} iconBg="bg-slate-700" title="Accounting" count={data.accounting?.length || 0}>
            {data.accounting?.map((r: any, i: number) => (
              <AccountingRecord key={i} r={r} />
            ))}
          </SectionCard>

          {/* 2. Logistics / Fleet */}
          <SectionCard icon={Truck} iconBg="bg-orange-500" title="Logistics / Fleet" count={data.fleet?.length || 0}>
            {data.fleet?.map((r: any, i: number) => (
              <FleetRecord key={i} r={r} />
            ))}
          </SectionCard>

          {/* 3. Inventory */}
          <SectionCard icon={Boxes} iconBg="bg-yellow-500" title="Inventory" count={data.inventory?.length || 0}>
            {data.inventory?.map((r: any, i: number) => (
              <InventoryRecord key={i} r={r} />
            ))}
          </SectionCard>

          {/* 4. Supplier Management */}
          <SectionCard icon={Package} iconBg="bg-amber-600" title="Supplier Management" count={data.supplier?.length || 0}>
            {data.supplier?.map((r: any, i: number) => (
              <SupplierRecord key={i} r={r} />
            ))}
          </SectionCard>

          {/* 5. Legal & Compliance */}
          <SectionCard icon={Scale} iconBg="bg-slate-600" title="Legal & Compliance" count={data.legal?.length || 0}>
            {data.legal?.map((r: any, i: number) => (
              <LegalRecord key={i} r={r} />
            ))}
          </SectionCard>

          {/* 6. Property Management */}
          <SectionCard icon={Home} iconBg="bg-slate-500" title="Property Management" count={data.property?.length || 0}>
            {data.property?.map((r: any, i: number) => (
              <PropertyRecord key={i} r={r} />
            ))}
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
