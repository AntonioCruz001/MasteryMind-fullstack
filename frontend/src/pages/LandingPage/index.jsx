import { Link } from "react-router-dom"

export default function LandingPage() {
    return (
        <section className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-extrabold text-brandText tracking-tight sm:text-5xl mb-6">
                Domine seus estudos com <span className="text-brandPrimary">MasteryMind</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Utilize o poder da repetição espaçada apoiada em algoritmos inteligentes para fixar conteúdos na memória de longo prazo. O método mais eficiente para passar em provas, concursos ou dominar novas tecnologias.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
                <Link to={"/cadastro"} className="w-full sm:w-auto px-8 py-3 bg-brandPrimary hover:bg-teal-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all text-center">Começar Gratuitamente</Link>
                <Link to={"/login"} className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-gray-50 text-brandPrimary font-semibold rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all text-center">Já tenho uma conta</Link>
            </div>
        </section>
    )
}