from django.db import models


class StaffProfile(models.Model):
    name = models.CharField(max_length=255)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    role = models.CharField(max_length=100)
    assigned_business = models.CharField(max_length=255, default='All')
    access = models.TextField(default='All')
    permissions = models.TextField(default='{}')
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128, default='')
    status = models.CharField(max_length=50, default='Active')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def get_username(self):
        return self.username or self.email

    # Required for DRF IsAuthenticated and JWT compatibility
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return self.status == 'Active'

    @property
    def is_superuser(self):
        return self.role == 'super_admin'

    @property
    def is_staff(self):
        return True

    is_anonymous = False

    def __str__(self):
        return self.name
