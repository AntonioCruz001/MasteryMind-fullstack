import { useState, useEffect, createContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import FlashcardItem from '../../components/FlashcardItem';
import FlashcardModal from '../../components/FlashcardModal';
import Button from '../../components/Button';
import api from '../../services/api';

export const CardContex = createContext([]);

export default function Flashcards() {
    const { subjectId } = useParams()                           // Recebe o subjectId da URL
    const [flashcardsArray, setFlashcardsArray] = useState([]); // Contem o array dos flashcards
    const [reviewedCards, setReviewedCards] = useState({});     // Array apenas com os cards revisados
    const [isModalOpen, setIsModalOpen] = useState(false)       // Controle de abrir o modal
    const [editingCard, setEditingCard] = useState(null)

    // api.get - Busca dos Cards na API 
    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await api.get(`/subjects/${subjectId}/flashcards`);
                const cards = response.data;

                const initialReviewedState = {};
                cards.forEach(card => {
                    if (card.is_reviwed) {
                        initialReviewedState[card.id] = true;
                    }
                });

                setReviewedCards(initialReviewedState);
                setFlashcardsArray(cards);
            } catch (err) {
                console.log('Erro ao buscar flashcards:', err);
            }
        };
        fetchFlashcards()
    }, [subjectId])

    // Ordenar - Revisado para o final
    const sortedFlashcards = useMemo(() => {
        return [...flashcardsArray].sort((a, b) => {
            const aReviewed = reviewedCards[a.id] ? 1 : 0;
            const bReviewed = reviewedCards[b.id] ? 1 : 0;

            return aReviewed - bReviewed; // Não revisados (0) primeiro, revisados (1) ao final
        });
    }, [flashcardsArray, reviewedCards]);

    // api.put e api.post 
    const handleSaveCard = async (cardData) => {
        try {
            if (editingCard) {
                // Atualiza o card - e retorna um único obj JSON no response
                const response = await api.put(`/subjects/${subjectId}/flashcards/${editingCard.id}`, {
                    front: cardData.front,
                    back: cardData.back
                });

                setFlashcardsArray((prev) => (
                    prev.map((card) => (card.id === editingCard.id ? response.data : card))
                ));

                console.log('Atualizado com sucesso', 'response.data: ', response.data, 'response: ', response);

            } else {
                // Cria novo card
                const response = await api.post(`/subjects/${subjectId}/flashcards`, {
                    front: cardData.front,
                    back: cardData.back
                });

                setFlashcardsArray(prevCards => [...prevCards, response.data]);

                console.log('Salvo com sucesso', 'response.data: ', response.data, 'response: ', response);
            }

            setIsModalOpen(false);
            setEditingCard(null);


        } catch (err) {
            console.error('Erro ao salvar o flashcard:', err);
        }
    };

    // Delete - deletar o FC da lista e salvar  os FC atualizados no backend
    // api.delete
    const handleDeleteCard = async (cardId) => {
        const targetId = cardId || editingCard?.id;
        if (!targetId) return;

        try {
            const response = await api.delete(`/subjects/${subjectId}/flashcards/${editingCard.id}`)
            setFlashcardsArray((prev) => (
                prev.filter((card) => (card.id !== targetId))
            ));
            setIsModalOpen(false);
            setEditingCard(null);

            console.log('Excluído com sucesso', 'response.data : ', response.data, 'response:  ', response, 'FlashcardsArray: ', flashcardsArray);

        } catch (err) {
            console.error('Erro ao salvar o flashcard:', err);
        }
    }

    const ctx = {
        subjectId: subjectId,
        setModal: setIsModalOpen,
        setReview: setReviewedCards,
        setEdit: setEditingCard
    }


    console.log('editingCard: ', editingCard);


    return (<div>
        {/* CABEÇALHO */}

        <div className='flex justify-between items-center mb-4'>
            <Link to={'/home/subjects'}>← Voltar</Link>
            <Button onClick={() =>
                setIsModalOpen(true)}
                title={"+ Novo Flashcard"}
                btnType={'criar'}
            />
        </div>

        {/* ARRAY DE FLASHCARDS */}

        {sortedFlashcards.length === 0 ? <div>Nenhum Flashcard encontrado!</div> :
            sortedFlashcards.map((card) => (
                // O value expoxto na prop é o card atual de 'sortedFlashcards'
                <CardContex.Provider key={card.id} value={[card, ctx]}>
                    <FlashcardItem />
                </CardContex.Provider>
            ))}

        {isModalOpen &&
            <div>
                <button onClick={() => setIsModalOpen(false)}>X</button>
                {/* { isOpen, onClose, onSubmit, onDelete, initialData = null } */}
                <FlashcardModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditingCard(null) }}
                    initialData={editingCard}
                    onSubmit={handleSaveCard}
                    onDelete={handleDeleteCard} />
            </div>}
    </div>
    );
}
