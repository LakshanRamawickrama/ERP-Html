from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/business/', include('apps.business.urls')),
    path('api/property/', include('apps.property.urls')),
    path('api/fleet/', include('apps.fleet.urls')),
    path('api/accounting/', include('apps.accounting.urls')),
    path('api/inventory/', include('apps.inventory.urls')),
    path('api/legal/', include('apps.legal.urls')),
    path('api/reminders/', include('apps.reminders.urls')),
    path('api/suppliers/', include('apps.suppliers.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/system/', include('apps.system.urls')),
    path('api/reports/', include('apps.reports.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
