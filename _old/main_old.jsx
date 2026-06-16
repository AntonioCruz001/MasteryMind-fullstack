import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Subjects from '../pages/Subjects.jsx' // Temporário

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Subjects/>
  </StrictMode>,
)
