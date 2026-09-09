import { useContext, useEffect, useState } from "react";
import Button from "./Button";
import FlashcardContent from "./FlashcardContent";
import ReviewControls from "./ReviewControls";
import { CardContex } from "../pages/Flashcards";

export default function FlashcardItem() {
    const [fliped, setFliped] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [reviewIndicator, setReviewIndicator] = useState();
    const [card, func] = useContext(CardContex);
    const setEdit = func.setEdit
    const setModal = func.setModal
    const reviewCard = func.reviewCard
    // const responseCard = func.responseCard

    function handleFlipClick() {
        { fliped === false ? setFliped(true) : setFliped(false) }
    }

    const cardLevelInicial = card.level

    return (
        // wrapper
        <div className="rounded-2xl bg-stone-300 shadow-sm flex flex-col gap-4 p-4">
            {/* header */}
            <div className="flex flex-row  px-4">
                {/* <ReviewControls cardPontos={pontos} /> */}
                <ReviewControls revIndicator={reviewIndicator} />
                <Button className="w-6" title={'⚙'} onClick={() => { setEdit(card); setModal(true) }} />
            </div>

            {/* frente e verso - conteudo */}
            <FlashcardContent fliped={fliped} handleClick={handleFlipClick} />


            {/* Botoes */}
            <div >
                {fliped ?
                    <div className="flex flex-row justify-center gap-8 h-5">
                        <Button
                            title={'Errei'}
                            btnType={'erro'}
                            className="text-xs py-0 px-3 h-5 leading-none flex items-center justify-center"
                            onClick={cardLevelInicial !== 0 ? () => reviewCard(card.id, 'erro') : null} />
                        <Button
                            title={'Acertei'}
                            btnType={'acerto'}
                            className="text-xs py-0 px-3 h-5 leading-none flex items-center justify-center"
                            onClick={() => reviewCard(card.id, 'acerto')} />
                    </div> : <div className="h-5">

                    </div>}
            </div>
        </div>
    )
}