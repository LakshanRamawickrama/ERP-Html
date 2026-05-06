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
