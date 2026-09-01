import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "./Button";
import FlashcardContent from "./FlashcardContent";
import ReviewControls from "./ReviewControls";

export default function FlashcardItem() {
    const { subjectId } = useParams()
    const [fliped, setFliped] = useState(true);
    const [frontContent, setFrontContent] = useState('');
    const [backContent, setBackContent] = useState('');
    const [cardContent, setCardContent] = useState({ front: "", back: "" });

    const [pontos,setPontos] = useState(0)

    const [flashcardsArray, setFlashcardsArray] = useState([])
    const [reviewedCards, setReviewedCards] = useState({})

    function handleFlipClick() {
        { fliped === false ? setFliped(true) : setFliped(false) }
    }

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
        return [...flashcards].sort((a, b) => {
            const aReviewed = reviewedCards[a.id] ? 1 : 0;
            const bReviewed = reviewedCards[b.id] ? 1 : 0;

            return aReviewed - bReviewed; // Não revisados (0) primeiro, revisados (1) ao final
        });
    }, [flashcardsArray, reviewedCards]);








    return (
        // wrapper
        <div className="rounded-2xl bg-stone-300 shadow-sm flex flex-col gap-4 p-4">
            {/* header */}
            <div className="flex flex-row  px-4">
                <ReviewControls cardPontos={pontos} />
                <Button className="w-6" title={'⚙'} />
            </div>

            {/* frente e verso - conteudo */}
            <FlashcardContent onClick={handleFlipClick} front={frontContent} back={backContent} />

            {/* Botoes */}
            <div>
                {fliped ?
                    <div className="flex flex-row justify-center gap-20 px-16">
                        <Button title={'Errei'} className="" />
                        <Button title={'Acertei'} className="" />
                    </div> : ''}

                {/* Botao excluir sera movido para o modal! */}

                {/* <div className="flex justify-end">
                    <Button title={'Excluir'} className="px-6" />
                </div> */}
            </div>
        </div>
    )
}