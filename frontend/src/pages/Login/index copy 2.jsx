import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'
import { Link } from 'react-router-dom';

import Button from '../../components/Button';


export default function Login() {
    let classesInputs = "border rounded-lg border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-brandPrimary/20 focus:border-brandPrimary transition-all bg-gray-50 text-gray-800 text-sm placeholder:text-gray-400"
    let classesLabels = "text-xs font-bold text-gray-600 uppercase tracking-wide"
    // States

    // HandleSubmit

    return (<>

        <div className="min-h-screen w-full bg-brandBg flex items-center justify-center relative py-16 px-4">
            <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brandPrimary transition-colors z-10">
                ← Voltar para o início
            </Link>

            <div className='w-full max-w-sm bg-brandCard p-8 rounded-2xl shadow-md border border-gray-100 mt-4'>

                <h2 className='text-3xl font-bold text-center text-brandText mb-6'>Login</h2>

                <form method='post' className='flex flex-col gap-5'>

                    <div className="flex flex-col gap-1.5">
                        <label className={classesLabels}>Email</label>
                        <input type="email"
                            className={classesInputs}
                            placeholder="seu@email.com" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={classesLabels}>Senha</label>
                        <input type="password"
                            className={classesInputs}
                            placeholder='........' />
                    </div>

                    <Button type={"submit"}
                        className={"w-full bg-brandPrimary hover:bg-teal-700 text-white font-bold py-3 rounded-lg mt-2 shadow-sm hover:shadow-md transition-all cursor-pointer"}>
                        Entrar
                    </Button>

                    <p className='text-sm text-center text-gray-500 mt-6'>
                        Não tem uma conta? {" "}
                        <Link to={"/cadastro"}
                            className='text-brandPrimary hover:text-teal-700 font-semibold hover:underline transition-colors'
                        >
                            Criar conta aqui
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    </>
    )
}