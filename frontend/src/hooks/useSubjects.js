import { useState, useEffect } from "react";
import api from "../services/api";

//
export function useSubjects(subjectId) {
    const [subjects, setSubjects] = useState([]);
    const [subject, setSubject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                if (subjectId) {
                    const endpoint = `/subjects/${subjectId}`
                    const response = await api.get(endpoint);
                    setSubject(response.data);
                } else {
                    const endpoint = `/subjects`
                    const response = await api.get(endpoint);
                    setSubjects(Array.isArray(response.data) ? response.data : []);
                }

            } catch (error) {
                console.log('Erro ao buscar assuntos:', error);
                setSubjects([]);
            } finally {
                setLoading(false);
            }
        }

        fetchSubjects()
    }, [subjectId]);

    return { subject, subjects, setSubjects, loading, setLoading }
}