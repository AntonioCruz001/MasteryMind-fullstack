import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { isTokenExpired } from '../functions/token';

export function ProtectedRoute({ children }) {
  const { user, loading, logout } = useContext(AuthContext);
  const token = localStorage.getItem('@Memorizer:token');
  const expired = !token || isTokenExpired(token);

  useEffect(() => {
    if (user && expired) {
      logout();
    }
  }, [user, expired, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brandBg flex items-center justify-center">
        <span className="text-brandText font-medium">Verificando sessão...</span>
      </div>
    );
  }

  if (!user || expired) {
    return <Navigate to="/login" replace />;
  }

  return children;
}