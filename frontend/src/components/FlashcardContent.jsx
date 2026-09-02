import { useState } from "react";
import { useContext } from "react"
import { CardContex } from "../pages/Flashcards"


export default function FlashcardContent({ fliped, handleClick, ...props }) {


    // Recebendo o card atual do sortedFlashcards.map do Flashcards
    const card = useContext(CardContex)



    return <div onClick={handleClick} {...props} className="min-h-25 flex flex-col justify-center bg-amber-100 rounded-2xl shadow shadow-taupe-700">
        {!fliped ? <div className="text-center">
            {card.front}
        </div> :
            <div className="text-center">
                {card.back}
            </div>
        }
    </div>
}