
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { authState } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em]" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated || !authState.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is provided and the user's role is not included, redirect to unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(authState.user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
