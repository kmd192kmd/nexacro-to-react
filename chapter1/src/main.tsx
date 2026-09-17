import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainPage from './pages/Prac01/MainPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainPage />
  </StrictMode>,
)
