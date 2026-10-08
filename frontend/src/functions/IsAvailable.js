// Retorna true ou false 
export const cardParaRevisar = (cardData, currentTime, liberarTeste) => {
    if (!cardData) return false;
    if (cardData.level >= 4 || cardData.status === "MASTERED") return false;
    
    if (liberarTeste) { return true };
    
    if (cardData.status === "NEW") return true; // Novo cardData livre para estudo
    
    const dateStr = typeof cardData.next_review_date === 'string'
        && !cardData.next_review_date.endsWith('Z')
        && !cardData.next_review_date.includes('+')
        ? `${cardData.next_review_date}Z`
        : cardData.next_review_date;


    return new Date(dateStr) <= currentTime;
}
