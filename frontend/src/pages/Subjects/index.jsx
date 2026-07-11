import { useState, useEffect } from "react";
import axios from 'axios';
import "./Subjects.css"

function Subjects() {
    const [subjects, setSubjects] = useState([])

    // Função que busca os dados na API
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/subjects/')
            .then(response => {
                setSubjects(response.data)
            })
            .catch(error => console.error('Erro ao buscar dados:', error))
    }, [])

    return (
        <div>
            <h1>Meus Assuntos</h1>
            <ul className="subject_list">
                {subjects.map(subject => (
                    <li className="subject_container" key={subject.id}
                    >
                        <div className="subject_content">{subject.name} - {subject.description}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Subjects