from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth import get_user_model
import stripe
from .models import Profile

stripe.api_key = settings.STRIPE_SECRET_KEY
User = get_user_model()

# create a user's profile when a new user is registered
# should be registered in apps.py
@receiver(post_save, sender=User)
def create_profile(sender, **kwargs):
    if kwargs['created']:
        user = kwargs['instance']
        profile = Profile.objects.create(user=user)
        customer = stripe.Customer.create(email=user.email)
        profile.stripe_customer_id = customer['id']
        profile.save()


# delete user object when related profile is deleted
@receiver(post_delete, sender=Profile)
def delete_user(sender, instance, **kwargs):
    User.objects.get(id=instance.user.id).delete()
