from django.db import models

class LegalDocument(models.Model):
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=100) # Contract, Agreement, NDA
    status = models.CharField(max_length=50) # Active, Expired, Pending
    expiry_date = models.DateField()
    document_url = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title
