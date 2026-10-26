import type { Track } from '../types/track'

interface TrackCardProps {
  track: Track
}

function TrackCard({ track }: TrackCardProps) {
  return (
    <article className="track-card">
      <img
        className="track-cover"
        src={track.cover}
        alt={`Обложка альбома ${track.album}`}
      />

      <div className="track-card-content">
        <h3>{track.title}</h3>
        <p>{track.artist}</p>
        <p>Альбом: {track.album}</p>
        <p>Жанры: {track.genre.join(', ')}</p>
        <p>Оценка: {track.rating} · Длительность: {track.duration}</p>
        <p>{track.description}</p>
      </div>
    </article>
  )
}

export default TrackCard