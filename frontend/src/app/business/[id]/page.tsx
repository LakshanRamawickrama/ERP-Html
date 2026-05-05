'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { useRouter, useParams } from 'next/navigation';
import { UserRole } from '@/constants/roles';
import {
  ArrowLeft,
  Building2,
  Truck,
  Package,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Calculator,
  Boxes,
  Scale,
  Home,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const BUSINESSES: Record<string, any> = {
  'green-valley-retail': {
    name: 'Green Valley Retail Store',
    category: 'Retail',
    email: 'contact@greenvalley.com',
    phone: '+44 20 1234 5678',
  },
  'alpha-trading': {
    name: 'Alpha Trading Co.',
    category: 'Retail',
    email: 'contact@alphatrading.com',
    phone: '+44 20 7946 0123',
  },
  'beta-logistics': {
    name: 'Beta Logistics Ltd.',
    category: 'Logistics',
    email: 'info@betalogistics.co.uk',
    phone: '+44 161 496 0345',
  },
};

const ACCOUNTING_RECORDS = [
  {
    name: 'VAT Return Q1 2026',
    category: 'Tax',
    amount: '£5429',
    paymentMethod: 'Bank Transfer',
    reminderDate: '2026-04-10',
    notes: 'Q1 2026 VAT payment processed',
    title: 'Quarterly VAT Payment',
    type: 'VAT',
    status: 'Paid',
    dueDate: '2026-04-15',
    uploadDate: '2026-04-12',
  },
  {
    name: 'Accountant Fee March',
    category: 'Fees',
    amount: '£850',
    paymentMethod: 'Direct Debit',
    reminderDate: '2026-05-01',
    notes: 'Monthly accounting services',
    title: 'Monthly Accounting Services',
    type: 'Professional Services',
    status: 'Pending',
    dueDate: '2026-05-05',
    uploadDate: '2026-04-28',
  },
  {
    name: 'Business Loan Payment',
    category: 'Loan',
    amount: '£1,200',
    paymentMethod: 'Standing Order',
    reminderDate: '2026-05-01',
    notes: 'Monthly loan instalment',
    title: 'Monthly Loan Instalment',
    type: 'Finance',
    status: 'Pending',
    dueDate: '2026-05-01',
    uploadDate: '2026-04-30',
  },
];

const FLEET_RECORDS = [
  {
    vehicle: 'Mercedes Sprinter Van',
    registration: 'AB12 CDE',
    insurance: '2026-05-15',
    mot: '2026-05-20',
    roadTax: '2026-07-01',
    deliveryDate: '2024-01-15',
    vehicleName: 'Delivery Van 1',
    vehicleNumber: 'AB12 CDE',
    insuranceExpiry: '2026-05-15',
    motDate: '2026-05-20',
    roadTaxDate: '2026-07-01',
    status: 'Active',
    notes: 'Company delivery van – main vehicle',
  },
  {
    vehicle: 'Ford Transit',
    registration: 'XY34 FGH',
    insurance: '2026-05-10',
    mot: '2026-05-25',
    roadTax: '2026-06-15',
    deliveryDate: '2023-08-20',
    vehicleName: 'Delivery Van 2',
    vehicleNumber: 'XY34 FGH',
    insuranceExpiry: '2026-05-10',
    motDate: '2026-05-25',
    roadTaxDate: '2026-06-15',
    status: 'Active',
    notes: 'Secondary delivery vehicle',
  },
  {
    vehicle: 'Vauxhall Vivaro',
    registration: 'LM56 NOP',
    insurance: '2026-08-01',
    mot: '2026-09-10',
    roadTax: '2026-10-01',
    deliveryDate: '2022-11-05',
    vehicleName: 'Delivery Van 3',
    vehicleNumber: 'LM56 NOP',
    insuranceExpiry: '2026-08-01',
    motDate: '2026-09-10',
    roadTaxDate: '2026-10-01',
    status: 'Active',
    notes: 'Backup delivery vehicle',
  },
];

const INVENTORY_RECORDS = [
  {
    item: 'Premium Tobacco A',
    products: 'Tobacco Products',
    stock: 150,
    supplier: 'SUP-001',
    status: 'In Stock',
    notes: 'Popular brand – high demand',
    itemName: 'Premium Tobacco Brand A',
    category: 'Tobacco',
    stockLevel: 150,
    supplierName: 'Alpha Distributors',
  },
  {
    item: 'Vape Cartridge B',
    products: 'Vaping Products',
    stock: 25,
    supplier: 'SUP-002',
    status: 'Low Stock',
    notes: 'Reorder soon – below minimum',
    itemName: 'Vape Cartridge Type B',
    category: 'Vaping',
    stockLevel: 25,
    supplierName: 'Beta Wholesale',
  },
  {
    item: 'Lighter Pack',
    products: 'Accessories',
    stock: 80,
    supplier: 'SUP-003',
    status: 'In Stock',
    notes: 'Standard disposable lighters',
    itemName: 'Disposable Lighter Pack',
    category: 'Accessories',
    stockLevel: 80,
    supplierName: 'City Supplies',
  },
];

const SUPPLIER_RECORDS = [
  {
    supplierName: 'Alpha Distributors Ltd',
    supplierId: 'SUP-001',
    contact: 'John Smith',
    contactDetails: 'John Smith – Sales Manager',
    phone: '020 7234 5678',
    email: 'john@alpha.com',
    address: '123 Business Park, London, SW1A 1AA',
    paymentStatus: 'Current',
    paymentTerms: 'Net 30',
    dueDate: '2026-05-15',
    uploadDocs: 'Contract-Alpha.pdf',
    notes: 'Primary tobacco supplier – excellent service',
  },
  {
    supplierName: 'Beta Wholesale Co',
    supplierId: 'SUP-002',
    contact: 'Sarah Jones',
    contactDetails: 'Sarah Jones – Account Manager',
    phone: '020 8765 4321',
    email: 'sarah@beta.com',
    address: '456 Trade Centre, Manchester, M1 2AB',
    paymentStatus: 'Pending',
    paymentTerms: 'Net 15',
    dueDate: '2026-05-10',
    uploadDocs: 'Agreement-Beta.pdf',
    notes: 'Vaping products specialist',
  },
  {
    supplierName: 'City Supplies Limited',
    supplierId: 'SUP-003',
    contact: 'Mike Brown',
    contactDetails: 'Mike Brown – Director',
    phone: '020 9876 5432',
    email: 'mike@citysupplies.com',
    address: '789 Commerce Road, Birmingham, B1 3CD',
    paymentStatus: 'Current',
    paymentTerms: 'Net 30',
    dueDate: '2026-06-01',
    uploadDocs: 'Contract-City.pdf',
    notes: 'Accessories and general supplies',
  },
];

const LEGAL_RECORDS = [
  {
    type: 'Licence',
    business: 'Main Store',
    issueDate: '2025-01-15',
    uploadFile: 'Licence-Main-Store.pdf',
    notes: 'Premises licence for alcohol sales – valid until 2027',
    documentType: 'Premises Licence',
    businessName: 'Main Store – High Street',
    expiryDate: '2027-01-15',
    status: 'Valid',
  },
  {
    type: 'Food Safety Cert',
    business: 'Main Store',
    issueDate: '2025-06-01',
    uploadFile: 'Food-Safety-Cert.pdf',
    notes: 'Level 2 Food Hygiene – renewal required soon',
    documentType: 'Food Safety Certificate',
    businessName: 'Main Store – High Street',
    expiryDate: '2026-06-01',
    status: 'Expiring',
  },
  {
    type: 'Change of DPS',
    business: 'Branch 2',
    issueDate: '2024-12-01',
    uploadFile: 'DPS-Change-2024.pdf',
    notes: '',
    documentType: 'DPS Change Application',
    businessName: 'Branch 2 – Market Road',
    expiryDate: '2026-03-01',
    status: 'Expired',
  },
];

const PROPERTY_RECORDS = [
  {
    type: 'Utility',
    property: 'Main Store',
    address: '10 High Street, London, SW1A 1AA',
    infoName: 'Gas Bill March 2026',
    priority: 'Medium',
    status: 'Open',
    notes: 'Monthly gas bill payment due',
    requestType: 'Utility Bill',
    propertyName: 'Main Store – High Street',
    description: 'Gas Bill – March 2026',
    assignedTo: 'Finance Team',
  },
  {
    type: 'Maintenance',
    property: 'Branch 2',
    address: '25 Market Road, Manchester, M1 2AB',
    infoName: 'HVAC System Repair',
    priority: 'High',
    status: 'In Progress',
    notes: 'Air conditioning not working – technician scheduled',
    requestType: 'Maintenance Request',
    propertyName: 'Branch 2 – Market Road',
    description: 'HVAC Repair – Air Conditioning',
    assignedTo: 'Maintenance Team',
  },
  {
    type: 'Lease',
    property: 'Warehouse',
    address: '5 Industrial Estate, Leeds, LS1 4EF',
    infoName: 'Annual Lease Renewal',
    priority: 'Low',
    status: 'Pending',
    notes: 'Lease renewal due in 3 months',
    requestType: 'Lease Renewal',
    propertyName: 'Warehouse – Leeds',
    description: 'Annual Lease Renewal 2026',
    assignedTo: 'Legal Team',
  },
];

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

function AccountingRecord({ r }: { r: (typeof ACCOUNTING_RECORDS)[0] }) {
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

function FleetRecord({ r }: { r: (typeof FLEET_RECORDS)[0] }) {
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

function InventoryRecord({ r }: { r: (typeof INVENTORY_RECORDS)[0] }) {
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

function SupplierRecord({ r }: { r: (typeof SUPPLIER_RECORDS)[0] }) {
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

function LegalRecord({ r }: { r: (typeof LEGAL_RECORDS)[0] }) {
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

function PropertyRecord({ r }: { r: (typeof PROPERTY_RECORDS)[0] }) {
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
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();

  const slug = id as string;
  const business = BUSINESSES[slug] ?? {
    name: slug?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    category: 'General',
    email: 'N/A',
    phone: 'N/A',
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { router.push('/login'); return; }
    const user = JSON.parse(savedUser);
    setUserRole(user.role as UserRole);
  }, [router]);

  if (!userRole) return null;

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <Sidebar userRole={userRole} />

      <main className="ml-[70px] flex-1 flex flex-col min-h-screen">

        {/* ── Top Nav ── */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <h1 className="text-base font-bold text-slate-800">Business Profile</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User size={14} className="text-slate-400" />
              <span className="font-medium">superadmin</span>
              <span className="text-slate-400">(Super Admin)</span>
            </div>
            <button
              onClick={() => { localStorage.removeItem('user'); router.push('/login'); }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </header>

        {/* ── Business Banner ── */}
        <div className="bg-teal-600 text-white px-6 py-4 flex items-center justify-between">
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
            <ArrowLeft size={12} /> Back to All Businesses
          </button>
        </div>

        {/* ── 6-Section Grid ── */}
        <div className="flex-1 p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* 1. Accounting */}
          <SectionCard icon={Calculator} iconBg="bg-slate-700" title="Accounting" count={ACCOUNTING_RECORDS.length}>
            {ACCOUNTING_RECORDS.map((r, i) => (
              <AccountingRecord key={i} r={r} />
            ))}
          </SectionCard>

          {/* 2. Logistics / Fleet */}
          <SectionCard icon={Truck} iconBg="bg-orange-500" title="Logistics / Fleet" count={FLEET_RECORDS.length}>
            {FLEET_RECORDS.map((r, i) => (
              <FleetRecord key={i} r={r} />
            ))}
          </SectionCard>

          {/* 3. Inventory */}
          <SectionCard icon={Boxes} iconBg="bg-yellow-500" title="Inventory" count={INVENTORY_RECORDS.length}>
            {INVENTORY_RECORDS.map((r, i) => (
              <InventoryRecord key={i} r={r} />
            ))}
          </SectionCard>

          {/* 4. Supplier Management */}
          <SectionCard icon={Package} iconBg="bg-amber-600" title="Supplier Management" count={SUPPLIER_RECORDS.length}>
            {SUPPLIER_RECORDS.map((r, i) => (
              <SupplierRecord key={i} r={r} />
            ))}
          </SectionCard>

          {/* 5. Legal & Compliance */}
          <SectionCard icon={Scale} iconBg="bg-slate-600" title="Legal & Compliance" count={LEGAL_RECORDS.length}>
            {LEGAL_RECORDS.map((r, i) => (
              <LegalRecord key={i} r={r} />
            ))}
          </SectionCard>

          {/* 6. Property Management */}
          <SectionCard icon={Home} iconBg="bg-slate-500" title="Property Management" count={PROPERTY_RECORDS.length}>
            {PROPERTY_RECORDS.map((r, i) => (
              <PropertyRecord key={i} r={r} />
            ))}
          </SectionCard>

        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
