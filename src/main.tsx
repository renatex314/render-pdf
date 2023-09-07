import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App/App.tsx'
import './Global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.Suspense>
    <App />
  </React.Suspense>,
)
