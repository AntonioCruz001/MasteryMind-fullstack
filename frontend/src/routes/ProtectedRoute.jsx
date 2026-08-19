import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-brandBg flex items-center justify-center">
        <span className="text-brandText font-medium">Verificando sessão...</span>
      </div>
    );
  }

  // Para teste do subject
  // Retirar comment!!

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}