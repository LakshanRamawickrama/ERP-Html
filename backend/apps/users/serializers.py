from rest_framework import serializers
from core.mixins import MongoSerializerMixin
from .models import StaffProfile

class StaffProfileSerializer(MongoSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = '__all__'
