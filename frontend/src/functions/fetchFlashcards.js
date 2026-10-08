import api from "../services/api";

export const fetchFlashcards = async (subjectId, setFlashcardsArray) => {
    try {
        const response = await api.get(`/subjects/${subjectId}/flashcards`);
        const cards = response.data;

        if(setFlashcardsArray) (setFlashcardsArray(cards))
        if(subjectId && !setFlashcardsArray){
            return cards
        }

    } catch (err) {
        console.log('Erro ao buscar flashcards:', err);
    }
};