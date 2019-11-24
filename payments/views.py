import json

import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, response, status, views
from rest_framework.permissions import IsAuthenticated

from jobs.models import Job
from .models import Payment
from .serializers import JobPaymentSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY


class PublishKeyView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return response.Response({'publicKey': settings.STRIPE_PUBLIC_KEY})


class JobPaymentDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobPaymentSerializer
    permission_classes = [IsAuthenticated]


class CreatePaymentIntentView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        job = Job.objects.get(id=request.data['job'])
        payment_intent = stripe.PaymentIntent.create(
            amount=job.budget * 100,  # this value is in cents
            currency="USD",
            payment_method_types=request.data['payment_method_types']  # e.g card, apple pay etc.
        )
        try:
            data = {}
            data.update(payment_intent)
            Payment.objects.create(
                job=job,
                stripe_payment_intent_id=payment_intent.id
            )
            return response.Response(data)
        except Exception as e:
            return response.Response(json.dumps(str(e)), status=status.HTTP_400_BAD_REQUEST)


class WebhookReceiver(views.APIView):

    @csrf_exempt
    def post(self, request):
        # You can use webhooks to receive information about asynchronous payment events.
        # For more about our webhook events check out https://stripe.com/docs/webhooks.
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET
        if webhook_secret:
            payload = request.body
            sig_header = request.META['HTTP_STRIPE_SIGNATURE']
            event = None
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, webhook_secret
                )
                print(event.data.object)
            except ValueError as e:
                print(e)
                # Invalid payload
                return response.Response(status=status.HTTP_400_BAD_REQUEST)
            except stripe.error.SignatureVerificationError as e:
                print(e)
                # Invalid signature
                return response.Response(status=status.HTTP_400_BAD_REQUEST)

            if event.type == 'payment_intent.succeeded':
                # Fulfill any orders, e-mail receipts, etc
                print("💰 Payment received!")
                payment_intent = event.data.object  # contains a stripe.PaymentIntent
                # set the payment as successful
                payment = Payment.objects.get(stripe_payment_intent_id=payment_intent.id)
                # TODO: send payment success email
                payment.status = 'S'
                payment.save()

            elif event.type == 'payment_intent.payment_failed':
                # Notify the customer that their order was not fulfilled
                print("❌ Payment failed.")
                payment_intent = event.data.object  # contains a stripe.PaymentIntent
                # TODO: send payment failure email
                payment = Payment.objects.get(stripe_payment_intent_id=payment_intent.id)
                payment.status = 'F'
                payment.save()

            else:
                # Unexpected event type
                return response.Response(status=status.HTTP_400_BAD_REQUEST)

            return response.Response(status=status.HTTP_200_OK)
