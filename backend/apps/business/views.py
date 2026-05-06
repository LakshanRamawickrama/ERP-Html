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
from apps.fleet.models import Vehicle
from apps.accounting.models import Invoice, Transaction
from apps.inventory.models import Product
from apps.suppliers.models import Supplier
from apps.legal.models import LegalDocument
from apps.property.models import MaintenanceRequest

class BusinessDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        # Find business by slug (normalized name)
        # Assuming slug is just the name lowercase with dashes
        entity = None
        for b in BusinessEntity.objects.all():
            if b.name.lower().replace(' ', '-') == slug:
                entity = b
                break
        
        if not entity:
            return Response({"error": "Business not found"}, status=404)

        # Check permission (Superadmin or assigned to this business)
        profile = StaffProfile.objects.filter(email=request.user.email).first()
        business_scope = profile.assigned_business if profile else 'All'
        
        if business_scope != 'All' and business_scope != entity.name and not request.user.is_superuser:
            return Response({"error": "Permission denied"}, status=403)

        # Gather data
        business_name = entity.name
        
        return Response({
            "business": {
                "name": entity.name,
                "category": "Enterprise",
                "email": getattr(entity, 'email', 'contact@business.com'),
                "phone": getattr(entity, 'phone', '+1 555 000 111'),
                "status": entity.status
            },
            "fleet": [
                {
                    "vehicle": v.name,
                    "registration": v.plate_number,
                    "insuranceExpiry": str(v.insurance_date) if v.insurance_date else "N/A",
                    "status": v.status
                } for v in Vehicle.objects.filter(business=business_name)
            ],
            "accounting": [
                {
                    "name": i.number,
                    "category": "Invoice",
                    "amount": f"${i.amount:,.2f}" if i.amount is not None else "$0.00",
                    "status": i.status,
                    "dueDate": str(i.due_date)
                } for i in Invoice.objects.filter(client=business_name) # Using client field as business link for now
            ],
            "inventory": [
                {
                    "item": p.name,
                    "stock": p.quantity,
                    "status": "In Stock" if p.quantity > 0 else "Out of Stock"
                } for p in Product.objects.all() # Inventory is currently global in this schema, but we could filter if needed
            ],
            "supplier": [
                {
                    "supplierName": s.name,
                    "contact": s.contact_person,
                    "phone": s.phone,
                    "paymentStatus": "Paid"
                } for s in Supplier.objects.all()
            ],
            "legal": [
                {
                    "type": d.type,
                    "business": d.business_name,
                    "status": d.status,
                    "expiryDate": str(d.expiry_date) if d.expiry_date else "N/A"
                } for d in LegalDocument.objects.filter(business_name=business_name)
            ],
            "property": [
                {
                    "type": m.priority,
                    "property": m.asset.name if m.asset else "N/A",
                    "status": m.status,
                    "description": m.description
                } for m in MaintenanceRequest.objects.all() # Should be filtered by property/business
            ]
        })
