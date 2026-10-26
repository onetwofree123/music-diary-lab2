import type { Track } from '../types/track'
import TrackCard from './TrackCard'

interface TrackListProps {
  tracks: Track[]
}

function TrackList({ tracks }: TrackListProps) {
  if (tracks.length === 0) {
    return <p>В коллекции пока нет треков.</p>
  }

  return (
    <div className="track-list">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  )
}

export default TrackList