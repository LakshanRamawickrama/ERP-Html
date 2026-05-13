from django.db import models

class Vehicle(models.Model):
    name = models.CharField(max_length=255)
    plate_number = models.CharField(max_length=50, unique=True)
    business = models.CharField(max_length=255)
    mot_date = models.DateField(blank=True, null=True)
    insurance_date = models.DateField(blank=True, null=True)
    road_tax_date = models.DateField(blank=True, null=True)
    reminder_before = models.IntegerField(default=30)  # Days before expiry to remind
    fuel_type = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, default='Active')
    notes = models.TextField(blank=True, null=True)
    ins_doc = models.FileField(upload_to='fleet/insurance/', blank=True, null=True)
    mot_doc = models.FileField(upload_to='fleet/mot/', blank=True, null=True)
    tax_doc = models.FileField(upload_to='fleet/roadtax/', blank=True, null=True)
    other_doc = models.FileField(upload_to='fleet/other/', blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.plate_number})"

class Delivery(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    pickup_date = models.DateField(blank=True, null=True)
    delivery_date = models.DateField(blank=True, null=True)
    address = models.TextField()
    contact_person = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

class ParcelPartner(models.Model):
    provider = models.CharField(max_length=255)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True)
    service_date = models.DateField(blank=True, null=True)
    area = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)
