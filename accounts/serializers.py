from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile, Freelancer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


# since JobSerializer uses UserSerializer then JobSerializer should be imported after UserSerializer definition
from jobs.serializers import JobSerializer


class FreelancerSerializer(serializers.ModelSerializer):
    technologies_display = serializers.CharField(source='get_technologies_display', required=False)

    class Meta:
        model = Freelancer
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    freelancer = FreelancerSerializer()
    languages_display = serializers.CharField(source='get_languages_display')
    taken_jobs = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_taken_jobs(self, obj):
        return JobSerializer(obj.user.jobs.all(), many=True).data
