import type { Track } from '../types/track'

function isTrack(value: unknown): value is Track {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const track = value as Record<string, unknown>

  return typeof track.id === 'number'
    && typeof track.title === 'string'
    && typeof track.artist === 'string'
    && Array.isArray(track.genre)
    && track.genre.every((genre) => typeof genre === 'string')
    && typeof track.cover === 'string'
    && typeof track.rating === 'number'
    && typeof track.duration === 'string'
    && typeof track.album === 'string'
    && typeof track.releaseDate === 'string'
    && typeof track.description === 'string'
}

export async function getTracks(): Promise<Track[]> {
  const response = await fetch('http://localhost:3001/tracks')

  if (!response.ok) {
    throw new Error(`Не удалось загрузить треки: HTTP ${response.status}`)
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data) || !data.every(isTrack)) {
    throw new Error('API вернуло список треков в неожиданном формате.')
  }

  return data
}

export async function getTrackById(id: number): Promise<Track> {
  const response = await fetch(`http://localhost:3001/tracks/${id}`)

  if (!response.ok) {
    throw new Error(`Не удалось загрузить трек: HTTP ${response.status}`)
  }

  const data: unknown = await response.json()

  if (!isTrack(data)) {
    throw new Error('API вернуло трек в неожиданном формате.')
  }

  return data
}