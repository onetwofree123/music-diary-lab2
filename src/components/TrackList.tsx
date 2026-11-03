import type { Track } from '../types/track'
import TrackCard from './TrackCard'

interface TrackListProps {
  tracks: Track[]
}

function TrackList({ tracks }: TrackListProps) {
  if (tracks.length === 0) {
    return <p className="empty-message">Треки не найдены.</p>
  }

  return (
    <div className="cards-grid">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  )
}

export default TrackList