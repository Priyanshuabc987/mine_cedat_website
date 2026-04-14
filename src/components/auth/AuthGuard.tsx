import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ children, requireAdmin = false, redirectTo = '/login' }: AuthGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setLocation(redirectTo);
        return;
      }

      if (requireAdmin && user && !user.is_admin) {
        setLocation('/');
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requireAdmin, redirectTo, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && user && !user.is_admin) {
    return null;
  }

  return <>{children}</>;
}


