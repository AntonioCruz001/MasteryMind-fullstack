import { useState } from "react";
import { useContext } from "react"
import { CardContex } from "../pages/Flashcards"


export default function FlashcardContent({ fliped, handleClick, ...props }) {


    // Recebendo o card atual do sortedFlashcards.map do Flashcards
    const card = useContext(CardContex)

    console.log("Card ID:", card[0].id, "Next Review:", card[0].next_review_date, "Level:", card[0].level);

    const cardParaRevisar = (card) => {
        if (!card.next_review_date) return true; // Novo card livre para estudo

        const reviewDate = new Date(card.next_review_date);
        const now = new Date();

        // Zera as horas para comparar apenas o dia (YYYY-MM-DD)
        reviewDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        return reviewDate <= now;
    }

    // Bloquear Cards Após Revisar
    const available = cardParaRevisar(card[0]);

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
            {card[0].front}
            {console.log('exibindo front')}

        </div> :
            <div className="text-center">
                {card[0].back}
                {console.log('exibindo back')}
            </div>
        }
    </div>
}