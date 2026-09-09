import { useContext, useEffect, useState } from "react"
import { CardContex } from "../pages/Flashcards"

export default function ReviewControls({ revIndicator }) {
    const [reviewDate, setReviewDate] = useState();
    const cardContext = useContext(CardContex)
    const card = cardContext[0]

    const [statusColors, setStatusColors] = useState([
        { actualStatusColor: "bg-gray-500", offStatusColor: "bg-gray-200" },
        { actualStatusColor: "bg-red-500", offStatusColor: "bg-red-200" },
        { actualStatusColor: "bg-orange-500", offStatusColor: "bg-orange-200" },
        { actualStatusColor: "bg-lime-500", offStatusColor: "bg-lime-200" },
        { actualStatusColor: "bg-green-500", offStatusColor: "bg-green-200" },
    ])


    // busca dos dados do card no backend
    // Map() a partir do index dos pontos - OK
    console.log('card.next_review_date: ', card.next_review_date);

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const [datePart] = isoString.split('T');
        const [year, month, day] = datePart.split('-');
        return `${day}-${month}-${year}`
    }

    const getReviewDate = (card) => {
        if (!card) return 'Sem dados';

        switch (true) {
            case (card.next_review_date === null && card.level >= 4):
                return 'Memorizado!'
                break;
            case (card.level === 0):
                return 'Revisão Inicial!'
                break;
            case (card.level >= 1 && card.level < 4):
                return `${formatDate(card.next_review_date)}`
                break;
            default:
                return `${formatDate(card.next_review_date)}` || 'Hoje.'
                break;
        }
    }

    return <div className="flex flex-row justify-between px-4 grow">

        <div className="w-48 shrink-0 text-sm font-medium text-stone-700">
            Revisão: {getReviewDate(card)}
        </div>

        <ul className="flex flex-row items-center gap-2 ">
            {statusColors.map((color, index) => {
                // Se cardPontos for 5, 6... o Math.min trava o valor em 4 (5ª bolinha)
                const activeIndex = Math.min(card.level, statusColors.length - 1);

                return (
                    <li
                        key={index}
                        className={
                            `rounded-full h-3 w-3 ${activeIndex === index ?
                                `${color.actualStatusColor} border-2 border-b-indigo-700` : color.offStatusColor}`
                        }
                    ></li>
                );
            })}
        </ul>
    </div>
}