import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AuthRequiredProps {
  children: React.ReactNode;
}

export function AuthRequired({ children }: AuthRequiredProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}