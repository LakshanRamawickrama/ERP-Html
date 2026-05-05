export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  COMPANY_ADMIN = 'Company Admin',
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

export const RolePermissions: Record<UserRole, Permission[]> = {
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
  [UserRole.COMPANY_ADMIN]: [
    'VIEW_DASHBOARD',
    'MANAGE_BUSINESS',
    'MANAGE_FLEET',
    'MANAGE_INVENTORY',
    'VIEW_ACCOUNTING',
    'LEGAL_COMPLIANCE',
    'PROPERTY_MANAGEMENT',
    'VIEW_REPORTS'
    // Company Admin cannot manage users or system access based on legacy auth.js
  ],
};
