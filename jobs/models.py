from django.db import models
from django.contrib.auth.models import User
from multiselectfield import MultiSelectField

from choices import TECHNOLOGIES


class Job(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    applicants = models.ManyToManyField(User, related_name='applications', blank=True)
    freelancer = models.ForeignKey(User, related_name='jobs', blank=True, null=True, on_delete=models.SET_NULL)
    summary = models.CharField(max_length=50)
    details = models.TextField()
    technologies = MultiSelectField(choices=TECHNOLOGIES)
    deadline = models.DateField()
    budget = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    taken = models.BooleanField(default=False)

    def __str__(self):
        return self.summary
