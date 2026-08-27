import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';

function Subjects() {
    const [subjects, setSubjects] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)

    const navigate = useNavigate();

    const fetchSubjects = async () => {
        try {
            const response = await api.get('/subjects'); // subject -> subjects
            setSubjects(response.data);
        } catch (err) {
            console.log('Erro ao buscar dados:', err);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError('');

        try {
            await api.post('/subjects/', { name, description });
            setName('');
            setDescription('');
            setIsModalOpen(false);
            fetchSubjects();
        } catch (err) {
            setError(err.response?.data?.detail || 'Erro ao cadastrar assunto.');
        } finally {
            setLoading(false);
        }
    };

    const baseInput = "w-full border rounded-lg border-gray-300 p-2.5 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brandPrimary/20 focus:border-brandPrimary transition-all"

    return (
        <div className="flex flex-col gap-6 relative">

            {/* Cabeçalho e Botão de Nova Categoria */}
            <div className="flex justify-between items-center mt-2">
                <h2 className="text-2xl font-bold text-brandText">Categorias</h2>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer"
                >
                    + Nova Categoria
                </Button>
            </div>

            {/* Lista de Categorias (Cards Clicáveis) */}
            <div className="flex flex-col gap-3">
                {subjects.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-10 bg-brandCard rounded-2xl border border-gray-100 shadow-sm">
                        Nenhuma categoria cadastrada. Clique no botão acima para começar!
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {subjects.map((subject) => (
                            <div
                                key={subject.id}
                                onClick={() => navigate(`/home/subjects/${subject.id}/flashcards`)}
                                className="bg-brandCard p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1 cursor-pointer hover:shadow-md hover:border-brandPrimary transition-all group"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg text-brandText group-hover:text-brandPrimary transition-colors">
                                        {subject.name}
                                    </span>
                                    <span className="text-brandPrimary opacity-0 group-hover:opacity-100 transition-opacity">
                                        ➔
                                    </span>
                                </div>
                                {subject.description && (
                                    <span className="text-sm text-gray-500 line-clamp-2">{subject.description}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Cadastro (Popup) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-brandCard p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative">

                        {/* Botão de Fechar o Modal */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-brandText mb-4">Nova Categoria</h2>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nome da categoria (ex: Informática, Inglês...)"
                                    className={baseInput}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <textarea
                                    placeholder="Descrição (opcional)"
                                    className={`${baseInput} resize-none h-24`}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 mt-2">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2.5 rounded-lg transition-all text-sm cursor-pointer"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg shadow-sm transition-all text-sm cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? 'Criando...' : 'Criar Categoria'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Subjects
