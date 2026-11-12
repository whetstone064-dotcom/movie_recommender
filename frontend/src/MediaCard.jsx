export default function MediaCard({ item, highlighted }) {
  return (
    <article className={`card ${highlighted ? 'card--highlight' : ''}`}>
      {item.poster ? (
        <img src={item.poster} alt={item.title} loading="lazy" />
      ) : (
        <div className="card__noposter">No poster</div>
      )}
      <div className="card__body">
        <h3>{item.title}</h3>
        <p className="card__meta">
          {item.year} · {item.genres} · ⭐ {item.rating}
        </p>
        <p className="card__summary">{item.summary}</p>
      </div>
    </article>
  )
}