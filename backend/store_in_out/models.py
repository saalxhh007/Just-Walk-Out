from django.db import models

# Create your models here.
class Attendance(models.Model):
    ACTION_CHOICES = [
        ('in_store', 'In Store'),
        ('out_store', 'Out Store'),
    ]

    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client.name} - {self.action} at {self.timestamp}"