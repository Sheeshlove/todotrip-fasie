
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAuth?: boolean;
  roles?: string[];
}

/**
 * ProtectedRoute - A component that protects routes requiring authentication
 * and optionally specific roles.
 * 
 * @param children - The components to render if authentication passes
 * @param requiredAuth - Whether authentication is required (defaults to true)
 * @param roles - Optional array of roles allowed to access the route
 */
export function ProtectedRoute({ 
  children,
  requiredAuth = true,
  roles = []
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, user, profile } = useAuth();
  const location = useLocation();
  const [verifyingSession, setVerifyingSession] = useState(true);

  useEffect(() => {
    // Verify session is valid, using a short timeout to avoid flash
    const sessionCheckTimeout = setTimeout(() => {
      setVerifyingSession(false);
    }, 500);

    return () => clearTimeout(sessionCheckTimeout);
  }, [isAuthenticated]);

  // Show loading state
  if (loading || verifyingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-todoYellow" />
        <p className="mt-4 text-sm text-todoLightGray">Проверка доступа...</p>
      </div>
    );
  }

  // If auth is required and user is not authenticated, redirect to login
  if (requiredAuth && !isAuthenticated) {
    // Pass the current location to redirect back after login
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If user is authenticated but route requires specific roles
  if (requiredAuth && isAuthenticated && roles.length > 0) {
    // Check if user has any of the required roles
    const userRoles = profile?.roles || [];
    const hasRequiredRole = roles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      // User doesn't have the required role, redirect to unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If user is authenticated and route requires no auth, redirect to home
  if (!requiredAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
}

export default ProtectedRoute;
