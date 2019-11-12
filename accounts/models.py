from django.db import models
from django.contrib.auth.models import User
from multiselectfield import MultiSelectField

from choices import LANGUAGES, TIME_ZONES, TECHNOLOGIES


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.ImageField(default='profile_default.jpg', upload_to='profile_images')
    social_accounts = models.TextField(blank=True)
    time_zone = models.CharField(max_length=5, choices=TIME_ZONES, blank=True)
    languages = MultiSelectField(choices=LANGUAGES, blank=True)

    def __str__(self):
        return f'{self.user} profile'


class Freelancer(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    bio = models.TextField()
    technologies = MultiSelectField(choices=TECHNOLOGIES)

    def __str__(self):
        return f'{self.profile.user} freelancer'
