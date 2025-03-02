import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AuthRequiredProps {
  children: React.ReactNode;
  exceptions?: string[];
}

export function AuthRequired({ children, exceptions = [] }: AuthRequiredProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user && !exceptions.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}