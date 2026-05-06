from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    """
    Allows access only to super_admin users.
    """
    def has_permission(self, request, view):
        # In a real system, we would check request.user.role
        # For now, we'll allow an 'X-User-Role' header for testing
        role = request.headers.get('X-User-Role')
        return role == 'Super Admin'

class IsManagerOrAdmin(permissions.BasePermission):
    """
    Allows access to both Managers and Super Admins.
    """
    def has_permission(self, request, view):
        role = request.headers.get('X-User-Role')
        return role in ['Super Admin', 'Manager']
