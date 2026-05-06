from django.db import models

class Reminder(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateTimeField()
    priority = models.CharField(max_length=50, default='Medium') # High, Medium, Low
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
