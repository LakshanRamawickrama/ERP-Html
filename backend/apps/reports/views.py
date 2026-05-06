from rest_framework.views import APIView
from rest_framework.response import Response
from apps.business.models import BusinessEntity
from apps.fleet.models import Vehicle
from apps.inventory.models import Product
from apps.suppliers.models import Supplier

class ReportsDataView(APIView):
    def get(self, request):
        return Response({
            "stats": [
                {"title": "Total Entities", "value": str(BusinessEntity.objects.count())},
                {"title": "Fleet Vehicles", "value": str(Vehicle.objects.count())},
                {"title": "Active Providers", "value": str(Supplier.objects.count())},
                {"title": "Stock SKUs", "value": str(Product.objects.count())}
            ],
            "templates": [
                {"label": "Annual Tax Summary", "format": "PDF"},
                {"label": "Supplier Performance", "format": "XLSX"}
            ],
            "businesses": [], # Could pull from BusinessEntity
            "banks": [],
            "tax": []
        })
