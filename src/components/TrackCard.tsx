import type { Track } from '../types/track'
import { Link } from 'react-router-dom'

interface TrackCardProps {
  track: Track
}

function TrackCard({ track }: TrackCardProps) {
  return (
    <Link className="track-card" to={`/tracks/${track.id}`}>
      <div className="track-cover">
        <img className="cover-image" src={track.cover} alt={`Обложка альбома ${track.album}`} />
      </div>
      <div className="track-body">
        <span className="tag">{track.genre[0]}</span>
        <h3>{track.title}</h3>
        <p>{track.artist}</p>
        <div className="meta">
          <span>★ {track.rating}</span>
          <span>{track.duration}</span>
        </div>
      </div>
    </Link>
  )
}

export default TrackCard