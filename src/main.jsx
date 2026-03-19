import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 다크모드 초기화 (깜빡임 방지)
if (localStorage.getItem('withmary_dark') === '1') {
  document.documentElement.classList.add('dark')
}

// 서비스워커 등록 (PWA 설치 지원)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
