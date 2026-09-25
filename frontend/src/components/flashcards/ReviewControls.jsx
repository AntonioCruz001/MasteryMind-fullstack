import { useContext, useEffect, useState } from "react";
import { CardContex } from "../../pages/Flashcards";
import ReviewCountdown from "./ReviewCountDown";

// 1. Constantes e utilitários fora do componente (evita recriação a cada render)
const STATUS_COLORS = [
  { active: "bg-gray-500 border-indigo-700", inactive: "bg-gray-200" },
  { active: "bg-red-500 border-indigo-700", inactive: "bg-red-200" },
  { active: "bg-orange-500 border-indigo-700", inactive: "bg-orange-200" },
  { active: "bg-lime-500 border-indigo-700", inactive: "bg-lime-200" },
  { active: "bg-green-500 border-indigo-700", inactive: "bg-green-200" },
];

const formatDate = (isoString) => {
  if (!isoString) return "";
  const [datePart] = isoString.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}-${month}-${year}`;
};

export default function ReviewControls({ setWaiting5 }) {
  const cardContext = useContext(CardContex);
  const card = cardContext?.[0];

  const currentTime = cardContext?.[1]?.currentTime || new Date();

  const isWaiting5 =
    card?.level === 0 && !card?.is_reviewed && card?.next_review_date && new Date(card.next_review_date) > currentTime;

  // IFs para determinar o texto de revisão
  const getReviewText = () => {
    if (!card) return "Sem dados";
    if (card.next_review_date === null && card.level >= 4) return "Memorizado!";
    if (card.level === 0 && !card.is_reviewed) {
      // Se tiver next_review_date, foi um erro de primeira. Se for null, é um card novo.
      if (isWaiting5) {
        return <ReviewCountdown targetDate={card.next_review_date} defaultMinutes={5} />;
      }
      if (card.next_review_date === null && card.level === 0 && !card.is_reviewed){
        return "Novo Card"
      }
      return "";
    }

    if(card.next_review_date){
      const reviewDate = new Date(card.next_review_date)
      const today = new Date();

      const isToday = 
        reviewDate.getDate() === today.getDate() &&
        reviewDate.getMonth() === today.getMonth() &&
        reviewDate.getFullYear() === today.getFullYear();

        if (isToday) {return 'Revisão: Hoje';}
    }

    const formattedDate = formatDate(card.next_review_date);
    return formattedDate ? `Acerto! Revisão: ${formattedDate}` : "Sem data";
  };

  // Cálculo de índice ativo feito uma única vez fora do map
  const activeIndex = Math.min(card?.level ?? 0, STATUS_COLORS.length - 1);

  return (
    <div className="flex flex-row justify-between items-center px-4 grow gap-4">
      {/* <div className="w-48 shrink-0 text-sm font-medium text-stone-700"> */}
      <div className="flex-1 min-w-0 text-sm font-medium text-stone-700 truncate">
        {getReviewText()}
      </div>

      <ul className="flex flex-row items-center gap-2 shrink-0">
        {STATUS_COLORS.map((color, index) => {
          const isActive = activeIndex === index;
          return (
            <li
              key={index}
              className={`h-3 w-3 rounded-full ${isActive
                ? `${color.active} border-2`
                : color.inactive
                }`}
            />
          );
        })}
      </ul>
    </div>
  );
}