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

    // api.post - Salvar os dados no backend

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
                <CardContex.Provider key={card.id} value={card}>
                    <FlashcardItem />
                </CardContex.Provider>
            ))}

        {isModalOpen &&
            <div>
                <button onClick={() => setIsModalOpen(false)}>X</button>
                <FlashcardModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)}/>
            </div>}



        {/* <ReviewControls></ReviewControls>
        <FlashcardModal></FlashcardModal> */}
    </div>
    );
}
