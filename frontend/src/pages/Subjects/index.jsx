import { useState, useEffect } from "react";
import api from '../../services/api'
import Button from '../../components/Button';
// import "./Subjects.css"

function Subjects() {
    const [subjects, setSubjects] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Busca os assuntos do usuário autenticado
    const fetchSubjects = async () => {
        try {
            const response = await api.get('/subjects/');
            setSubjects(response.data);
        } catch (err) {
            console.error('Erro ao buscar dados:', err);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    // Cadastro de novos assuntos
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError('');

        try {
            await api.post('/subjects/', {
                name,
                description
            });
            setName('');
            setDescription('');
            fetchSubjects(); // Recarregar a lista
        } catch (err) {
            setError(err.response?.data?.detail || 'Erro ao cadastrar assunto.');
        } finally {
            setLoading(false);
        }
    };

    const baseInput = "w-full border rounded-lg border-gray-300 p-2.5 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brandPrimary/20 focus:border-brandPrimary transition-all"

    return (
        <div className="flex flex-col gap-6">

            {/* container novos assuntos */}
            <div className="bg-brandCard p-5 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-brandText mb-4">Novo Assunto</h2>
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <input
                            type="text"
                            placeholder="Nome do assunto (ex: Javascript, Python...)"
                            className={baseInput}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <textarea
                            placeholder="Descrição (opcional)"
                            className={`${baseInput} resize-none h-20`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg shadow-sm transition-all text-sm cursor-pointer disabled:opacity-50 "
                    >
                        {loading ? 'Adicionando...' : 'Cadastrar Assunto'}
                    </Button>
                </form>
            </div>

            {/* Container Meus Assuntos */}
            <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold text-brandText">Meus Assuntos</h2>

                {subjects.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Nenhum assunto cadastrado ainda.</p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {subjects.map((subject) => (
                            <li key={subject.id} className="bg-brandCard p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1">
                                <span className="font-bold text-brandText">{subject.name}</span>
                                {subject.description && (
                                    <span className="text-sm text-gray-600">{subject.description}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    )
}

export default Subjects