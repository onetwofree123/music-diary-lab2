import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import TrackList from '../components/TrackList'
import type { Track } from '../types/track'

interface TracksPageProps {
  tracks: Track[]
}

function TracksPage({ tracks }: TracksPageProps) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const filteredTracks = tracks.filter((track) =>
    [track.title, track.artist, ...track.genre]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  )

  return (
    <>
      <header className="page-header">
        <h1>Коллекция</h1>
      </header>
      <section className="content-block">
        <div className="toolbar">
          <SearchBar
            value={query}
            onSearchChange={setQuery}
            label="Поиск по коллекции"
            placeholder="Поиск по названию или исполнителю"
          />
        </div>
        <TrackList tracks={filteredTracks} />
      </section>
    </>
  )
}

export default TracksPage
