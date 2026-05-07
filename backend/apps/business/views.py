from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BusinessEntity, CompanyStructure
from .serializers import BusinessEntitySerializer, CompanyStructureSerializer
from apps.users.models import StaffProfile

class BusinessDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = StaffProfile.objects.filter(email=request.user.email).first()
        business_scope = profile.assigned_business if profile else 'All'
        
        if request.user.is_superuser:
            entities = BusinessEntity.objects.filter(created_by=request.user.email)
            structures = CompanyStructure.objects.filter(created_by=request.user.email)
        else:
            if business_scope == 'All':
                entities = BusinessEntity.objects.all()
                structures = CompanyStructure.objects.all()
            else:
                entities = BusinessEntity.objects.filter(name=business_scope)
                structures = CompanyStructure.objects.filter(name=business_scope)
        
        return Response({
            "entities": BusinessEntitySerializer(entities, many=True, context={'request': request}).data,
            "structures": CompanyStructureSerializer(structures, many=True, context={'request': request}).data,
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

        # Access check
        if request.user.is_superuser:
            if entity.created_by != request.user.email:
                return Response({"error": "Permission denied. Super admins can only view businesses they added."}, status=403)
        else:
            profile = StaffProfile.objects.filter(email=request.user.email).first()
            business_scope = profile.assigned_business if profile else 'All'
            if business_scope != 'All' and business_scope != entity.name:
                return Response({"error": "Permission denied"}, status=403)

        business_name = entity.name

        def fmt(amount):
            return f"${amount:,.2f}" if amount is not None else "$0.00"

        # ── Fleet ──
        vehicles = Vehicle.objects.filter(business=business_name)
        fleet_records = []
        for v in vehicles:
            delivery = Delivery.objects.filter(vehicle=v).order_by('-delivery_date').first()
            fleet_records.append({
                "_kind": "vehicle",
                "vehicle": v.name, "registration": v.plate_number,
                "insurance": str(v.insurance_date) if v.insurance_date else "",
                "mot": str(v.mot_date) if v.mot_date else "",
                "status": v.status,
            })
        for pp in ParcelPartner.objects.filter(business=business_name):
            fleet_records.append({
                "_kind": "parcel", "provider": pp.provider, "area": pp.area, "status": pp.status,
            })

        # ── Accounting ──
        accounting = []
        for i in Invoice.objects.filter(business=business_name):
            accounting.append({"_kind": "invoice", "name": i.number, "title": i.client, "amount": fmt(i.amount), "status": i.status})
        for t in Transaction.objects.filter(business=business_name):
            accounting.append({"_kind": "transaction", "name": t.title, "category": t.category, "amount": fmt(t.amount), "status": t.status})
        for b in BankAccount.objects.filter(business=business_name):
            accounting.append({"_kind": "bank", "name": b.bank_name, "accountNumber": b.account_number, "status": b.status})
        for ln in Loan.objects.filter(business=business_name):
            accounting.append({"_kind": "loan", "name": ln.name, "outstanding": fmt(ln.outstanding_amount), "status": ln.status})
        for ip in InsurancePolicy.objects.filter(business=business_name):
            accounting.append({"_kind": "insurance", "name": ip.type, "expiry": str(ip.expiry_date), "status": ip.status})
        for vr in VATRecord.objects.filter(business=business_name):
            accounting.append({"_kind": "vat", "name": vr.type, "amount": fmt(vr.amount), "status": vr.status})
        for ds in DojoSettlement.objects.filter(business=business_name):
            accounting.append({"_kind": "dojo", "date": str(ds.date), "amount": fmt(ds.amount), "status": ds.status})

        # ── Inventory ──
        inventory = []
        for p in Product.objects.filter(business=business_name):
            inventory.append({"_kind": "product", "item": p.name, "sku": p.sku, "stock": p.quantity, "status": "In Stock" if p.quantity > p.min_stock else "Low"})
        
        # ── Suppliers ──
        suppliers_data = []
        for s in Supplier.objects.filter(business=business_name):
            suppliers_data.append({"_kind": "supplier", "supplierName": s.name, "category": s.category, "status": s.status})

        # ── Legal ──
        legal = []
        for d in LegalDocument.objects.filter(business=business_name):
            legal.append({"_kind": "document", "title": d.title, "status": d.status})

        # ── Property ──
        property_data = []
        for m in MaintenanceRequest.objects.filter(business=business_name):
            property_data.append({"_kind": "maintenance", "issue": m.issue, "status": m.status})
        for wc in WasteCollection.objects.filter(business=business_name):
            property_data.append({"_kind": "waste", "date": str(wc.date), "status": wc.status})
        for pl in PropertyLicence.objects.filter(business=business_name):
            property_data.append({"_kind": "licence", "type": pl.type, "status": pl.status})

        return Response({
            "business": {"name": entity.name, "category": entity.category, "status": entity.status},
            "fleet": fleet_records,
            "accounting": accounting,
            "inventory": inventory,
            "supplier": suppliers_data,
            "legal": legal,
            "property": property_data,
        })

from rest_framework import status as http_status
class BusinessEntityView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            entity = BusinessEntity.objects.create(
                name=data.get('name', ''),
                company_number=data.get('company_number') or data.get('num', ''),
                category=data.get('category') or data.get('cat', ''),
                tax_id=data.get('tax_id') or data.get('taxId', ''),
                hq_location=data.get('hq_location') or data.get('hq', ''),
                status=data.get('status', 'Active'),
                created_by=request.user.email
            )
            return Response(BusinessEntitySerializer(entity).data, status=http_status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=http_status.HTTP_400_BAD_REQUEST)

class CompanyStructureView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            structure = CompanyStructure.objects.create(
                name=data.get('name', ''),
                crn=data.get('crn', ''),
                manager=data.get('manager', ''),
                sic_code=data.get('sic_code') or data.get('sic', ''),
                filing_due=data.get('filing_due') or data.get('due', '2099-01-01'),
                address=data.get('address') or data.get('addr', ''),
                balance_sheet=files.get('balance_sheet'),
                pl_statement=files.get('pl_statement'),
                created_by=request.user.email
            )
            return Response(CompanyStructureSerializer(structure, context={'request': request}).data, status=http_status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=http_status.HTTP_400_BAD_REQUEST)
