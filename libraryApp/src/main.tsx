import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// removed StrictMode as it bricked my calendar, reimplement if adverse effects

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
    <App />
)
