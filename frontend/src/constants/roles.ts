export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

export type Permission = 
  | 'VIEW_DASHBOARD' 
  | 'MANAGE_BUSINESS' 
  | 'MANAGE_USERS' 
  | 'MANAGE_FLEET' 
  | 'MANAGE_INVENTORY' 
  | 'SYSTEM_ACCESS' 
  | 'VIEW_ACCOUNTING' 
  | 'LEGAL_COMPLIANCE' 
  | 'PROPERTY_MANAGEMENT' 
  | 'VIEW_REPORTS';

export const RolePermissions: Record<string, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    'VIEW_DASHBOARD',
    'MANAGE_BUSINESS',
    'MANAGE_USERS',
    'MANAGE_FLEET',
    'MANAGE_INVENTORY',
    'SYSTEM_ACCESS',
    'VIEW_ACCOUNTING',
    'LEGAL_COMPLIANCE',
    'PROPERTY_MANAGEMENT',
    'VIEW_REPORTS'
  ],
  [UserRole.ADMIN]: [
    'VIEW_DASHBOARD',
    'MANAGE_BUSINESS',
    'MANAGE_FLEET',
    'MANAGE_INVENTORY',
    'VIEW_ACCOUNTING',
    'LEGAL_COMPLIANCE',
    'PROPERTY_MANAGEMENT',
    'VIEW_REPORTS'
  ],
};

export const RoleLabels: Record<string, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ADMIN]: 'Administrator',
};
