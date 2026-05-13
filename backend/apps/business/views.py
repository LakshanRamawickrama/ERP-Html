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
            entities = BusinessEntity.objects.all()
            structures = CompanyStructure.objects.all()
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
                "categories": ["Retail", "Logistics", "Finance", "Tech", "Healthcare"],
                "names": list(entities.values_list('name', flat=True))
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

        business_name = entity.name

        def fmt(amount):
            return f"${amount:,.2f}" if amount is not None else "$0.00"

        # ── Fleet ──
        fleet_records = []
        for v in Vehicle.objects.filter(business=business_name):
            delivery = Delivery.objects.filter(vehicle=v).order_by('-delivery_date').first()
            fleet_records.append({
                "_kind": "vehicle",
                "vehicleName": v.name, "vehicleNumber": v.plate_number,
                "insuranceExpiry": str(v.insurance_date) if v.insurance_date else "",
                "motDate": str(v.mot_date) if v.mot_date else "",
                "roadTaxDate": str(v.road_tax_date) if v.road_tax_date else "",
                "deliveryDate": str(delivery.delivery_date) if delivery else "",
                "status": v.status,
            })
        for pp in ParcelPartner.objects.filter(business=business_name):
            fleet_records.append({
                "_kind": "parcel", "provider": pp.provider, "area": pp.area, "status": pp.status,
                "contact": pp.contact_name, "phone": pp.contact_number, "serviceDate": str(pp.service_date)
            })

        # ── Accounting ──
        accounting = []
        for i in Invoice.objects.filter(business=business_name):
            accounting.append({"_kind": "invoice", "name": i.number, "title": i.client, "amount": fmt(i.amount), "dueDate": str(i.due_date), "status": i.status})
        for t in Transaction.objects.filter(business=business_name):
            accounting.append({"_kind": "transaction", "name": t.title, "category": t.category, "type": t.type, "amount": fmt(t.amount), "dueDate": str(t.date), "status": t.status, "notes": t.notes})
        for b in BankAccount.objects.filter(business=business_name):
            accounting.append({"_kind": "bank", "name": b.bank_name, "accountName": b.account_name, "accountNumber": b.account_number, "sortCode": b.sort_code, "accountType": b.account_type, "status": b.status})
        for ln in Loan.objects.filter(business=business_name):
            accounting.append({"_kind": "loan", "name": ln.name, "lender": ln.lender, "totalAmount": fmt(ln.total_amount), "outstanding": fmt(ln.outstanding_amount), "monthly": fmt(ln.monthly_payment), "rate": f"{ln.interest_rate}%", "status": ln.status})
        for ip in InsurancePolicy.objects.filter(business=business_name):
            accounting.append({"_kind": "insurance", "name": ip.type, "provider": ip.provider, "policyNumber": ip.policy_number, "premium": fmt(ip.premium), "expiry": str(ip.expiry_date), "status": ip.status})
        for vr in VATRecord.objects.filter(business=business_name):
            accounting.append({"_kind": "vat", "name": vr.type, "period": vr.period, "amount": fmt(vr.amount), "date": str(vr.date), "status": vr.status})
        for ds in DojoSettlement.objects.filter(business=business_name):
            accounting.append({"_kind": "dojo", "date": str(ds.date), "method": ds.method, "amount": fmt(ds.amount), "fee": fmt(ds.fee), "net": fmt(ds.net), "status": ds.status})

        # ── Inventory ──
        inventory = []
        for p in Product.objects.filter(business=business_name):
            inventory.append({"_kind": "product", "item": p.name, "category": p.category, "sku": p.sku, "stockLevel": p.quantity, "price": fmt(p.price), "status": "In Stock" if p.quantity > p.min_stock else "Low Stock"})
        for m in StockMovement.objects.filter(business=business_name):
            inventory.append({"_kind": "movement", "item": m.product.name if m.product else "Item", "date": str(m.date), "type": m.type, "quantity": m.quantity, "notes": m.notes})
        
        # ── Suppliers ──
        supplier_records = []
        for s in Supplier.objects.filter(business=business_name):
            supplier_records.append({"_kind": "supplier", "supplierName": s.name, "category": s.category, "contact": s.contact_person, "phone": s.phone, "email": s.email, "status": s.status})
        for po in PurchaseOrder.objects.filter(business=business_name):
            supplier_records.append({"_kind": "po", "number": po.number, "supplierName": po.supplier.name if po.supplier else "N/A", "product": po.product, "quantity": po.quantity, "amount": fmt(po.amount), "date": str(po.date), "status": po.status})

        # ── Legal ──
        legal = []
        for d in LegalDocument.objects.filter(business=business_name):
            legal.append({"_kind": "document", "title": d.title, "type": d.type, "expiryDate": str(d.expiry_date), "status": d.status, "business": d.business})
        for s in CompanyStructure.objects.filter(name=business_name):
            legal.append({"_kind": "registration", "title": "Companies House", "crn": s.crn, "manager": s.manager, "sicCode": s.sic_code, "filingDue": str(s.filing_due), "address": s.address, "status": "Active"})

        # ── Property ──
        property_data = []
        for m in MaintenanceRequest.objects.filter(business=business_name):
            property_data.append({"_kind": "maintenance", "asset": m.asset.name if m.asset else "General", "priority": m.priority, "issue": m.issue, "technician": m.technician, "date": str(m.date), "status": m.status})
        for a in Asset.objects.filter(business=business_name):
            property_data.append({"_kind": "asset", "name": a.name, "assetType": a.asset_type, "location": a.location, "assignedPerson": a.assigned_person, "contact": a.contact, "status": a.status})
        for wc in WasteCollection.objects.filter(business=business_name):
            property_data.append({"_kind": "waste", "date": str(wc.date), "contactPerson": wc.contact_person, "phone": wc.phone, "address": wc.address, "notes": wc.notes, "status": wc.status})
        for pl in PropertyLicence.objects.filter(business=business_name):
            property_data.append({"_kind": "licence", "type": pl.type, "authority": pl.authority, "issueDate": str(pl.issue_date), "expiryDate": str(pl.expiry_date), "business": pl.business, "status": pl.status})
        for rem in Reminder.objects.filter(business=business_name):
            property_data.append({"_kind": "reminder", "title": rem.title, "priority": rem.priority, "dueDate": str(rem.due_date.date() if hasattr(rem.due_date, 'date') else rem.due_date), "description": rem.description, "status": "Pending"})

        return Response({
            "business": BusinessEntitySerializer(entity, context={'request': request}).data,
            "fleet": fleet_records,
            "accounting": accounting,
            "inventory": inventory,
            "supplier": supplier_records,
            "legal": legal,
            "property": property_data,
        })

