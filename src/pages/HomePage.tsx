import { useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import TrackList from '../components/TrackList'
import type { Track } from '../types/track'

interface HomePageProps {
  tracks: Track[]
}

function HomePage({ tracks }: HomePageProps) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const results = tracks.filter((track) =>
    [track.title, track.artist, ...track.genre]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  )
  const popularTracks = [...tracks]
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 3)

  return (
    <>
      <header className="page-header">
        <h1>История музыкальных впечатлений</h1>
      </header>
      <section className="content-block hero-block">
        <SearchBar
          value={query}
          onSearchChange={setQuery}
          label="Найти трек"
          placeholder="Название трека, исполнитель или жанр"
        />
        {query.trim() && (
          <div className="search-results" aria-live="polite">
            {results.length === 0 ? (
              <p className="empty-message">Подходящие треки не найдены.</p>
            ) : (
              results.slice(0, 5).map((track) => (
                <Link className="result-item" key={track.id} to={`/tracks/${track.id}`}>
                  <h3>{track.title}</h3>
                  <p>{track.artist} · {track.genre.join(', ')}</p>
                </Link>
              ))
            )}
          </div>
        )}
        <p className="lead">Личный музыкальный дневник</p>
        <p className="hero-text">
          Сохраняйте любимые треки, фиксируйте эмоции от прослушивания,
          записывайте воспоминания и анализируйте свои предпочтения.
        </p>
        <div className="hero-actions">
          <Link to="/collection" className="primary-button">Смотреть коллекцию</Link>
          <Link to="/diary" className="secondary-button">Добавить запись</Link>
        </div>
      </section>
      <section className="popular-section" aria-labelledby="popular-heading">
        <h2 id="popular-heading">Популярные треки</h2>
        <TrackList tracks={popularTracks} />
      </section>
    </>
  )
}

export default HomePage
