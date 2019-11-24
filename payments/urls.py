from django.urls import path

from . import views

urlpatterns = [
    path('public-key/', views.PublishKeyView.as_view()),
    path('create-payment-intent/', views.CreatePaymentIntentView.as_view()),
    path('job-detail/<pk>/', views.JobPaymentDetailView.as_view()),
    path('webhook-receiver/', views.WebhookReceiver.as_view())
]
