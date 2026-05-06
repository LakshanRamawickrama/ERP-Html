from django.db import models

class StaffProfile(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=100) # 'super_admin' or 'admin'
    assigned_business = models.CharField(max_length=255, default='All') # 'All' for super_admin, specific business name for admin
    email = models.EmailField()
    status = models.CharField(max_length=50, default='Active')

    def __str__(self):
        return self.name
