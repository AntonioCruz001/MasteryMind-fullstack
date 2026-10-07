
// Função para evitar conflito com horário internacional no timer dos cards.

export const parseTargetDate = (dateStr) => {
    if (!dateStr) return null;
    const formattedStr = typeof dateStr === 'string'
        && !dateStr.endsWith('Z')
        && !dateStr.includes('+')
        ? `${dateStr}Z` : dateStr;
    return new Date(formattedStr)
}