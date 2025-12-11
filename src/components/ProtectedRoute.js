'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        console.log('🚫 No user found, redirecting to login');
        router.push('/auth/login');
        return;
      }

      console.log('👤 Current user:', user);
      console.log('🔒 Allowed roles:', allowedRoles);

      // Check role authorization if roles are specified
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log('⚠️ User role not authorized, redirecting...');
        
        // Redirect to appropriate dashboard based on role
        if (user.role === 'LIBRARIAN') {
          router.push('/librarian/dashboard');
        } else {
          router.push('/user/dashboard');
        }
      } else {
        console.log('✅ User authorized for this route');
      }
    }
  }, [user, loading, allowedRoles, router]);

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  // User is authenticated and authorized
  return <>{children}</>;
}