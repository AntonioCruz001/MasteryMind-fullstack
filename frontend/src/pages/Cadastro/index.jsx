import './Cadastro.css'

export default function Cadastro() {
    return (
        <>
            <div className="cadastro_container">
                <div className="cadastro_wrapper">
                    <h1>Novo Cadastro</h1>
                    <form method="">
                        <label>Nome</label>
                        <input type="text" />

                        <label>Email</label>
                        <input type="email" />

                        <label>Senha</label>
                        <input type="text" />

                        <label htmlFor="">Digite a senha novamente</label>
                        <input type="text" />
                    </form>
                </div>
            </div>
        </>
    )
}