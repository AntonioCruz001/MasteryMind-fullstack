import { useState, useEffect } from "react"
import api from "../services/api";

// Este hook pode ser usado para buscar os flashcards de um assunto
// ou todos os flashcards
export function useFlashcards(subjectId = null) {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                // console.log('inicio da busca');
                

                setLoading(true);

                const endpoint = subjectId ? `/subjects/${subjectId}/flashcards` : '/flashcards';

                const response = await api.get(endpoint);

                // Valida se o dado retornado é um array e atualiza o estado com os flashcards
                setFlashcards(Array.isArray(response.data) ? response.data : []);

            } catch (error) {
                console.log('Erro ao buscar flashcards:', error);
                setFlashcards([]);
            } finally {
                setLoading(false);
                // console.log('final da busca, loading false');
            }
        }

        fetchFlashcards();
    }, [subjectId]);

    return { flashcards, setFlashcards, loading }
}