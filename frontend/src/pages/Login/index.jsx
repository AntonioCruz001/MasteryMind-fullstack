import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const baseInput = "peer w-full border rounded-lg border-gray-300 pt-5 pb-1.5 px-3 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brandPrimary/20 focus:border-brandPrimary transition-all placeholder-transparent";
  const baseLabel = "absolute left-3 top-1 text-xs font-semibold text-gray-400 transition-all cursor-text pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:font-normal peer-focus:top-1 peer-focus:text-xs peer-focus:text-brandPrimary peer-focus:font-semibold";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/home/subjects');
    } catch (err) {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-brandBg flex justify-center items-start pt-6 md:pt-10 px-4">
      <div className="w-full max-w-sm flex flex-col gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-400 hover:text-brandPrimary transition-colors self-start"
        >
          ← Voltar para o início
        </Link>

        <div className="w-full bg-brandCard p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-brandText mb-6">Login</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative w-full">
              <input
                type="email"
                id="email"
                className={baseInput}
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email" className={baseLabel}>
                Email
              </label>
            </div>

            <div className="relative w-full">
              <input
                type="password"
                id="password"
                className={baseInput}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password" className={baseLabel}>
                Senha
              </label>
            </div>

            <Button
              type="submit"
              title={isSubmitting ? 'Autenticando...' : 'Entrar'}
              disabled={isSubmitting}
              btnType={'criar'}
            />

            <p className="text-sm text-center text-gray-500 mt-6">
              Não tem uma conta?{' '}
              <Link
                to="/cadastro"
                className="text-brandPrimary hover:text-teal-700 font-semibold hover:underline transition-colors"
              >
                Criar conta aqui
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}