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

    const reviewDate = new Date(dateStr);
    const current = currentTime ? new Date(currentTime) : new Date();

    // Normaliza ambas as datas para o início do dia civil (00:00:00.000)
    reviewDate.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    // console.log({cardData:cardData, currentTime:currentTime, liberarTeste:liberarTeste});

    return reviewDate <= current;
}
