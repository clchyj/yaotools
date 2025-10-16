import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../lib/store'

interface PrivateRouteProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
  requiredRoles?: string[]
}

export const PrivateRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login',
  requiredRoles
}: PrivateRouteProps) => {
  const { user, userProfile, loading } = useAuthStore()
  const location = useLocation()

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect to login if auth required but user not authenticated
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check role requirements
  if (requiredRoles && user && userProfile) {
    const hasRequiredRole = requiredRoles.includes(userProfile.role)
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />
    }
  }

  // Redirect authenticated users away from auth pages
  if (!requireAuth && user && (location.pathname === '/login' || location.pathname === '/register')) {
    const from = location.state?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}

// Convenience component for admin routes
interface AdminRouteProps {
  children: ReactNode
  requireSuperAdmin?: boolean
}

export const AdminRoute = ({ children, requireSuperAdmin = false }: AdminRouteProps) => {
  const { user, userProfile, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user has required admin role
  const userRole = userProfile?.role
  const hasAccess = requireSuperAdmin 
    ? userRole === 'super_admin'
    : userRole === 'admin' || userRole === 'super_admin'
    
  if (!hasAccess) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
