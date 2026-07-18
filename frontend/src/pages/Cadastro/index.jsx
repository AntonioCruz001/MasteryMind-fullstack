import './Cadastro.css'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'

export default function Cadastro() {

    let classesInputs = "border rounded-lg border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-brandPrimary/20 focus:border-brandPrimary transition-all bg-gray-50 text-gray-800"

    return (
        <>
            <div className="min-h-screen w-full bg-brandBg flex items-center justify-center relative p-4">
                <Link
                    to={"/"}
                    className={"absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brandPrimary transition-colors"}
                >← Voltar para o início</Link>
                <div className='w-full max-w-md bg-brandCard p-8 rounded-2xl shadow-md border border-gray-100'>

                    <h2 className='text-3xl font-bold text-center text-brandText mb-6'>Novo Cadastro</h2>

                    <form method='post' className='flex flex-col gap-4'>
                        <label>Nome</label>
                        <input type="text" className={classesInputs} placeholder="Nome"/>

                        <label>Email</label>
                        <input type="email" className={classesInputs} placeholder="seu@email.com"/>

                        <label>Senha</label>
                        <input type="password" className={classesInputs} placeholder="........"/>

                        <label htmlFor="">Digite a senha novamente</label>
                        <input type="password" className={classesInputs} placeholder="........"/>

                        <Button type={"submit"} className={"w-full bg-brandPrimary hover:bg-teal-700 text-white font-bold py-3 rounded-lg mt-2 shadow-sm hover:shadow-md transition-all cursor-pointer"}>
                            Entrar
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}