// import { CardContex } from "../pages/Flashcards";
import { useContext, useEffect, useState } from "react";
import Button from "./Button";
import FlashcardContent from "./FlashcardContent";
import ReviewControls from "./ReviewControls";
import { CardContex } from "../pages/Flashcards";

export default function FlashcardItem() {
    const [fliped, setFliped] = useState(false);
    const [card, func] = useContext(CardContex)
    const setEdit = func.setEdit
    const setModal = func.setModal

    function handleFlipClick() {
        { fliped === false ? setFliped(true) : setFliped(false) }
    }

    return (
        // wrapper
        <div className="rounded-2xl bg-stone-300 shadow-sm flex flex-col gap-4 p-4">
            {/* header */}
            <div className="flex flex-row  px-4">
                {/* <ReviewControls cardPontos={pontos} /> */}
                <ReviewControls />
                <Button className="w-6" title={'⚙'} onClick={() => { setEdit(card); setModal(true) }} />
            </div>

            {/* frente e verso - conteudo */}
            <FlashcardContent fliped={fliped} handleClick={handleFlipClick} />

            {/* Botoes */}
            <div>
                {fliped ?
                    <div className="flex flex-row justify-center gap-20 px-16">
                        <Button title={'Errei'} className="" />
                        <Button title={'Acertei'} className="" />
                    </div> : ''}
            </div>
        </div>
    )
}