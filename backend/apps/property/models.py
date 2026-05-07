from django.db import models

class Asset(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=100)
    assigned_person = models.CharField(max_length=255)
    contact = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='Operational')

    def __str__(self):
        return self.name

class MaintenanceRequest(models.Model):
    issue = models.TextField()
    date = models.DateField(auto_now_add=True)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    priority = models.CharField(max_length=50)
    technician = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='Pending')

class WasteCollection(models.Model):
    date = models.DateField()
    contact_person = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    address = models.TextField()
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True, null=True)

class PropertyLicence(models.Model):
    type = models.CharField(max_length=255)
    business = models.CharField(max_length=255)
    authority = models.CharField(max_length=255)
    issue_date = models.DateField()
    expiry_date = models.DateField()
    status = models.CharField(max_length=50)
    document = models.FileField(upload_to='property/licences/', blank=True, null=True)
