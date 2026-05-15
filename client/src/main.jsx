import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
document.body.style.background = '#f3f4f6'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
