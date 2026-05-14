from django.db import models

class LegalDocument(models.Model):
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    expiry_date = models.DateField()
    reminder_days = models.IntegerField(default=7)
    authority = models.CharField(max_length=255, blank=True, null=True)
    document_file = models.FileField(upload_to='legal/documents/', blank=True, null=True)
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title
