'use client';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ 
  children, 
  requireLibrarian = false 
}: { 
  children: React.ReactNode;
  requireLibrarian?: boolean;
}) {
  const { isAuthenticated, isLibrarian, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) router.push('/login');
      if (requireLibrarian && !isLibrarian) router.push('/browse');
    }
  }, [isAuthenticated, isLibrarian, loading, requireLibrarian, router]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}