"""
Serializer mixin to handle MongoDB ObjectId fields.
Django REST Framework does not natively support bson.ObjectId,
so we swap the `id` field to a CharField before DRF tries to call int().
"""
from rest_framework import serializers


class MongoSerializerMixin:
    """
    Mixin for ModelSerializer that replaces the auto-generated `id` IntegerField
    with a CharField so that MongoDB ObjectId values are serialised correctly.
    """
    def get_fields(self):
        fields = super().get_fields()
        # Replace the id field (DRF auto-detects it as IntegerField) with CharField
        if 'id' in fields:
            fields['id'] = serializers.CharField(read_only=True)
        return fields

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Ensure any remaining ObjectId-like objects are stringified
        for key, value in representation.items():
            if hasattr(value, '__class__') and value.__class__.__name__ == 'ObjectId':
                representation[key] = str(value)
        return representation
