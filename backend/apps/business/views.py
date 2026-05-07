from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BusinessEntity, CompanyStructure
from .serializers import BusinessEntitySerializer, CompanyStructureSerializer
from apps.users.models import StaffProfile

class BusinessDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Determine business scope
        profile = StaffProfile.objects.filter(email=request.user.email).first()
        business_scope = profile.assigned_business if profile else 'All'
        
        if business_scope == 'All' or request.user.is_superuser:
            entities = BusinessEntity.objects.all()
            structures = CompanyStructure.objects.all()
        else:
            entities = BusinessEntity.objects.filter(name=business_scope)
            structures = CompanyStructure.objects.filter(name=business_scope)
        
        return Response({
            "entities": BusinessEntitySerializer(entities, many=True).data,
            "structures": CompanyStructureSerializer(structures, many=True).data,
            "options": {
                "categories": ["Retail", "Logistics", "Finance", "Tech", "Healthcare"]
            }
        })
from apps.fleet.models import Vehicle, Delivery, ParcelPartner
from apps.accounting.models import Invoice, Transaction, BankAccount, Loan, InsurancePolicy, VATRecord, DojoSettlement
from apps.inventory.models import Product, StockMovement
from apps.suppliers.models import Supplier, PurchaseOrder
from apps.legal.models import LegalDocument
from apps.property.models import MaintenanceRequest, Asset, WasteCollection, PropertyLicence
from apps.reminders.models import Reminder

class BusinessDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        entity = None
        for b in BusinessEntity.objects.all():
            if b.name.lower().replace(' ', '-') == slug:
                entity = b
                break

        if not entity:
            return Response({"error": "Business not found"}, status=404)

        profile = StaffProfile.objects.filter(email=request.user.email).first()
        business_scope = profile.assigned_business if profile else 'All'

        if business_scope != 'All' and business_scope != entity.name and not request.user.is_superuser:
            return Response({"error": "Permission denied"}, status=403)

        business_name = entity.name

        def fmt(amount):
            return f"${amount:,.2f}" if amount is not None else "$0.00"

        # ── Fleet: vehicles filtered by business + parcel partners ──
        vehicles = Vehicle.objects.filter(business=business_name)
        fleet_records = []
        for v in vehicles:
            delivery = Delivery.objects.filter(vehicle=v).order_by('-delivery_date').first()
            fleet_records.append({
                "_kind": "vehicle",
                "vehicle": v.name,
                "vehicleName": v.name,
                "registration": v.plate_number,
                "vehicleNumber": v.plate_number,
                "insurance": str(v.insurance_date) if v.insurance_date else "",
                "insuranceExpiry": str(v.insurance_date) if v.insurance_date else "",
                "mot": str(v.mot_date) if v.mot_date else "",
                "motDate": str(v.mot_date) if v.mot_date else "",
                "roadTax": str(v.road_tax_date) if v.road_tax_date else "",
                "roadTaxDate": str(v.road_tax_date) if v.road_tax_date else "",
                "deliveryDate": str(delivery.delivery_date) if delivery else "",
                "notes": v.notes or (delivery.notes if delivery else ""),
                "status": v.status,
            })
        for pp in ParcelPartner.objects.filter(vehicle__business=business_name):
            fleet_records.append({
                "_kind": "parcel",
                "provider": pp.provider,
                "vehicle": pp.vehicle.name if pp.vehicle else "",
                "area": pp.area,
                "contact": pp.contact_name,
                "phone": pp.contact_number,
                "serviceDate": str(pp.service_date),
                "status": pp.status,
            })

        # ── Accounting: all financial models (no business field on any) ──
        accounting = []
        for i in Invoice.objects.all():
            accounting.append({
                "_kind": "invoice",
                "name": i.number,
                "title": i.client,
                "category": "Invoice",
                "type": "Invoice",
                "amount": fmt(i.amount),
                "status": i.status,
                "dueDate": str(i.due_date),
            })
        for t in Transaction.objects.all():
            accounting.append({
                "_kind": "transaction",
                "name": t.title,
                "title": t.title,
                "category": t.category,
                "type": t.type,
                "amount": fmt(t.amount),
                "status": t.status,
                "dueDate": str(t.date),
                "notes": t.notes or "",
            })
        for b in BankAccount.objects.all():
            accounting.append({
                "_kind": "bank",
                "name": b.bank_name,
                "accountName": b.account_name,
                "accountNumber": b.account_number,
                "sortCode": b.sort_code,
                "accountType": b.account_type,
                "status": b.status,
            })
        for ln in Loan.objects.all():
            accounting.append({
                "_kind": "loan",
                "name": ln.name,
                "lender": ln.lender,
                "totalAmount": fmt(ln.total_amount),
                "outstanding": fmt(ln.outstanding_amount),
                "monthly": fmt(ln.monthly_payment),
                "rate": f"{ln.interest_rate}%",
                "status": ln.status,
            })
        for ip in InsurancePolicy.objects.all():
            accounting.append({
                "_kind": "insurance",
                "name": ip.type,
                "provider": ip.provider,
                "policyNumber": ip.policy_number,
                "premium": fmt(ip.premium),
                "expiry": str(ip.expiry_date),
                "status": ip.status,
            })
        for vr in VATRecord.objects.all():
            accounting.append({
                "_kind": "vat",
                "name": vr.type,
                "period": vr.period,
                "amount": fmt(vr.amount),
                "date": str(vr.date),
                "status": vr.status,
            })
        for ds in DojoSettlement.objects.all():
            accounting.append({
                "_kind": "dojo",
                "date": str(ds.date),
                "amount": fmt(ds.amount),
                "fee": fmt(ds.fee),
                "net": fmt(ds.net),
                "method": ds.method,
                "status": ds.status,
            })

        # ── Inventory: products + stock movements ──
        inventory = []
        for p in Product.objects.all():
            inventory.append({
                "_kind": "product",
                "item": p.name,
                "itemName": p.name,
                "sku": p.sku,
                "category": p.category,
                "stock": p.quantity,
                "stockLevel": f"{p.quantity} units (min: {p.min_stock})",
                "price": fmt(p.price),
                "status": "In Stock" if p.quantity > p.min_stock else "Low Stock" if p.quantity > 0 else "Out of Stock",
            })
        for sm in StockMovement.objects.all().select_related('product'):
            inventory.append({
                "_kind": "movement",
                "item": sm.product.name if sm.product else "",
                "type": sm.type,
                "quantity": sm.quantity,
                "date": str(sm.date),
                "notes": sm.notes or "",
            })

        # ── Suppliers: suppliers + purchase orders ──
        supplier = []
        for s in Supplier.objects.all():
            supplier.append({
                "_kind": "supplier",
                "supplierName": s.name,
                "supplierId": str(s.id),
                "contact": s.contact_person,
                "phone": s.phone,
                "email": s.email,
                "category": s.category,
                "status": s.status,
            })
        for po in PurchaseOrder.objects.all().select_related('supplier'):
            supplier.append({
                "_kind": "po",
                "number": po.number,
                "supplierName": po.supplier.name if po.supplier else "",
                "product": po.product,
                "quantity": po.quantity,
                "amount": fmt(po.amount),
                "date": str(po.date),
                "status": po.status,
            })

        # ── Legal: documents + Companies House registrations ──
        legal = []
        for d in LegalDocument.objects.all():
            legal.append({
                "_kind": "document",
                "type": d.type,
                "documentType": d.type,
                "title": d.title,
                "business": business_name,
                "expiryDate": str(d.expiry_date) if d.expiry_date else "",
                "status": d.status,
                "documentUrl": d.document_url or "",
            })
        for cs in CompanyStructure.objects.all():
            legal.append({
                "_kind": "registration",
                "title": cs.name,
                "crn": cs.crn,
                "manager": cs.manager,
                "sicCode": cs.sic_code or "",
                "filingDue": str(cs.filing_due) if cs.filing_due else "",
                "address": cs.address or "",
                "status": "Active",
            })

        # ── Property: maintenance + assets + waste + licences ──
        property_data = []
        for m in MaintenanceRequest.objects.all().select_related('asset'):
            property_data.append({
                "_kind": "maintenance",
                "issue": m.issue,
                "asset": m.asset.name if m.asset else "",
                "location": m.asset.location if m.asset else "",
                "technician": m.technician,
                "priority": m.priority,
                "status": m.status,
                "date": str(m.date),
            })
        for a in Asset.objects.all():
            property_data.append({
                "_kind": "asset",
                "name": a.name,
                "assetType": a.asset_type,
                "location": a.location,
                "assignedPerson": a.assigned_person,
                "contact": a.contact,
                "status": a.status,
            })
        for wc in WasteCollection.objects.all():
            property_data.append({
                "_kind": "waste",
                "date": str(wc.date),
                "contactPerson": wc.contact_person,
                "phone": wc.phone,
                "address": wc.address,
                "status": wc.status,
                "notes": wc.notes or "",
            })
        for pl in PropertyLicence.objects.filter(business=business_name):
            property_data.append({
                "_kind": "licence",
                "type": pl.type,
                "business": pl.business,
                "authority": pl.authority,
                "issueDate": str(pl.issue_date),
                "expiryDate": str(pl.expiry_date),
                "status": pl.status,
            })
        for r in Reminder.objects.all():
            property_data.append({
                "_kind": "reminder",
                "title": r.title,
                "description": r.description,
                "dueDate": str(r.due_date)[:10],
                "priority": r.priority,
                "status": "Completed" if r.is_completed else "Pending",
            })

        return Response({
            "business": {
                "name": entity.name,
                "category": entity.category,
                "hqLocation": entity.hq_location or "",
                "companyNumber": entity.company_number or "",
                "taxId": entity.tax_id or "",
                "status": entity.status,
            },
            "fleet": fleet_records,
            "accounting": accounting,
            "inventory": inventory,
            "supplier": supplier,
            "legal": legal,
            "property": property_data,
        })
