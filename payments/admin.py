from django.contrib import admin

from .models import Payment


class PaymentAdmin(admin.ModelAdmin):
    list_display = ['stripe_payment_intent_id']


admin.site.register(Payment, PaymentAdmin)
