import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import ToastProvider from './providers/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ToastProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
     </ToastProvider>
  </StrictMode>,
)
