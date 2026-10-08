import { useState, useEffect, createContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import FlashcardItem from '../../components/flashcards/FlashcardItem';
import FlashcardModal from '../../components/flashcards/FlashcardModal';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import backIcon from '../../assets/navigation/back.svg';
// import { fetchFlashcards } from '../../functions/fetchFlashcards';

export const CardContex = createContext([]);

export default function Flashcards() {
    const { subjectId } = useParams()                           // Recebe o subjectId da URL
    const [flashcardsArray, setFlashcardsArray] = useState([]); // Contem o array dos flashcards
    const [isModalOpen, setIsModalOpen] = useState(false)       // Controle de abrir o modal
    const [editingCard, setEditingCard] = useState(null)        // Card atual que está sendo editado ou apagado
    const [currentTime, setCurrentTime] = useState(new Date())

    console.log('edit card', editingCard);


    // state para resetar o card para o level 0 a partir do level 4
    const [reset_card, setReset_card] = useState(false)

    useEffect(() => {
        // mudei de 10000 para 5000
        const timer = setInterval(() => setCurrentTime(new Date()), 5000);
        return () => clearInterval(timer);
    }, [])

    // api.get - Busca dos Cards na API 
    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await api.get(`/subjects/${subjectId}/flashcards`);
                const cards = response.data;

                if (setFlashcardsArray) (setFlashcardsArray(cards))
                if (subjectId && !setFlashcardsArray) {
                    return cards
                }

            } catch (err) {
                console.log('Erro ao buscar flashcards:', err);
            }
        };
        fetchFlashcards()
    }, [subjectId])

    // Ordenar - Revisado para o final
    // useMemo para manter o resultado do sort e não ter que refazer a cada render
    const sortedFlashcards = useMemo(() => {
        return [...flashcardsArray].sort((a, b) => {

            const isAvailable = (card) => {
                if (card.status === 'MASTERED') return false;
                if (!card.next_review_date) return true;
                return new Date(card.next_review_date) <= currentTime;
            };

            const aAvailable = isAvailable(a);
            const bAvailable = isAvailable(b);

            if (aAvailable === bAvailable) return 0;
            return aAvailable ? -1 : 1;
        });
    }, [flashcardsArray, currentTime]);

    // api.put (update) e api.post (create) 
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


            } else {
                // Cria novo card
                const response = await api.post(`/subjects/${subjectId}/flashcards`, {
                    front: cardData.front,
                    back: cardData.back
                });

                setFlashcardsArray(prevCards => [...prevCards, response.data]);

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

        } catch (err) {
            console.error('Erro ao salvar o flashcard:', err);
        }
    }

    const handleReview = async (cardId, resultado) => {
        if (!cardId) return;

        try {
            const response = await api.post(`/subjects/${subjectId}/flashcards/${cardId}/review`,
                { result: resultado }
            )
            const cardUpdated = response.data;

            setFlashcardsArray((prev) => (
                prev.map((card) => card.id === cardId ? cardUpdated : card)
            ))

        } catch (error) {
            console.log('Erro ao revisar o card: ', error);
        }
    }

    const handleResetCard = async (cardId) => {
        console.log("Acionou handleResetCard", cardId)
        if (!cardId) return

        try {
            const response = await api.put(`/subjects/${subjectId}/flashcards/${cardId}/reset`, {})
            const resetedCard = response.data

            setFlashcardsArray((prev) => (
                prev.map((card) => card.id === cardId ? resetedCard : card)
            ))
        } catch (error) {
            console.log('Erro ao resetar o card: ', error);
        }
    }

    const ctx = {
        subjectId: subjectId,
        setModal: setIsModalOpen,
        setEdit: setEditingCard,
        setReset_card: setReset_card,
        reviewCard: handleReview,
        currentTime: currentTime
    }


    return (<div>
        {/* CABEÇALHO */}

        <div className='flex justify-between items-center mb-4 gap-3 w-full '>

            <Link
                to={'/home/subjects'}
                className='flex items-center justify-center
              gap-2 px-8 sm:px-4 py-2.5 
              bg-brandCard border border-brandBorder shadow-xs rounded-xl 
              text-brandText fontmedium text-sm
              hover:bg-[#d4dddf] active:scale-95 transition-all shrink-0 select-none
              '>
                <img className='w-6 h-6 object-contain pointer-events-none' src={backIcon} alt="back" />
            </Link>

            <Button onClick={() =>
                setIsModalOpen(true)}
                title={"+ Novo Flashcard"}
                btnType={'criar'}
            />
        </div>

        {/* ARRAY DE FLASHCARDS */}

        <div className='flex flex-col gap-3'>
            {sortedFlashcards.length === 0 ? <div>Nenhum Flashcard encontrado!</div> :
                sortedFlashcards.map((card) => (
                    // O value expoxto na prop é o card atual de 'sortedFlashcards'
                    <CardContex.Provider key={card.id} value={[card, ctx]}>
                        <FlashcardItem />
                    </CardContex.Provider>
                ))}
        </div>

        {isModalOpen &&
            <div>
                <button onClick={() => setIsModalOpen(false)}>X</button>
                {/* { isOpen, onClose, onSubmit, onDelete, initialData = null } */}
                <FlashcardModal
                    isOpen={isModalOpen}
                    initialData={editingCard}
                    onSubmit={handleSaveCard}
                    onDelete={handleDeleteCard}
                    onReset={handleResetCard}
                    onClose={() => { setIsModalOpen(false); setEditingCard(null) }} />
            </div>}
    </div>
    );
}
