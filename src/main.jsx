import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const root = document.getElementById('root')
root.style.backgroundColor = '#000000'
root.style.minHeight = '100vh'

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)