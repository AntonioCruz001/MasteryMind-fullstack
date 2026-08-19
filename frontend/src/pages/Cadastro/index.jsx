import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import api from '../../services/api'

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validação local do formato do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Formato inválido de e-mail');
            return;
        }

        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        setIsSubmitting(true)

        try {
            // Envio do payload para o endpoint FastAPI
            await api.post('/users', {
                name: nome,
                email: email,
                password: senha
            })

            // Redireciona para a tela de login após o cadastro com sucesso
            navigate('/login');
        }catch (err) {
            // Tratamento caso o FastAPI retorne erro 422 em formato de array do Pydantic
            if (err.response?.status === 442) {
                setError('Formato inválido de e-mail ou dados incoretos.');
            }else {
                setError(
                    typeof err.response?.data?.detail === 'string' ? err.response.data.detail : 'Erro ao realizar cadastro. Tente novamente.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };



    let baseInput = "peer w-full border rounded-lg border-gray-300 pt-5 pb-1.5 px-3 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brandPrimary/20 focus:border-brandPrimary transition-all placeholder-transparent"
    let baseLabel = "absolute left-3 top-1 text-xs font-semibold text-gray-400 transition-all cursor-text pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:font-normal peer-focus:top-1 peer-focus:text-xs peer-focus:text-brandPrimary peer-focus:font-semibold"

    return (
        <div className="min-h-screen w-full bg-brandBg flex justify-center items-start pt-6 md:pt-10 px-4">

            <div className="w-full max-w-sm flex flex-col gap-3">

                <Link
                    to="/"
                    className="flex items-center gap-1.5 text-xs font-semibold 
                    tracking-wide text-gray-400 hover:text-brandPrimary transition-colors self-start"
                >
                    ← Voltar para o início
                </Link>

                <div className='w-full bg-brandCard p-6 rounded-2xl shadow-md border border-gray-100'>

                    <h2 className='text-2xl font-bold text-center text-brandText mb-6'>Novo Cadastro</h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                        {/* Bloco: Nome */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                id="nome"
                                placeholder=" "
                                className={baseInput}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                            <label
                                htmlFor="nome"
                                className={baseLabel}
                            >
                                Nome completo
                            </label>
                        </div>

                        {/* Bloco: Email */}
                        <div className="relative w-full">
                            <input
                                type="email"
                                id="email"
                                placeholder=" "
                                className={baseInput}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label
                                htmlFor="email"
                                className={baseLabel}
                            >
                                E-mail
                            </label>
                        </div>

                        {/* Bloco: Senha */}
                        <div className="relative w-full">
                            <input
                                type="password"
                                id="senha"
                                placeholder=" "
                                className={baseInput}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                            <label
                                htmlFor="senha"
                                className={baseLabel}
                            >
                                Senha
                            </label>
                        </div>

                        {/* Bloco: Confirmar Senha */}
                        <div className="relative w-full">
                            <input
                                type="password"
                                id="confirmar-senha"
                                placeholder=" "
                                className={baseInput}
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required
                            />
                            <label
                                htmlFor="confirmar-senha"
                                className={baseLabel}
                            >
                                Digite a senha novamente
                            </label>
                        </div>

                        <Button type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg mt-1 shadow-sm transition-all cursor-pointer text-sm">
                            {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
                        </Button>

                        <p className='text-sm text-center text-gray-500 mt-1'>
                            Já possui uma conta? {" "}
                            <Link to="/login" className='text-brandPrimary hover:text-teal-700 font-semibold hover:underline transition-colors'>
                                Entrar aqui
                            </Link>
                        </p>
                    </form>
                </div>

            </div>
        </div>
    )
}