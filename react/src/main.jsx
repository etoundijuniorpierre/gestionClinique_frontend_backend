// Importer les polyfills en premier
import './polyfills.js'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import './composants/config/authService.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
   <App/>
    
  </StrictMode>,
)
