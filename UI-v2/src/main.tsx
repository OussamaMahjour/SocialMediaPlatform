import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './services/providers/ThemeProvider.tsx'
import PopupProvider from './services/providers/PopupProvider.tsx'
import AuthProvider from './services/providers/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
      <AuthProvider>
        <PopupProvider>
          <App />
        </PopupProvider>
      </AuthProvider>
    </ThemeProvider>
)
