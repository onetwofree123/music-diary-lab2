import { Link, useParams } from 'react-router-dom'
import type { Track } from '../types/track'

interface TrackDetailsPageProps {
  tracks: Track[]
}

function TrackDetailsPage({ tracks }: TrackDetailsPageProps) {
  const { id } = useParams()
  const track = tracks.find((item) => item.id === Number(id))

  if (!track) {
    return (
      <>
        <header className="page-header track-page-header">
          <Link className="back-link" to="/collection">← Коллекция</Link>
          <h1>Трек не найден</h1>
        </header>
      </>
    )
  }

  return (
    <div className="track-detail-panel">
      <header className="page-header track-page-header">
        <Link className="back-link" to="/collection">← Коллекция</Link>
        <h1>{track.title}</h1>
        <p className="track-page-artist">{track.artist}</p>
      </header>
      <section className="track-detail-content" aria-label="Информация о треке">
        <div className={`track-artwork cover-${track.id}`} role="img" aria-label={`Обложка ${track.album}`}>
          <img className="cover-image" src={track.cover} alt="" />
        </div>
        <div className="track-details">
          <p className="track-description">{track.description}</p>
          <dl className="track-facts">
            <div><dt>Альбом</dt><dd>{track.album}</dd></div>
            <div><dt>Дата релиза</dt><dd>{track.releaseDate}</dd></div>
            <div><dt>Жанры</dt><dd>{track.genre.join(', ')}</dd></div>
            <div><dt>Оценка</dt><dd>{track.rating} / 10</dd></div>
            <div><dt>Длительность</dt><dd>{track.duration}</dd></div>
          </dl>
        </div>
      </section>
    </div>
  )
}

export default TrackDetailsPage
