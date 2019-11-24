from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import status
from rest_framework import views
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from choices import LANGUAGES, TECHNOLOGIES, TIME_ZONES
from jobs.models import Job
from jobs.permissions import IsOwnerOrReadOnly, IsOwner
from .models import Profile, Freelancer
from .serializers import UserSerializer, ProfileSerializer


class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ProfileView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def put(self, request, *args, **kwargs):
        data = request.data
        user = request.user
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.save()

        profile = user.profile
        profile.photo = data.get('photo', profile.photo)
        profile.social_accounts = data.get('social_accounts', profile.social_accounts)
        profile.time_zone = data.get('time_zone', profile.time_zone)
        profile.languages = data.get('languages', profile.languages)
        profile.save()

        if hasattr(profile, 'freelancer'):
            profile.freelancer.bio = data.get('bio', profile.freelancer.bio)
            profile.freelancer.technologies = data.get('technologies', profile.freelancer.technologies)
            profile.freelancer.save()

        return Response(ProfileSerializer(profile, context=self.get_serializer_context()).data, status.HTTP_200_OK)


class FreelancerListView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Profile.objects.filter(freelancer__isnull=False)


class BecomeFreelancerView(generics.GenericAPIView):
    permission_classes = [IsOwner]

    def post(self, request, *args, **kwargs):
        pk = self.request.user.id
        profile = Profile.objects.get(pk=pk)
        Freelancer.objects.create(profile=profile, **request.data)

        # without context image url doesn't have domain name since serializer needs access to request object
        # https://www.django-rest-framework.org/api-guide/serializers/#including-extra-context
        return Response(ProfileSerializer(profile, context=self.get_serializer_context()).data)


class UnbecomeFreelancerView(generics.GenericAPIView):
    permission_classes = [IsOwner]

    def get(self, request, *args, **kwargs):
        pk = self.request.user.id
        profile = Profile.objects.get(pk=pk)
        profile.freelancer.delete()

        return Response(ProfileSerializer(profile, context=self.get_serializer_context()).data, status.HTTP_200_OK)


class HireFreelancerView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = User.objects.get(id=self.kwargs['pk'])
        job = Job.objects.get(pk=self.kwargs['id'])

        if user == job.freelancer:
            job.freelancer = None
            job.taken = False
            job.save()
        else:
            job.freelancer = user
            job.taken = True
            job.save()
        return self.retrieve(request, *args, **kwargs)


class LanguageListView(views.APIView):
    def get(self, request, *args, **kwargs):
        return Response(LANGUAGES, status.HTTP_200_OK)


class TechnologyListView(views.APIView):
    def get(self, request, *args, **kwargs):
        return Response(TECHNOLOGIES, status.HTTP_200_OK)


class TimeZoneListView(views.APIView):
    def get(self, request, *args, **kwargs):
        return Response(TIME_ZONES, status.HTTP_200_OK)