from rest_framework import status as http_status
class BusinessEntityView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        files = request.FILES
        try:
            entity = BusinessEntity.objects.create(
                name=data.get('name', ''),
                company_number=data.get('company_number') or data.get('num', ''),
                category=data.get('category') or data.get('cat', ''),
                tax_id=data.get('tax_id') or data.get('taxId', ''),
                hq_location=data.get('hq_location') or data.get('hq', ''),
                currency=data.get('currency', 'GBP'),
                timezone=data.get('timezone', 'UTC'),
                fiscal_year=data.get('fiscal_year', ''),
                website=data.get('website', ''),
                phone=data.get('phone', ''),
                email=data.get('email', ''),
                business_logo=files.get('business_logo'),
                status=data.get('status', 'Active'),
                created_by=request.user.email
            )
            return Response(BusinessEntitySerializer(entity).data, status=http_status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=http_status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            entity = BusinessEntity.objects.get(pk=pk)
            data = request.data
            files = request.FILES
            
            entity.name = data.get('name', entity.name)
            entity.company_number = data.get('company_number', data.get('num', entity.company_number))
            entity.category = data.get('category', data.get('cat', entity.category))
            entity.tax_id = data.get('tax_id', data.get('taxId', entity.tax_id))
            entity.hq_location = data.get('hq_location', data.get('hq', entity.hq_location))
            entity.currency = data.get('currency', entity.currency)
            entity.timezone = data.get('timezone', entity.timezone)
            entity.fiscal_year = data.get('fiscal_year', entity.fiscal_year)
            entity.website = data.get('website', entity.website)
            entity.phone = data.get('phone', entity.phone)
            entity.email = data.get('email', entity.email)
            entity.status = data.get('status', entity.status)
            
            if files.get('business_logo'):
                entity.business_logo = files.get('business_logo')
            
            entity.save()
            return Response(BusinessEntitySerializer(entity).data)
        except BusinessEntity.DoesNotExist:
            return Response({'error': 'Not found'}, status=http_status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=http_status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            entity = BusinessEntity.objects.get(pk=pk)
            entity.delete()
            return Response(status=http_status.HTTP_204_NO_CONTENT)
        except BusinessEntity.DoesNotExist:
            return Response({'error': 'Not found'}, status=http_status.HTTP_404_NOT_FOUND)
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

    def delete(self, request, pk):
        try:
            structure = CompanyStructure.objects.get(pk=pk)
            structure.delete()
            return Response(status=http_status.HTTP_204_NO_CONTENT)
        except CompanyStructure.DoesNotExist:
            return Response({'error': 'Not found'}, status=http_status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=http_status.HTTP_400_BAD_REQUEST)
