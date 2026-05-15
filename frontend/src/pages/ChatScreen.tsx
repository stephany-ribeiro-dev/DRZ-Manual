import { useState, useRef, useEffect } from 'react'
import { askQuestion } from '../services/api'
import './ChatScreen.css'

interface Message {
  id: number
  role: 'user' | 'ai'
  text: string
  timestamp: string
}

const SUGGESTED = [
  'Qual é a capacidade máxima do MC-70?',
  'Como realizar a descida corretamente?',
  'O que fazer em caso de superaquecimento?',
  'Quais cabos são compatíveis?',
  'Com que frequência trocar o cabo de aço?',
]

let msgId = 0

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgId++,
      role: 'ai',
      text: 'Base de conhecimento carregada. Faça perguntas sobre o Elevador Manual de Carga MC-70 e responderei com base no manual operacional.',
      timestamp: now(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (question: string) => {
    const q = question.trim()
    if (!q || loading) return

    setMessages(prev => [...prev, { id: msgId++, role: 'user', text: q, timestamp: now() }])
    setInput('')
    setLoading(true)

    try {
      const { answer } = await askQuestion(q)
      setMessages(prev => [...prev, { id: msgId++, role: 'ai', text: answer, timestamp: now() }])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro de comunicação com o servidor.'
      setMessages(prev => [...prev, { id: msgId++, role: 'ai', text: `⚠ ${msg}`, timestamp: now() }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <div className="screen-tag">ETAPA 02 / 02</div>
        <h1 className="screen-title">Consultar IA — MC-70</h1>
        <p className="screen-subtitle">
          Pergunte sobre o manual. A IA responde somente com base no texto carregado.
        </p>
      </div>

      <div className="chat-layout">
        {/* Message area */}
        <div className="messages-panel">
          <div className="messages-list">
            {messages.map(msg => (
              <div key={msg.id} className={`msg-row ${msg.role}`}>
                <div className="msg-avatar">
                  {msg.role === 'ai' ? (
                    <span className="avatar-ai">DRZ</span>
                  ) : (
                    <span className="avatar-user">USR</span>
                  )}
                </div>
                <div className="msg-bubble">
                  <div className="msg-text">{msg.text}</div>
                  <div className="msg-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg-row ai">
                <div className="msg-avatar"><span className="avatar-ai">DRZ</span></div>
                <div className="msg-bubble typing-bubble">
                  <span className="dot" style={{ animationDelay: '0ms' }} />
                  <span className="dot" style={{ animationDelay: '160ms' }} />
                  <span className="dot" style={{ animationDelay: '320ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="input-area">
            <div className="input-wrap">
              <textarea
                ref={inputRef}
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua pergunta sobre o MC-70... (Enter para enviar)"
                rows={2}
                disabled={loading}
              />
              <button
                className="send-btn"
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                title="Enviar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="input-hint">
              <span>↵ Enter para enviar • Shift+Enter para nova linha</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="chat-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">SUGESTÕES DE PERGUNTAS</div>
            <div className="suggestions-list">
              {SUGGESTED.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-btn"
                  onClick={() => send(s)}
                  disabled={loading}
                >
                  <span className="sug-num">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">STATUS DO SISTEMA</div>
            <div className="status-list">
              <div className="status-row">
                <span className="s-dot green" />
                <span>Base de texto carregada</span>
              </div>
              <div className="status-row">
                <span className="s-dot green" />
                <span>Gemini 1.5 Flash conectado</span>
              </div>
              <div className="status-row">
                <span className="s-dot green" />
                <span>Modo restrito ativo</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">SOBRE O MANUAL</div>
            <div className="manual-info">
              <div className="mi-row"><span>Modelo</span><strong>MC-70</strong></div>
              <div className="mi-row"><span>Edição</span><strong>1978</strong></div>
              <div className="mi-row"><span>Cap. nominal</span><strong>120 kg</strong></div>
              <div className="mi-row"><span>Cap. máxima</span><strong>180 kg</strong></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
