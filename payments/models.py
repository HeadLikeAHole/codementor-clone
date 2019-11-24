from django.contrib.auth import get_user_model
from django.db import models

from jobs.models import Job

User = get_user_model()


class Payment(models.Model):
    status_choices = (
        ('S', 'Success'),
        ('F', 'Failure'),
        ('P', 'Pending')
    )

    job = models.OneToOneField(Job, on_delete=models.CASCADE)
    stripe_payment_intent_id = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=status_choices, default='P')

    def __str__(self):
        return self.job.user.username
