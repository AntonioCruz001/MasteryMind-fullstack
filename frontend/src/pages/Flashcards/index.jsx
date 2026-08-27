import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';

export default function Flashcards() {
    const { subjectId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [flippedCards, setFlippedCards] = useState({});
    const [reviewedCards, setReviewedCards] = useState({}); // Controla quais cards foram revisados e seus feedbacks

    const fetchFlashcards = async () => {
        try {
            const response = await api.get(`/subjects/${subjectId}/flashcards`);
            // Ordena mantendo os não revisados no topo e os revisados embaixo
            const sortedCards = response.data.sort((a, b) => {
                const aReviewed = reviewedCards[a.id] !== undefined ? 1 : 0;
                const bReviewed = reviewedCards[b.id] !== undefined ? 1 : 0;
                return aReviewed - bReviewed;
            });
            setFlashcards(sortedCards);
        } catch (err) {
            console.log('Erro ao buscar flashcards:', err);
        }
    };

    useEffect(() => {
        fetchFlashcards();
    }, [subjectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!front.trim() || !back.trim()) return;

        setLoading(true);
        setError('');

        try {
            await api.post(`/subjects/${subjectId}/flashcards`, { front, back });
            setFront('');
            setBack('');
            setIsModalOpen(false);
            fetchFlashcards();
        } catch (err) {
            setError(err.response?.data?.detail || 'Erro ao cadastrar flashcard.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (flashcardId) => {
        try {
            await api.delete(`/subjects/${subjectId}/flashcards/${flashcardId}`);
            fetchFlashcards();
        } catch (err) {
            console.log('Erro ao excluir flashcard.', err);
        }
    };

    const toggleFlip = (id) => {
        setFlippedCards((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Lógica de revisão atualizada para reorganizar o array mantendo os revisados por último
    const handleReview = (cardId, result) => {
        setReviewedCards((prev) => ({
            ...prev,
            [cardId]: result 
        }));

        setFlashcards((prevCards) => {
            const updatedCards = prevCards.map(card => 
                card.id === cardId ? { ...card, isReviewed: true } : card
            );
            
            // Reordena: não revisados primeiro (0), revisados por último (1)
            return updatedCards.sort((a, b) => {
                const aRev = (a.id === cardId || reviewedCards[a.id] !== undefined) ? 1 : 0;
                const bRev = (b.id === cardId || reviewedCards[b.id] !== undefined) ? 1 : 0;
                return aRev - bRev;
            });
        });
    };

    const baseInput = "w-full border rounded-lg border-gray-300 p-2.5 text-sm bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brandPrimary/20 focus:border-brandPrimary transition-all resize-none h-24";

    return (
        <div className="flex flex-col gap-6 relative pb-10">
            <div className="flex items-center justify-between mt-2">
                <Link
                    to="/home/subjects"
                    className="text-xs font-semibold text-gray-400 hover:text-brandPrimary transition-colors"
                >
                    ← Voltar para Categorias
                </Link>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brandPrimary hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all text-sm cursor-pointer"
                >
                    + Novo Flashcard
                </Button>
            </div>

            <h2 className="text-2xl font-bold text-brandText">Modo de Estudo / Flashcards</h2>

            <div className="flex flex-col gap-3">
                {flashcards.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-10 bg-brandCard rounded-2xl border border-gray-100 shadow-sm">
                        Nenhum flashcard cadastrado neste assunto. Crie o primeiro agora!
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {flashcards.map((card) => {
                            const isFlipped = flippedCards[card.id] || false;
                            const isReviewed = reviewedCards[card.id] !== undefined || card.is_reviewed;

                            return (
                                <div
                                    key={card.id}
                                    className={`bg-brandCard p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative group transition-all ${
                                        isReviewed ? 'bg-gray-100 opacity-75 border-gray-300' : ''
                                    }`}
                                >
                                    {/* Card Interativo de Estudo (Flip) */}
                                    <div
                                        onClick={() => toggleFlip(card.id)}
                                        className={`min-h-[140px] p-5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all select-none ${
                                            isReviewed 
                                                ? 'bg-gray-200 border-gray-300 text-gray-500' 
                                                : 'bg-gray-50 hover:bg-teal-50/30 border-gray-200'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-brandPrimary uppercase tracking-wider">
                                                {isFlipped ? 'Verso (Resposta)' : 'Frente (Pergunta)'}
                                            </span>
                                            <span className="text-xs text-gray-400 group-hover:text-brandPrimary">
                                                Clique para virar 🔄
                                            </span>
                                        </div>

                                        <div className="py-4 text-center">
                                            <p className="text-base font-medium text-brandText">
                                                {isFlipped ? card.back : card.front}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-[11px] text-gray-400 italic">
                                                {isFlipped ? 'Exibindo a resposta' : 'Exibindo a pergunta'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Feedback e Botões de Ação de Revisão */}
                                    {isFlipped && (
                                        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 animate-fade-in">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-brandPrimary">
                                                    {isReviewed ? `Revisado! Status: ${reviewedCards[card.id]}` : 'Como foi sua memorização?'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleReview(card.id, 'erro')}
                                                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer"
                                                >
                                                    Errei / Difícil
                                                </Button>
                                                <Button
                                                    onClick={() => handleReview(card.id, 'acerto')}
                                                    className="flex-1 bg-teal-100 hover:bg-teal-200 text-teal-800 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer"
                                                >
                                                    Acertei / Fácil
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span className="text-xs text-gray-400">ID do card: #{card.id}</span>
                                        <button
                                            onClick={() => handleDelete(card.id)}
                                            className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer transition-colors"
                                        >
                                            Excluir card
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-brandCard p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-brandText mb-4">Novo Flashcard</h2>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Frente (Pergunta)</label>
                                <textarea
                                    placeholder="O que é...?"
                                    className={baseInput}
                                    value={front}
                                    onChange={(e) => setFront(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Verso (Resposta)</label>
                                <textarea
                                    placeholder="É definido como..."
                                    className={baseInput}
                                    value={back}
                                    onChange={(e) => setBack(e.target.value)}
                                    required
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
                                    {loading ? 'Salvando...' : 'Salvar Flashcard'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}