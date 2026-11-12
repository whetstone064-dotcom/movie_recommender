import { useEffect, useState } from 'react'
import MediaCard from './MediaCard'
import ChatWidget from './ChatWidget'

const SAMPLE_ITEMS = [
  { id: 0, title: 'Sample Movie A', year: '2001', genres: 'Mystery', rating: 8.1, summary: 'A detective investigates a disappearance in a snowy village.', poster: '' },
  { id: 1, title: 'Sample Movie B', year: '1999', genres: 'Drama', rating: 7.9, summary: 'A quiet story about two old friends.', poster: '' },
  { id: 2, title: 'Sample Movie C', year: '2015', genres: 'Sci-Fi', rating: 8.4, summary: 'A crew travels through a wormhole.', poster: '' },
]

export default function App() {
  const [items, setItems] = useState([])
  const [picks, setPicks] = useState([])

  useEffect(() => {
    fetch('/api/items')
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setItems)
      .catch(() => setItems(SAMPLE_ITEMS)) // backend not ready yet
  }, [])

  const pickIds = new Set(picks.map((p) => p.id))
  const rest = items.filter((i) => !pickIds.has(i.id))

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 Vibe Recommender</h1>
        <p>Tell the chatbot a mood or a plot. It finds matches by meaning, not keywords.</p>
      </header>

      {picks.length > 0 && (
        <section>
          <div className="section-title">
            <h2>Top matches for you</h2>
            <button className="link-btn" onClick={() => setPicks([])}>Clear</button>
          </div>
          <div className="grid">
            {picks.map((p) => <MediaCard key={p.id} item={p} highlighted />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="section-title">{picks.length ? 'Everything else' : 'Browse all'}</h2>
        <div className="grid">
          {rest.map((i) => <MediaCard key={i.id} item={i} />)}
        </div>
      </section>

      <ChatWidget onPicks={setPicks} />
    </div>
  )
}