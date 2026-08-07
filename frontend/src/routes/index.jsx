import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import { ProtectedRoute } from './ProtectedRoute';

// Componente temporário para validação do fluxo
function Dashboard() {
  return (
    <div className="min-h-screen bg-brandBg p-8 text-brandText">
      <h1 className="text-2xl font-bold">Dashboard - Área Protegida</h1>
    </div>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback de Rota */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}