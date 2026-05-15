import { useState } from 'react'
import './App.css'
import UploadScreen from './pages/UploadScreen'
import ChatScreen from './pages/ChatScreen'

export type Screen = 'upload' | 'chat'

export default function App() {
  const [screen, setScreen] = useState<Screen>('upload')
  const [textLoaded, setTextLoaded] = useState(false)

  return (
    <div className="app-shell">
      {/* Top Nav */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-block">
            <svg width="52" height="36" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="20" height="36" fill="#39ff14"/>
              <rect x="24" y="0" width="6" height="36" fill="#39ff14"/>
              <polygon points="32,0 52,0 42,18 52,36 32,36 42,18" fill="#39ff14"/>
            </svg>
            <div className="logo-text">
              <span className="logo-drz">DRZ</span>
              <span className="logo-tagline">Trusted Data Means Better Decisions</span>
            </div>
          </div>

          <nav className="header-nav">
            <button
              className={`nav-btn ${screen === 'upload' ? 'active' : ''}`}
              onClick={() => setScreen('upload')}
            >
              <span className="nav-icon">01</span>
              Carregar Texto
            </button>
            <button
              className={`nav-btn ${screen === 'chat' ? 'active' : ''} ${!textLoaded ? 'disabled' : ''}`}
              onClick={() => textLoaded && setScreen('chat')}
              title={!textLoaded ? 'Carregue o texto primeiro' : ''}
            >
              <span className="nav-icon">02</span>
              Consultar IA
              {textLoaded && <span className="nav-badge" />}
            </button>
          </nav>
        </div>
        <div className="header-line" />
      </header>

      {/* Scanline effect */}
      <div className="scanline-overlay" />

      {/* Main content */}
      <main className="app-main">
        {screen === 'upload' ? (
          <UploadScreen
            onSuccess={() => {
              setTextLoaded(true)
              setScreen('chat')
            }}
          />
        ) : (
          <ChatScreen />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <span className="footer-text">
          MC-70 <span className="sep">//</span> Sistema de Consulta <span className="sep">•</span> DRZ © 2024
        </span>
        <span className={`status-dot ${textLoaded ? 'online' : 'offline'}`}>
          {textLoaded ? '⬤ BASE CARREGADA' : '⬤ AGUARDANDO BASE'}
        </span>
      </footer>
    </div>
  )
}
