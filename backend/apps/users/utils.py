import re
from rest_framework.permissions import IsAuthenticated

def slugify_name(name):
    """
    Standardizes how names are converted to slugs for URLs.
    Replaces non-alphanumeric characters with dashes.
    """
    if not name: return ""
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def get_filtered_queryset(request, model_class, business_field='business'):
    """
    Utility to filter a queryset based on user role and business assignment.
    Super Admins see records they created.
    Admins see records for their assigned business.
    """
    if request.user.is_superuser:
        # Superadmin: see everything across all businesses
        return model_class.objects.all()
    
    # Admin: records for assigned business
    business_scope = getattr(request.user, 'assigned_business', 'All')
    if business_scope == 'All':
        return model_class.objects.all()
    
    return model_class.objects.filter(**{business_field: business_scope})

def apply_ownership(request, data):
    """
    Utility to inject business and created_by into data before creating a record.
    """
    if not request.user.is_superuser:
        data['business'] = getattr(request.user, 'assigned_business', data.get('business', ''))
    
    data['created_by'] = request.user.email
    return data
