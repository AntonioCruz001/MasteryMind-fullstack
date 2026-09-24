import { useState, useEffect, createContext, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import FlashcardItem from '../../components/flashcards/FlashcardItem';
import FlashcardModal from '../../components/flashcards/FlashcardModal';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import backIcon from '../../assets/navigation/back.svg';

export const CardContex = createContext([]);

export default function Flashcards() {
    const { subjectId } = useParams()                           // Recebe o subjectId da URL
    const [flashcardsArray, setFlashcardsArray] = useState([]); // Contem o array dos flashcards
    const [reviewedCards, setReviewedCards] = useState({});     // Array apenas com os cards revisados
    const [isModalOpen, setIsModalOpen] = useState(false)       // Controle de abrir o modal
    const [editingCard, setEditingCard] = useState(null)        // Card atual que está sendo editado ou apagado
    const [responseCard, setResponseCard] = useState()
    const [teste, setTeste] = useState('Teste de contexto!')
    const [erroInicial, setErroInicial] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date())
    console.log('responseCard', responseCard);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 10000);
        return () => clearInterval(timer);
    }, [])

    // api.get - Busca dos Cards na API 
    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await api.get(`/subjects/${subjectId}/flashcards`);
                const cards = response.data;

                const initialReviewedState = {};
                cards.forEach(card => {
                    if (card.is_reviewed) {
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
    // useMemo para manter o resultado do sort e não ter que refazer a cada render
    const sortedFlashcards = useMemo(() => {
        return [...flashcardsArray].sort((a, b) => {

            // Um card está disponível se não tem data de revisão, se a data já passou
            const aAvailable = (!a.next_review_date || new Date(a.next_review_date) <= currentTime);
            const bAvailable = (!b.next_review_date || new Date(b.next_review_date) <= currentTime);

            const aVal = aAvailable ? 0 : 1; // 0 para o topo, 1 para o final
            const bVal = bAvailable ? 0 : 1;

            return aVal - bVal;
        });
    }, [flashcardsArray, reviewedCards, currentTime]);

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

    const handleReview = async (cardId, resultado) => {
        if (!cardId) return;

        const isFirstMistake = reviewedCards[cardId] === undefined && resultado === 'erro';
        console.log('isFirstMistake: ', isFirstMistake);

        if (isFirstMistake) {
            setErroInicial(true);
        } else if (!isFirstMistake && erroInicial) {
            setErroInicial(false);
        }

        try {
            const response = await api.post(`/subjects/${subjectId}/flashcards/${cardId}/review`,
                { result: resultado, firstMistake: isFirstMistake }
            )
            const cardUpdated = response.data;

            setFlashcardsArray((prev) => (
                prev.map((card) => card.id === cardId ? cardUpdated : card)
            ))

            // Criar condição para não permitir no primeiro erro.
            if (!isFirstMistake) {
                setReviewedCards((prev) => ({ ...prev, [cardId]: true }))
            }

            console.log('Card atualizado: ', cardUpdated);
        } catch (error) {
            console.log('Erro ao revisar o card: ', error);
        }
    }

    console.log('reviewedCards', reviewedCards, 'erroInicial? :', erroInicial);


    const ctx = {
        subjectId: subjectId,
        setModal: setIsModalOpen,
        setReview: setReviewedCards,
        setEdit: setEditingCard,
        reviewCard: handleReview,
        responseCardObj: responseCard,
        testeContext: teste,
        currentTime: currentTime
    }

    console.log('editingCard: ', editingCard);

    return (<div>
        {/* CABEÇALHO */}

        <div className='flex justify-between items-center mb-4 gap-3 w-full'>

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
                    onClose={() => { setIsModalOpen(false); setEditingCard(null) }} />
            </div>}
    </div>
    );
}
