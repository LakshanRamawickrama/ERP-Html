from django.core.management.base import BaseCommand
from apps.business.models import BusinessEntity, CompanyStructure

class Command(BaseCommand):
    help = 'Seed business and company structure data'

    def handle(self, *args, **options):
        SUPER_ADMIN_EMAIL = 'superadmin@erp.com'
        BUSINESS_1 = 'Main Retail Store'
        BUSINESS_2 = 'Logistics Hub'

        # Ensure Businesses exist
        b1, _ = BusinessEntity.objects.get_or_create(name=BUSINESS_1, defaults={'company_number': 'CH-98765432', 'category': 'Retail', 'created_by': SUPER_ADMIN_EMAIL})
        b2, _ = BusinessEntity.objects.get_or_create(name=BUSINESS_2, defaults={'company_number': 'CH-11223344', 'category': 'Logistics', 'created_by': SUPER_ADMIN_EMAIL})

        CompanyStructure.objects.all().delete()
        
        CompanyStructure.objects.create(
            name='Main Retail HQ', 
            business=BUSINESS_1,
            house_code='HQ-LON-01',
            location='123 Oxford Street, London',
            gps_coordinates='51.5145, -0.1444',
            contact_number='+44 20 7946 0123',
            opening_hours='08:00 - 22:00',
            status='Active',
            crn='12345678', 
            manager='John Smith', 
            sic_code='47110', 
            filing_due='2026-12-15', 
            created_by=SUPER_ADMIN_EMAIL
        )
        
        CompanyStructure.objects.create(
            name='Northern Logistics Base', 
            business=BUSINESS_2,
            house_code='LB-MAN-05',
            location='Trafford Park, Manchester',
            gps_coordinates='53.4631, -2.3168',
            contact_number='+44 161 496 0789',
            opening_hours='24/7',
            status='Active',
            crn='87654321', 
            manager='Sarah Jenkins', 
            sic_code='52101', 
            filing_due='2026-11-20', 
            created_by=SUPER_ADMIN_EMAIL
        )
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded business structures'))
