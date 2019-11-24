import stripe
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from multiselectfield import MultiSelectField

from choices import LANGUAGES, TIME_ZONES, TECHNOLOGIES

stripe.api_key = settings.STRIPE_SECRET_KEY
User = get_user_model()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.ImageField(default='profile_default.jpg', upload_to='profile_images')
    social_accounts = models.TextField(blank=True)
    time_zone = models.CharField(max_length=5, choices=TIME_ZONES, blank=True)
    languages = MultiSelectField(choices=LANGUAGES, blank=True)
    stripe_customer_id = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f'{self.user} profile'


class Freelancer(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    bio = models.TextField()
    technologies = MultiSelectField(choices=TECHNOLOGIES)
    stripe_account_id = models.CharField(max_length=50, blank=True, null=True)
    active = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.profile.user} freelancer'
