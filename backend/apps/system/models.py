from django.db import models

class SystemLog(models.Model):
    action = models.CharField(max_length=255)
    user = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField()

    def __str__(self):
        return f"{self.user} - {self.action}"
