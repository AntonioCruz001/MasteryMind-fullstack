import { useContext, useEffect, useState } from "react";
import { CardContex } from "../../pages/Flashcards";
import { STATUS_COLORS } from "../../constants/statusColors";
import { formatDate } from "../../functions/fornatDate";
import { parseTargetDate } from "../../functions/parseTargetDate";
import ReviewCountdown from "./ReviewCountDown";


export default function ReviewControls() {
  const cardContext = useContext(CardContex);
  const card = cardContext?.[0];
  const currentTime = cardContext?.[1]?.currentTime || new Date();

  const nextReviewDateObj = parseTargetDate(card?.next_review_date);

  const isWaiting5 =
    card?.level === 0 &&
    card.status === "LEARNING" &&
    nextReviewDateObj &&
    nextReviewDateObj > currentTime;

  // IFs para determinar o texto de revisão
  const getReviewText = () => {
    if (!card) return "Sem dados";

    // Se for level 4
    if (card.next_review_date === null && card.level >= 4) return "Memorizado!";

    // Se for erro novo ou erro inicial
    if (card.level === 0) {
      if (card.status === "NEW") {
        return "Novo Card";
      }
      if (isWaiting5) {
        return <ReviewCountdown targetDate={card.next_review_date} defaultMinutes={5} />
      }
    }

    // Se a revisão for hoje
    if (card.next_review_date) {
      const reviewDate = nextReviewDateObj;
      const today = new Date();

      const isToday =
        reviewDate.getDate() === today.getDate() &&
        reviewDate.getMonth() === today.getMonth() &&
        reviewDate.getFullYear() === today.getFullYear();

      if (isToday) { return <ReviewCountdown targetDate={card.next_review_date} defaultMinutes={5} />; }
    }

    // Se a revisão for futura
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