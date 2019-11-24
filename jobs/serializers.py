from rest_framework import fields, serializers

from accounts.serializers import UserSerializer
from choices import TECHNOLOGIES
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    applicants = serializers.SerializerMethodField()
    freelancer = serializers.SerializerMethodField()
    technologies = fields.MultipleChoiceField(choices=TECHNOLOGIES)
    technologies_display = serializers.CharField(source='get_technologies_display', required=False)

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['user', 'applicants', 'freelancer', 'technologies_display']

    def get_applicants(self, obj):
        applicants = []
        for a in obj.applicants.all():
            applicant = {
                'id': a.id,
                'first_name': a.first_name,
                'last_name': a.last_name,
            }
            applicants.append(applicant)
        return applicants

    def get_freelancer(self, obj):
        if obj.freelancer:
            return UserSerializer(obj.freelancer).data
        return None
