import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import ToastProvider from '@providers/ToastProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {HelmetProvider} from 'react-helmet-async'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
     <ToastProvider>
    <BrowserRouter>
      <App />
    <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-right'/>
    </BrowserRouter>
     </ToastProvider>
    </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
