import type { DiaryEntry } from '../types/diary'

const diaryApiUrl = 'http://localhost:3001/entries'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isDiaryEntry(value: unknown): value is DiaryEntry {
  if (!isRecord(value)) {
    return false
  }

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

async function readEntryResponse(response: Response, action: string): Promise<DiaryEntry> {
  if (!response.ok) {
    throw new Error(`${action}: HTTP ${response.status}`)
  }

  const data: unknown = await response.json()
  if (!isDiaryEntry(data)) {
    throw new Error('API вернуло запись дневника в неожиданном формате.')
  }

  return data
}

export async function getDiaryEntries(): Promise<DiaryEntry[]> {
  const response = await fetch(diaryApiUrl)

  if (!response.ok) {
    throw new Error(`Не удалось загрузить записи дневника: HTTP ${response.status}`)
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data) || !data.every(isDiaryEntry)) {
    throw new Error('API вернуло записи дневника в неожиданном формате.')
  }

  return data
}

export async function createDiaryEntry(entry: DiaryEntry): Promise<DiaryEntry> {
  const response = await fetch(diaryApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })

  return readEntryResponse(response, 'Не удалось создать запись')
}

export async function updateDiaryEntry(entry: DiaryEntry): Promise<DiaryEntry> {
  const response = await fetch(`${diaryApiUrl}/${entry.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })

  return readEntryResponse(response, 'Не удалось обновить запись')
}

export async function deleteDiaryEntry(id: number): Promise<void> {
  const response = await fetch(`${diaryApiUrl}/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(`Не удалось удалить запись: HTTP ${response.status}`)
  }
}
