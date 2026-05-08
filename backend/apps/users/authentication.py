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

        # Auth: token username claim matches email, username, or pk
        from .models import StaffProfile
        try:
            profile = (
                StaffProfile.objects.filter(email=claim_value).first() or
                StaffProfile.objects.filter(username=claim_value).first()
            )
            if not profile:
                # Fallback to pk (ObjectId)
                profile = StaffProfile.objects.get(pk=claim_value)
            
            if profile.status != 'Active':
                raise AuthenticationFailed('Staff account is not active.')
            return profile
        except Exception:
            raise AuthenticationFailed('No active account found with the given credentials.')
