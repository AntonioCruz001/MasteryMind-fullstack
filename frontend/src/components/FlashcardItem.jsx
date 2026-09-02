import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardContex } from "../pages/Flashcards";

import Button from "./Button";

import FlashcardContent from "./FlashcardContent";
import ReviewControls from "./ReviewControls";

export default function FlashcardItem({ key }) {
    const [fliped, setFliped] = useState(false);

    const card = useContext(CardContex);

    const [cardContent, setCardContent] = useState({ front: "", back: "" });

    const [pontos, setPontos] = useState(0)

    if (!card) return null

    useEffect(() => {
        setCardContent(card)
        setPontos(card.points)
    }, [card])

    // console.log('cardContent: ',cardContent);
    // console.log('pontos: ',pontos,card.points);


    function handleFlipClick() {
        { fliped === false ? setFliped(true) : setFliped(false) }
    }







    return (
        // wrapper
        <div className="rounded-2xl bg-stone-300 shadow-sm flex flex-col gap-4 p-4">
            {/* header */}
            <div className="flex flex-row  px-4">
                <ReviewControls cardPontos={pontos} />
                <Button className="w-6" title={'⚙'} />
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

                {/* Botao excluir sera movido para o modal! */}

                {/* <div className="flex justify-end">
                    <Button title={'Excluir'} className="px-6" />
                </div> */}
            </div>
        </div>
    )
}