import { useState } from "react";
import { useContext } from "react"
import { CardContex } from "../../pages/Flashcards"


export default function FlashcardContent({ fliped, handleClick, ...props }) {

    // Recebendo o card atual do sortedFlashcards.map do Flashcards
    const cardContext = useContext(CardContex);
    const card = cardContext[0];
    const currentTime = cardContext[1]?.currentTime || new Date();

    console.log("Card ID:", card.id, "Next Review:", card.next_review_date, "Level:", card.level,'card obj:', card);

    const cardParaRevisar = (cardData) => {
        if (cardData.status === "NEW") return true; // Novo cardData livre para estudo
        if (!cardData.next_review_date) return true;

        const dateStr = typeof cardData.next_review_date === 'string' && !cardData.next_review_date.endsWith('Z') && !cardData.next_review_date.includes('+') ? `${cardData.next_review_date}Z` :
            cardData.next_review_date;

        return new Date(dateStr) <= currentTime;
    }

    // Bloquear Cards Após Revisar
    const available = cardParaRevisar(card);

    // Liberar cards para testes
    // const available = true;



    // Estilizar a partir do resultado do review

    return <div
        onClick={available ? handleClick : null}
        {...props}
        className={`min-h-25 flex flex-col 
            justify-center rounded-2xl shadow 
            shadow-taupe-700 transition-all 
            ${available ? 'bg-amber-100 cursor-pointer' : 'bg-stone-200 opacity-60 cursor-not-allowed'}`
        }
    >
        {!available && (
            <span className="text-xs text-center text-stone-500 font-semibold">
                Em espera (Aguardando data de revisão)
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