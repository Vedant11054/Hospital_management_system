import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** The role required to access this route */
  requiredRole: UserRole;
}

const ROLE_DASHBOARD: Record<UserRole, string> = {
  super_admin:    '/super-admin',
  hospital_admin: '/hospital-admin',
  doctor:         '/doctor',
  patient:        '/patient',
};

/**
 * - If not authenticated → redirect to /login
 * - If authenticated but wrong role → redirect to their correct dashboard
 * - Otherwise render children
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // While hydrating from localStorage, show nothing (avoids flash of redirect)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== requiredRole) {
    return <Navigate to={ROLE_DASHBOARD[user.role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
