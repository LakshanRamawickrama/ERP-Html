from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class StaffProfileAuthentication(JWTAuthentication):
    """
    JWT auth that checks StaffProfile first (admin users),
    then falls back to Django User (superadmin).
    """

    def get_user(self, validated_token):
        try:
            claim_value = validated_token[api_settings.USER_ID_CLAIM]
        except KeyError:
            raise AuthenticationFailed('Token is missing the required claim.')

        # Superadmin: token username claim matches a Django User username
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user = User.objects.get(**{api_settings.USER_ID_FIELD: claim_value})
            if not user.is_active:
                raise AuthenticationFailed('User account is disabled.')
            return user
        except User.DoesNotExist:
            pass

        # Admin: token username claim is a StaffProfile pk (ObjectId string)
        from .models import StaffProfile
        try:
            profile = StaffProfile.objects.get(pk=claim_value)
            if profile.status != 'Active':
                raise AuthenticationFailed('Staff account is not active.')
            return profile
        except Exception:
            raise AuthenticationFailed('No active account found with the given credentials.')
