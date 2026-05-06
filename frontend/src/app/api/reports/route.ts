import { NextResponse } from 'next/server';
import { 
  REPORT_TEMPLATES, 
  DASHBOARD_BUSINESSES,
  BUSINESS_ENTITIES,
  BUSINESS_STRUCTURES,
  BUSINESSES,
  DASHBOARD_BANKS,
  ACCOUNTING_VAT
} from '@/lib/db';

export async function GET() {
  const totalRevenue = DASHBOARD_BUSINESSES.reduce((acc, biz) => acc + (parseFloat(biz.inc.replace(/[$,]/g, '')) || 0), 0);
  const totalExpenses = DASHBOARD_BUSINESSES.reduce((acc, biz) => acc + (parseFloat(biz.exp.replace(/[$,]/g, '')) || 0), 0);
  const totalSkus = DASHBOARD_BUSINESSES.reduce((acc, biz) => acc + (parseInt(biz.skus.replace(/,/g, '')) || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const dynamicStats = [
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, trend: '+12.5%', isUp: true },
    { title: 'Operating Costs', value: `$${totalExpenses.toLocaleString()}`, trend: '-3.2%', isUp: false },
    { title: 'Est. Net Profit', value: `$${netProfit.toLocaleString()}`, trend: '+5.4%', isUp: true },
    { title: 'Global Inventory', value: totalSkus.toLocaleString(), trend: '+40', isUp: true },
  ];

  return NextResponse.json({
    stats: dynamicStats,
    templates: REPORT_TEMPLATES,
    businesses: DASHBOARD_BUSINESSES,
    entities: BUSINESS_ENTITIES,
    structures: BUSINESS_STRUCTURES,
    contacts: BUSINESSES,
    banks: DASHBOARD_BANKS,
    tax: ACCOUNTING_VAT
  });
}
