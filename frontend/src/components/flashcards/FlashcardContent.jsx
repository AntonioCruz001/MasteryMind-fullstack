import { useState } from "react";
import { useContext } from "react"
import { CardContex } from "../../pages/Flashcards"
import { cardParaRevisar } from '../../functions/IsAvailable';

export default function FlashcardContent({ fliped, handleClick, ...props }) {

    // Recebendo o card atual do sortedFlashcards.map do Flashcards
    const cardContext = useContext(CardContex);
    const card = cardContext[0];
    const currentTime = cardContext[1]?.currentTime || new Date();
    // console.log('card obj:', card);

    // Bloquear Cards Após Revisar
    const liberarTeste = false;
    const available = cardParaRevisar(card, currentTime, liberarTeste);

    const getCardStyle = () => {
        if (available) { return 'bg-amber-100 cursor-pointer hover:scale-[1.01]'; }

        if (card.status === "MASTERED") { return 'bg-brandSuccess text-white opacity-90 cursor-not-allowed'; }

        return 'bg-stone-200  opacity-60 cursor-not-allowed';
    }

    // Estilizar a partir do resultado do review
    return <div
        onClick={available ? handleClick : null}
        {...props}
        className={`min-h-25 flex flex-col 
            justify-center rounded-2xl shadow 
            shadow-taupe-700 transition-all 
            ${getCardStyle()}`
        }
    >
        {!available && (
            <span className="text-xs text-center text-stone-800 font-semibold">

                {/* Customizar texto para cada situação. Usando cores de erro e acerto, ou cores dos níveis. */}
                {card.status === "MASTERED"
                    ? 'Card Dominado!'
                    : 'Em espera (Aguardando data de revisão)'}
            </span>
        )}

        {!fliped ? <div className="text-center">
            {card.front}
            {/* {console.log('exibindo front')} */}

        </div> :
            <div className="text-center">
                {card.back}
                {/* {console.log('exibindo back')} */}
            </div>
        }
    </div>
}