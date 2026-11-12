import { useState, useRef, useEffect } from 'react'

export default function ChatWidget({ onPicks }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi! Describe a mood or a plot, e.g. "a slow-paced mystery set in a snowy town".',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setMessages((m) => [...m, { role: 'bot', text: data.reply }])
      onPicks(data.picks)
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: "Sorry, I can't reach the server. Is the backend running?" },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button className="chat-fab" onClick={() => setOpen(true)}>
        💬 Ask for a vibe
      </button>
    )
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <span>Vibe Chat</span>
        <button onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className="chat__messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg msg--${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="msg msg--bot">Thinking…</div>}
        <div ref={endRef} />
      </div>
      <form className="chat__form" onSubmit={send}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe a mood or plot…"
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  )
}