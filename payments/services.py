from django.conf import settings
import stripe
from rest_framework import response
from rest_framework import status
from .models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeService:
    def charge(self, amount, user):
        try:
            charge = stripe.Charge.create(
                amount=amount,  # cents
                currency="usd",
                customer=user.profile.stripe_customer_id)

            # create the payment
            payment = Payment()
            payment.stripe_charge_id = charge['id']
            payment.user = self.request.user
            payment.amount = amount
            payment.save()
            return response.Response(status=status.HTTP_200_OK)

        # stripe error handling (https://stripe.com/docs/api/errors/handling?lang=python)
        except stripe.error.CardError as e:
            # Since it's a decline, stripe.error.CardError will be caught
            body = e.json_body
            err = body.get('error', {})
            return response.Response({'message': f"{err.get('message')}"}, status=status.HTTP_400_BAD_REQUEST)

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            return response.Response(
                {'message': 'Too many requests made to the API too quickly'},
                status=status.HTTP_400_BAD_REQUEST)

        except stripe.error.InvalidRequestError as e:
            # Invalid parameters were supplied to Stripe's API
            return response.Response(
                {'message': "Invalid parameters were supplied to Stripe's API"},
                status=status.HTTP_400_BAD_REQUEST)

        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            return response.Response(
                {'message': "Authentication with Stripe's API failed"},
                status=status.HTTP_400_BAD_REQUEST)

        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            return response.Response(
                {'message': 'Network communication with Stripe failed'},
                status=status.HTTP_400_BAD_REQUEST)

        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            return response.Response(
                {'message': 'Something went wrong. You were not charged. Please try again'},
                status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # send an email to myself because there's something wrong with my code
            return response.Response(
                {'message': 'Serious error occurred. We have been notified'},
                status=status.HTTP_400_BAD_REQUEST)


stripe_service = StripeService()
