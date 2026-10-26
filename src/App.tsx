import Sidebar from './components/Sidebar'
import TrackList from './components/TrackList'
import { tracks } from './data/tracks'
import { useState } from 'react'
import SearchBar from './components/SearchBar'
import './App.css'

function App() {

  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredTracks = tracks.filter((track) => {
  const searchableText = [
    track.title,
    track.artist,
    ...track.genre,
  ]
    .join(' ')
    .toLowerCase()

  return searchableText.includes(normalizedQuery)
})
  return (
    <div className = "app-shell">
      <Sidebar />

      <main className ="main-panel">
        <header className = "page-header">
          <h1>История музыкальных впечатлений</h1>
        </header>

        <section className = "content-block hero-block">
          <p className = "lead">Личный музыкальный дневник</p>
          <p className = "hero-text">
            Сохраняйте любимые треки, фиксируйте эмоции от прослушивания,
            записывайте воспоминания и анализируйте свои предпочтения.
          </p>

          <div className = "hero-actions">
            <a className = "primary-button" href = "/tracks">
            Смотреть коллекцию
            </a>
            <a className = "primary-button" href = "/diary">
            Добавить запись
            </a>
          </div>
        </section>

        <section className = "popular-section" aria-labelledby = "popular-heading">
          <h2 id = "popular-heading">Популярные треки</h2>
          <SearchBar value={searchQuery} onSearchChange={setSearchQuery} />
          <TrackList tracks={filteredTracks} />
        </section>
      </main>
      </div>
  )
}

export default App