export function usePermissions(moduleName: string) {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.role === 'super_admin') {
      return { canView: true, canAdd: true, canEdit: true, canDelete: true };
    }
    const raw = user?.permissions;
    const perms = typeof raw === 'string' ? JSON.parse(raw) : (raw || {});
    const actions: string[] = Array.isArray(perms[moduleName]) ? perms[moduleName] : [];
    return {
      canView:   actions.includes('view'),
      canAdd:    actions.includes('add'),
      canEdit:   actions.includes('edit'),
      canDelete: actions.includes('delete'),
    };
  } catch {
    return { canView: false, canAdd: false, canEdit: false, canDelete: false };
  }
}
