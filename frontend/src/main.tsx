import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from "./context/AuthContext";
import { ScrollProvider } from './context/ScrollContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScrollProvider>

    <AuthProvider>
    <App />
    </AuthProvider>
    </ScrollProvider>
  </StrictMode>,
)
