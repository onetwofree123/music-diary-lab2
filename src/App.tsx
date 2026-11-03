import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DiaryPage from './pages/DiaryPage'
import HomePage from './pages/HomePage'
import MemoriesPage from './pages/MemoriesPage'
import ProfilePage from './pages/ProfilePage'
import StatsPage from './pages/StatsPage'
import TrackDetailsPage from './pages/TrackDetailsPage'
import TracksPage from './pages/TracksPage'
import { tracks } from './data/tracks'
import type { DiaryEntry } from './types/diary'

const diaryStorageKey = 'music-diary-entries'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isDiaryEntry(value: unknown): value is DiaryEntry {
  if (!isRecord(value)) return false

  const memory = value.memory
  const hasValidMemory = memory === undefined || (
    isRecord(memory)
    && typeof memory.place === 'string'
    && typeof memory.description === 'string'
    && (memory.photo === undefined || typeof memory.photo === 'string')
  )

  return typeof value.id === 'number'
    && typeof value.trackTitle === 'string'
    && typeof value.artist === 'string'
    && typeof value.dateHeard === 'string'
    && typeof value.rating === 'number'
    && typeof value.emotion === 'string'
    && typeof value.notes === 'string'
    && hasValidMemory
}

interface StoredEntries {
  entries: DiaryEntry[]
  error: string
}

function readStoredEntries(): StoredEntries {
  try {
    const savedEntries = window.localStorage.getItem(diaryStorageKey)
    if (!savedEntries) return { entries: [], error: '' }

    const parsedEntries: unknown = JSON.parse(savedEntries)
    if (!Array.isArray(parsedEntries) || !parsedEntries.every(isDiaryEntry)) {
      throw new Error('Сохранённые записи дневника имеют неверный формат.')
    }

    return { entries: parsedEntries, error: '' }
  } catch (error) {
    return {
      entries: [],
      error: error instanceof Error ? error.message : 'Не удалось прочитать записи дневника.',
    }
  }
}

function App() {
  const [storedEntries] = useState(readStoredEntries)
  const [entries, setEntries] = useState<DiaryEntry[]>(storedEntries.entries)
  const [storageError, setStorageError] = useState(storedEntries.error)

  function persistEntries(nextEntries: DiaryEntry[]): void {
    try {
      window.localStorage.setItem(diaryStorageKey, JSON.stringify(nextEntries))
      setStorageError('')
      setEntries(nextEntries)
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Не удалось сохранить записи дневника.')
    }
  }

  function saveEntry(entry: DiaryEntry): void {
    const exists = entries.some((item) => item.id === entry.id)
    const nextEntries = exists
      ? entries.map((item) => (item.id === entry.id ? entry : item))
      : [entry, ...entries]
    persistEntries(nextEntries)
  }

  function deleteEntry(id: number): void {
    persistEntries(entries.filter((entry) => entry.id !== id))
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        {storageError && <p className="storage-error" role="alert">{storageError}</p>}
        <Routes>
          <Route path="/" element={<HomePage tracks={tracks} />} />
          <Route path="/collection" element={<TracksPage tracks={tracks} />} />
          <Route path="/tracks" element={<TracksPage tracks={tracks} />} />
          <Route path="/tracks/:id" element={<TrackDetailsPage tracks={tracks} />} />
          <Route
            path="/diary"
            element={
              <DiaryPage
                entries={entries}
                onSaveEntry={saveEntry}
                onDeleteEntry={deleteEntry}
              />
            }
          />
          <Route path="/memories" element={<MemoriesPage entries={entries} />} />
          <Route path="/stats" element={<StatsPage tracks={tracks} entries={entries} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<p className="empty-message">Страница не найдена.</p>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
