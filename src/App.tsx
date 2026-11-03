import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import {
  createDiaryEntry,
  deleteDiaryEntry,
  getDiaryEntries,
  isDiaryEntry,
  updateDiaryEntry,
} from './api/diaryApi'
import { getTracks } from './api/tracksApi'
import Sidebar from './components/Sidebar'
import DiaryPage from './pages/DiaryPage'
import HomePage from './pages/HomePage'
import MemoriesPage from './pages/MemoriesPage'
import ProfilePage from './pages/ProfilePage'
import StatsPage from './pages/StatsPage'
import TrackDetailsPage from './pages/TrackDetailsPage'
import TracksPage from './pages/TracksPage'
import type { DiaryEntry } from './types/diary'
import type { Track } from './types/track'

type TrackLoadState =
  | { status: 'loading' }
  | { status: 'success'; tracks: Track[] }
  | { status: 'error'; message: string }

type DiaryLoadState = 'loading' | 'success' | 'error'

async function loadAndMigrateDiaryEntries(): Promise<DiaryEntry[]> {
  const apiEntries = await getDiaryEntries()
  const savedEntries = window.localStorage.getItem('music-diary-entries')

  if (!savedEntries) {
    return apiEntries
  }

  const parsedEntries: unknown = JSON.parse(savedEntries)
  if (!Array.isArray(parsedEntries) || !parsedEntries.every(isDiaryEntry)) {
    throw new Error('Сохранённые локально записи имеют неверный формат.')
  }

  const missingEntries = parsedEntries.filter(
    (storedEntry) => !apiEntries.some((apiEntry) => apiEntry.id === storedEntry.id),
  )
  const migratedEntries = await Promise.all(missingEntries.map(createDiaryEntry))
  window.localStorage.removeItem('music-diary-entries')

  return [...migratedEntries, ...apiEntries]
}

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [diaryLoadState, setDiaryLoadState] = useState<DiaryLoadState>('loading')
  const [diaryLoadError, setDiaryLoadError] = useState('')
  const [diaryReloadKey, setDiaryReloadKey] = useState(0)
  const [trackLoadState, setTrackLoadState] = useState<TrackLoadState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isActive = true

    getTracks()
      .then((loadedTracks) => {
        if (isActive) {
          setTrackLoadState({ status: 'success', tracks: loadedTracks })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setTrackLoadState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Не удалось загрузить треки.',
          })
        }
      })

    return () => {
      isActive = false
    }
  }, [reloadKey])

  useEffect(() => {
    let isActive = true

    loadAndMigrateDiaryEntries()
      .then((loadedEntries) => {
        if (isActive) {
          setEntries(loadedEntries)
          setDiaryLoadState('success')
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setDiaryLoadError(
            error instanceof Error ? error.message : 'Не удалось загрузить записи дневника.',
          )
          setDiaryLoadState('error')
        }
      })

    return () => {
      isActive = false
    }
  }, [diaryReloadKey])

  function retryTrackLoad(): void {
    setTrackLoadState({ status: 'loading' })
    setReloadKey((key) => key + 1)
  }

  function retryDiaryLoad(): void {
    setDiaryLoadState('loading')
    setDiaryReloadKey((key) => key + 1)
  }

  async function saveEntry(entry: DiaryEntry): Promise<void> {
    const exists = entries.some((item) => item.id === entry.id)
    const savedEntry = exists
      ? await updateDiaryEntry(entry)
      : await createDiaryEntry(entry)

    setEntries((currentEntries) => {
      const alreadyExists = currentEntries.some((item) => item.id === savedEntry.id)
      return alreadyExists
        ? currentEntries.map((item) => (item.id === savedEntry.id ? savedEntry : item))
        : [savedEntry, ...currentEntries]
    })
  }

  async function deleteEntry(id: number): Promise<void> {
    await deleteDiaryEntry(id)
    setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== id))
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        {trackLoadState.status === 'loading' && (
          <p role="status">Загружаем данные треков...</p>
        )}
        {trackLoadState.status === 'error' && (
          <div role="alert">
            <p>{trackLoadState.message}</p>
            <button className="primary-button" type="button" onClick={retryTrackLoad}>
              Повторить загрузку
            </button>
          </div>
        )}
        {trackLoadState.status === 'success' && (
          <Routes>
            <Route path="/" element={<HomePage tracks={trackLoadState.tracks} />} />
            <Route path="/collection" element={<TracksPage tracks={trackLoadState.tracks} />} />
            <Route path="/tracks" element={<TracksPage tracks={trackLoadState.tracks} />} />
            <Route path="/tracks/:id" element={<TrackDetailsPage tracks={trackLoadState.tracks} />} />
            <Route
              path="/diary"
              element={
                <DiaryPage
                  entries={entries}
                  entriesLoading={diaryLoadState === 'loading'}
                  entriesError={diaryLoadState === 'error' ? diaryLoadError : ''}
                  onRetryEntries={retryDiaryLoad}
                  onSaveEntry={saveEntry}
                  onDeleteEntry={deleteEntry}
                />
              }
            />
            <Route
              path="/memories"
              element={
                diaryLoadState === 'success'
                  ? <MemoriesPage entries={entries} />
                  : <p role={diaryLoadState === 'error' ? 'alert' : 'status'}>
                      {diaryLoadState === 'error' ? diaryLoadError : 'Загружаем записи дневника...'}
                    </p>
              }
            />
            <Route path="/stats" element={<StatsPage tracks={trackLoadState.tracks} entries={entries} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<p className="empty-message">Страница не найдена.</p>} />
          </Routes>
        )}
      </main>
    </div>
  )
}

export default App
