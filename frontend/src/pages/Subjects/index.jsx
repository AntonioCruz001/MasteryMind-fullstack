import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSubjects } from '../../hooks/useSubjects';
import api from '../../services/api';
import Button from '../../components/ui/Button'
import SubjectModal from '../../components/subjects/SubjectModal';
import edit_gear from '../../assets/edit/edit_gear.svg';

export default function Subjects() {
    const { subjects, setSubjects, loading, setLoading } = useSubjects()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSubject, setEditingSubject] = useState(null);

    const [error, setError] = useState('')

    const navigate = useNavigate();

    const handleSaveSubject = async (subjectData) => {
        setError('');
        try {
            if (editingSubject) {
                const response = await api.put(`/subjects/${editingSubject.id}`, subjectData);
                setSubjects(prev => prev.map(s => s.id == editingSubject.id ? response.data : s));
            } else {
                const response = await api.post('/subjects/', subjectData);
                setSubjects(prev => [...prev, response.data]);
            }

            setIsModalOpen(false);
            setEditingSubject(null);
        } catch (error) {
            setError(err.response?.data?.detail || 'Erro ao salvar categoria.');
        }
    }

    const handleDeleteSubject = async (subjectId) => {
        try {
            await api.delete(`/subjects/${subjectId}`);
            setSubjects(prev => prev.filter(s => s.id != subjectId));
            setIsModalOpen(false);
            setEditingSubject(null);
        } catch (error) {
            console.error('Erro ao excluir assunto:', err);
        }
    }

    const baseInput = "w-full border rounded-lg border-gray-300 p-2.5 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brandPrimary/20 focus:border-brandPrimary transition-all"

    return (
        <div className="flex flex-col gap-6 relative">

            {/* Cabeçalho e Botão de Nova Categoria */}
            <div className="flex justify-between items-center mt-2">
                <h2 className="text-2xl font-bold text-brandText">Categorias</h2>
                <Button
                    onClick={() => { setEditingSubject(null); setIsModalOpen(true) }}
                    title={"+ Nova Categoria"}
                    btnType={'criar'}
                // className="bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer"
                />
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Lista de Categorias (Cards Clicáveis) */}
            <div className="flex flex-col gap-3">
                {loading ? (<div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-8 h-8 border-3 border-brandPrimary border-t-transparent rounded-full animate-spin" />
                    <span className="text-stone-500 text-sm font-medium">Carregando Categorias...</span>
                </div>)
                    : subjects.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-10 bg-brandCard rounded-2xl border border-gray-100 shadow-sm">
                            Nenhuma categoria cadastrada. Clique no botão acima para começar!
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {subjects.map((subject) => (
                                <div
                                    key={subject.id}
                                    onClick={() => navigate(`/home/subjects/${subject.id}/flashcards`)}
                                    className="flex flex-col gap-1 bg-brandCard p-5 rounded-2xl shadow-sm border border-gray-100  cursor-pointer hover:shadow-md hover:border-brandPrimary transition-all group"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg text-brandText group-hover:text-brandPrimary transition-colors">
                                            {subject.name}
                                        </span>

                                        <Button btnType="gear" className="w-6 flex justify-center items-center" onClick={(e) => (setEditingSubject(subject), setIsModalOpen(true), e.stopPropagation())} />


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
            <SubjectModal
                isOpen={isModalOpen}
                initialData={editingSubject}
                onSubmit={handleSaveSubject}
                onDelete={handleDeleteSubject}
                onClose={() => { setIsModalOpen(false); setEditingSubject(null); }}
            />

        </div>
    )
};

