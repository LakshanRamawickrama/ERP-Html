from django.db import models

class Vehicle(models.Model):
    name = models.CharField(max_length=255)
    plate_number = models.CharField(max_length=50, unique=True)
    business = models.CharField(max_length=255)
    mot_date = models.DateField()
    insurance_date = models.DateField()
    road_tax_date = models.DateField()
    status = models.CharField(max_length=50, default='Active')
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.plate_number})"

class Delivery(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    pickup_date = models.DateField()
    delivery_date = models.DateField()
    address = models.TextField()
    contact_person = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True, null=True)

class ParcelPartner(models.Model):
    provider = models.CharField(max_length=255)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True)
    service_date = models.DateField()
    area = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
