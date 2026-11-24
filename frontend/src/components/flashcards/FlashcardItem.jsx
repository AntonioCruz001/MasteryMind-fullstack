import { useContext, useState, useEffect, useRef } from "react";
import { CardContex } from "../../pages/Flashcards";
import Button from "../ui/Button";
import FlashcardContent from "./FlashcardContent";
import ReviewControls from "./ReviewControls";
import { getFeedbackMessage } from "../../functions/reviewFeedback";

const FEEDBACK_DURATION_MS = 1200;

export default function FlashcardItem({ cardItem }) {
    const [fliped, setFliped] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const timeoutRef = useRef(null);

    const func = useContext(CardContex);
    const card = cardItem;
    const setEdit = func.setEdit;
    const setModal = func.setModal;
    const reviewCard = func.reviewCard;
    const setCardFeedbackActive = func.setCardFeedbackActive;

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    function handleFlipClick() {
        if (feedback) return;
        setFliped((prev) => !prev);
    }

    async function handleAnswerClick(resultado) {
        if (!reviewCard) return;

        setFliped(false);
        const updatedCard = await reviewCard(card.id, resultado);
        const message = getFeedbackMessage({
            result: resultado,
            updatedCard: updatedCard || card,
            now: new Date(),
        });

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setCardFeedbackActive?.(card.id, true);
        setFeedback({
            type: resultado,
            message,
        });

        timeoutRef.current = setTimeout(() => {
            setFeedback(null);
            setCardFeedbackActive?.(card.id, false);
        }, FEEDBACK_DURATION_MS);
    }

    return (
        <div className="rounded-2xl bg-stone-100 shadow-sm flex flex-col gap-4 p-4">
            <div className="flex flex-row px-4">
                <ReviewControls cardItem={cardItem} />
                <Button
                    btnType="gear"
                    className="w-6 flex justify-center items-center"
                    onClick={() => { setEdit(card); setModal(true); }}
                />
            </div>

            <FlashcardContent
                cardItem={cardItem}
                fliped={fliped}
                feedback={feedback}
                handleClick={handleFlipClick}
            />

            <div>
                {fliped && !feedback ? (
                    <div className="flex flex-row justify-center gap-8 h-5">
                        <Button
                            title={'Errei'}
                            btnType={'erro'}
                            className="text-xs py-0 px-3 h-5 leading-none flex items-center justify-center"
                            onClick={() => handleAnswerClick('erro')}
                        />
                        <Button
                            title={'Acertei'}
                            btnType={'acerto'}
                            className="text-xs py-0 px-3 h-5 leading-none flex items-center justify-center"
                            onClick={() => handleAnswerClick('acerto')}
                        />
                    </div>
                ) : (
                    <div className="h-5" />
                )}
            </div>
        </div>
    );
}