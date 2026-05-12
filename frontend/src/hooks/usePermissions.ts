export function usePermissions(moduleName: string, parentGroup?: string) {
  try {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return { canView: false, canAdd: false, canEdit: false, canDelete: false };
    
    const user = JSON.parse(savedUser);
    if (user?.role === 'super_admin' || user?.is_superuser) {
      return { canView: true, canAdd: true, canEdit: true, canDelete: true };
    }

    const raw = user?.permissions;
    const perms = typeof raw === 'string' ? JSON.parse(raw) : (raw || {});
    
    // Combine permissions from specific module and parent group
    const moduleActions: string[] = Array.isArray(perms[moduleName]) ? perms[moduleName] : [];
    const groupActions: string[] = parentGroup && Array.isArray(perms[parentGroup]) ? perms[parentGroup] : [];
    
    const actions = Array.from(new Set([...moduleActions, ...groupActions]));

    return {
      canView:   actions.includes('view'),
      canAdd:    actions.includes('add'),
      canEdit:   actions.includes('edit'),
      canDelete: actions.includes('delete'),
    };
  } catch (e) {
    console.error("Permission hook error:", e);
    return { canView: false, canAdd: false, canEdit: false, canDelete: false };
  }
}
