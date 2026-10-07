import api from "../services/api";

export const fetchFlashcards = async (subjectId, setFlashcardsArray) => {
    try {
        const response = await api.get(`/subjects/${subjectId}/flashcards`);
        const cards = response.data;

        setFlashcardsArray(cards);
    } catch (err) {
        console.log('Erro ao buscar flashcards:', err);
    }
};