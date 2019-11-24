from django.db.models.signals import post_save, post_delete, pre_save
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


@receiver(pre_save, sender=Profile)
def delete_photo_file_on_update(sender, instance, **kwargs):
    """
    Deletes old photo when updating model instance
    """
    try:
        old_photo = sender.objects.get(pk=instance.pk).photo
    except sender.DoesNotExist:
        return False

    # if old photo is the default profile photo then it shouldn't be deleted otherwise delete old photo
    if not old_photo.url.endswith('/media/profile_default.jpg'):
        sender.objects.get(pk=instance.pk).photo.delete(False)

    # if old and new photos are default profile photos
    # then make new photo be equal to old photo so new copy of the default profile photo isn't created
    new_photo = instance.photo
    if old_photo == new_photo:
        instance.photo = old_photo
