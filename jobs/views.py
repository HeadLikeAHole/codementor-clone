from django.core.exceptions import PermissionDenied
from django.conf import settings
from rest_framework import generics
from rest_framework import views
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
import stripe

from .models import Job
from .serializers import JobSerializer
from .permissions import IsOwnerOrReadOnly


stripe.api_key = settings.STRIPE_SECRET_KEY


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Job.objects.filter(taken=False).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class JobDetailEditDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def put(self, request, *args, **kwargs):
        data = request.data
        job = Job.objects.get(pk=kwargs['pk'])

        job.summary = data.get('summary', job.summary)
        job.details = data.get('details', job.details)
        job.technologies = data.get('technologies', job.technologies)
        job.deadline = data.get('deadline', job.deadline)
        job.budget = data.get('budget', job.budget)
        job.save()

        return Response(JobSerializer(job, context=self.get_serializer_context()).data, status.HTTP_200_OK)


class ApplyForJobView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if hasattr(user.profile, 'freelancer'):
            job = Job.objects.get(pk=self.kwargs['pk'])

            if user in job.applicants.all():
                job.applicants.remove(user)
            else:
                job.applicants.add(user)
            return self.retrieve(request, *args, **kwargs)
        raise PermissionDenied


class PaymentView(views.APIView):
    def post(self, request, *args, **kwargs):
        pass
