from rest_framework import serializers

from jobs.models import Job
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = (
            'id', 'job', 'user', 'timestamp'
        )
        read_only_fields = (
            'id', 'timestamp'
        )


class JobPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('budget',)
