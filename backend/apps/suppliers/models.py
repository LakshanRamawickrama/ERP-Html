from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='Active')

    def __str__(self):
        return self.name
