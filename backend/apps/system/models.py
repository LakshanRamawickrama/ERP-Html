from django.db import models

class SystemLog(models.Model):
    action = models.CharField(max_length=255)
    user = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField()

    def __str__(self):
        return f"{self.user} - {self.action}"

class SystemCredential(models.Model):
    service = models.CharField(max_length=255)
    account = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    support = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, default='Active')

class SystemAlert(models.Model):
    label = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50) # soon, info, warning

class ConnectedEmail(models.Model):
    email = models.EmailField()
    label = models.CharField(max_length=255, blank=True)
    type = models.CharField(max_length=50, default='primary')
    password = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=50, default='Connected')
    created_by = models.CharField(max_length=255, blank=True, null=True)

class Note(models.Model):
    text = models.TextField()
    business = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)
