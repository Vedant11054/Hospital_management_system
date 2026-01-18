export type UserRole = 'super_admin' | 'hospital_admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hospitalId?: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'basic' | 'professional' | 'enterprise';
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RolePermissions {
  canManageHospitals: boolean;
  canManageDoctors: boolean;
  canManagePatients: boolean;
  canViewAllPatients: boolean;
  canAccessBilling: boolean;
  canAccessAnalytics: boolean;
  canConfigureChatbot: boolean;
  canAccessAuditLogs: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    canManageHospitals: true,
    canManageDoctors: true,
    canManagePatients: true,
    canViewAllPatients: true,
    canAccessBilling: true,
    canAccessAnalytics: true,
    canConfigureChatbot: true,
    canAccessAuditLogs: true,
  },
  hospital_admin: {
    canManageHospitals: false,
    canManageDoctors: true,
    canManagePatients: false,
    canViewAllPatients: true,
    canAccessBilling: true,
    canAccessAnalytics: true,
    canConfigureChatbot: true,
    canAccessAuditLogs: true,
  },
  doctor: {
    canManageHospitals: false,
    canManageDoctors: false,
    canManagePatients: false,
    canViewAllPatients: false,
    canAccessBilling: false,
    canAccessAnalytics: false,
    canConfigureChatbot: false,
    canAccessAuditLogs: false,
  },
  patient: {
    canManageHospitals: false,
    canManageDoctors: false,
    canManagePatients: false,
    canViewAllPatients: false,
    canAccessBilling: false,
    canAccessAnalytics: false,
    canConfigureChatbot: false,
    canAccessAuditLogs: false,
  },
};
