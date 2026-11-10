import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTrackById } from '../api/tracksApi'
import type { Track } from '../types/track'

interface TrackDetailsPageProps {
  tracks: Track[]
}

type TrackDetailsLoadState =
  | { status: 'loading' }
  | { status: 'success'; track: Track }
  | { status: 'error'; message: string }

function TrackDetailsPage({ tracks }: TrackDetailsPageProps) {
  const { id } = useParams()
  
  const [trackState, setTrackState] = useState<TrackDetailsLoadState>({
    status: 'loading',
  })

  useEffect(() => {
    let isActive = true
    const trackId = Number(id)

    if (!id || !Number.isInteger(trackId) || trackId <= 0) {
      setTrackState({
        status: 'error',
        message: 'Некорректный идентификатор трека.',
      })

      return () => {
        isActive = false
      }
    }

    setTrackState({ status: 'loading' })

    getTrackById(trackId)
      .then((loadedTrack) => {
        if (isActive) {
          setTrackState({ status: 'success', track: loadedTrack })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setTrackState({
            status: 'error',
            message: error instanceof Error
              ? error.message
              : 'Не удалось загрузить трек.',
          })
        }
      })

    return () => {
      isActive = false
    }
  }, [id])

    if (trackState.status === 'loading') {
    return <p role="status">Загружаем трек...</p>
  }

  if (trackState.status === 'error') {
    return (
      <>
        <header className="page-header track-page-header">
          <Link className="back-link" to="/collection">← Коллекция</Link>
          <h1>Не удалось загрузить трек</h1>
          <p role="alert">{trackState.message}</p>
        </header>
      </>
    )
  }

  const track = trackState.track
  const trackIndex = tracks.findIndex((item) => item.id === track.id)

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
        <nav className="track-navigation" aria-label="Переключение между треками">
          {trackIndex > 0 ? (
            <Link className="secondary-button" to={`/tracks/${tracks[trackIndex - 1].id}`}>
              ← Предыдущий трек
            </Link>
          ) : (
            <button className="secondary-button" type="button" disabled>
              ← Предыдущий трек
            </button>
          )}
          <span className="track-position">{trackIndex + 1} из {tracks.length}</span>
          {trackIndex < tracks.length - 1 ? (
            <Link className="primary-button" to={`/tracks/${tracks[trackIndex + 1].id}`}>
              Следующий трек →
            </Link>
          ) : (
            <button className="primary-button" type="button" disabled>
              Следующий трек →
            </button>
          )}
        </nav>
      </section>
    </div>
  )
}

export default TrackDetailsPage
