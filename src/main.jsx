import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import Root from './MainRoot.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
