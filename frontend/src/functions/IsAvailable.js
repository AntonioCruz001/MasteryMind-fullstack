import { parseTargetDate } from './parseTargetDate';

export const cardParaRevisar = (cardData, currentTime, liberarTeste) => {
    if (!cardData) return false;
    if (cardData.level >= 4 || cardData.status === "MASTERED") return false;

    if (liberarTeste) return true;

    if (cardData.status === "NEW") return true;

    if (!cardData.next_review_date) return true;

    const reviewDate = parseTargetDate(cardData.next_review_date);
    if (!reviewDate || Number.isNaN(reviewDate.getTime())) return false;

    const now = currentTime ? new Date(currentTime) : new Date();

    return reviewDate.getTime() <= now.getTime();
};