import { useEffect, useState } from "react";
import axios from 'axios';
import './App.css'

function App() {
  const [subjects, setSubjects] = useState([])

  // Função que busca os dados na API
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/subjects/')
      .then(response => {
        setSubjects(response.data)
      })
      .catch(error => console.error('Erro ao buscar dados:',error))
  }, [])

  return (
    <div>
      <h1>Meus Assuntos</h1>
      <ul>
        {subjects.map( subject => (
          <li key={subject.id}>{subject.name} - {subject.description}</li>
        ))}
      </ul>
    </div>
  )
}

export default App