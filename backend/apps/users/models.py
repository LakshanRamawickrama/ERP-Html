from django.db import models

class StaffProfile(models.Model):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    email = models.EmailField()
    status = models.CharField(max_length=50, default='Active')

    def __str__(self):
        return self.name
