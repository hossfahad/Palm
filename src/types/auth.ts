export const UserRole = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ADVISOR: 'advisor',
  CLIENT: 'client',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface UserPermissions {
  canManageUsers: boolean;
  canManageRoles: boolean;
  canViewAnalytics: boolean;
  canManageDAFs: boolean;
  canApproveGrants: boolean;
  canViewDocuments: boolean;
}

export const rolePermissions: Record<UserRole, UserPermissions> = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canManageRoles: true,
    canViewAnalytics: true,
    canManageDAFs: true,
    canApproveGrants: true,
    canViewDocuments: true,
  },
  [UserRole.MANAGER]: {
    canManageUsers: false,
    canManageRoles: false,
    canViewAnalytics: true,
    canManageDAFs: true,
    canApproveGrants: true,
    canViewDocuments: true,
  },
  [UserRole.ADVISOR]: {
    canManageUsers: false,
    canManageRoles: false,
    canViewAnalytics: true,
    canManageDAFs: true,
    canApproveGrants: false,
    canViewDocuments: true,
  },
  [UserRole.CLIENT]: {
    canManageUsers: false,
    canManageRoles: false,
    canViewAnalytics: false,
    canManageDAFs: false,
    canApproveGrants: false,
    canViewDocuments: true,
  },
};

export interface AuthUser {
  id: string;
  role: UserRole;
  permissions: UserPermissions;
  sessionExpiry: number;
  failedLoginAttempts: number;
  requiresPasswordReset: boolean;
  has2FAEnabled: boolean;
} 