import { Link } from 'react-router-dom'
import Button from '../../components/Button'

export default function Cadastro() {

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

                    <form method='post' className='flex flex-col gap-4'>

                        {/* Bloco: Nome */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                id="nome"
                                placeholder=" "
                                className={baseInput}
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
                            />
                            <label
                                htmlFor="confirmar-senha"
                                className={baseLabel}
                            >
                                Digite a senha novamente
                            </label>
                        </div>

                        <Button type="submit" className="w-full bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg mt-1 shadow-sm transition-all cursor-pointer text-sm">
                            Criar Conta
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