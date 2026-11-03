import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { DiaryEntry } from '../types/diary'

interface DiaryPageProps {
  entries: DiaryEntry[]
  entriesLoading: boolean
  entriesError: string
  onRetryEntries: () => void
  onSaveEntry: (entry: DiaryEntry) => Promise<void>
  onDeleteEntry: (id: number) => Promise<void>
}

interface EntryForm {
  trackTitle: string
  artist: string
  dateHeard: string
  rating: string
  emotion: string
  notes: string
  memoryPlace: string
  memoryDescription: string
}

const emptyForm: EntryForm = {
  trackTitle: '',
  artist: '',
  dateHeard: '',
  rating: '',
  emotion: '',
  notes: '',
  memoryPlace: '',
  memoryDescription: '',
}

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Не удалось прочитать изображение.'))
      }
    }
    reader.onerror = () => reject(reader.error ?? new Error('Не удалось прочитать изображение.'))
    reader.readAsDataURL(file)
  })
}

function DiaryPage({
  entries,
  entriesLoading,
  entriesError,
  onRetryEntries,
  onSaveEntry,
  onDeleteEntry,
}: DiaryPageProps) {
  const [form, setForm] = useState<EntryForm>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [photo, setPhoto] = useState<string | undefined>()
  const [formError, setFormError] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function updateField(field: keyof EntryForm, value: string): void {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setPhoto(await readImage(file))
      setFormError('')
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Не удалось прочитать изображение.')
    }
  }

  function resetForm(): void {
    setForm(emptyForm)
    setEditingId(null)
    setPhoto(undefined)
    setFormError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const rating = Number(form.rating)

    if (!form.trackTitle.trim() || !form.artist.trim() || !form.dateHeard || !form.emotion || !form.notes.trim()) {
      setFormError('Заполни обязательные поля, отмеченные формой.')
      return
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
      setFormError('Оценка должна быть числом от 1 до 10.')
      return
    }

    const hasMemory = Boolean(form.memoryPlace.trim() || form.memoryDescription.trim() || photo)
    const entry: DiaryEntry = {
      id: editingId ?? Date.now(),
      trackTitle: form.trackTitle.trim(),
      artist: form.artist.trim(),
      dateHeard: form.dateHeard,
      rating,
      emotion: form.emotion,
      notes: form.notes.trim(),
      ...(hasMemory && {
        memory: {
          place: form.memoryPlace.trim(),
          description: form.memoryDescription.trim(),
          ...(photo && { photo }),
        },
      }),
    }

    setIsSaving(true)
    try {
      await onSaveEntry(entry)
      resetForm()
      setExpanded(true)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Не удалось сохранить запись.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteEntry(id: number): Promise<void> {
    setDeletingId(id)
    setFormError('')
    try {
      await onDeleteEntry(id)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Не удалось удалить запись.')
    } finally {
      setDeletingId(null)
    }
  }

  function startEditing(entry: DiaryEntry): void {
    setEditingId(entry.id)
    setForm({
      trackTitle: entry.trackTitle,
      artist: entry.artist,
      dateHeard: entry.dateHeard,
      rating: String(entry.rating),
      emotion: entry.emotion,
      notes: entry.notes,
      memoryPlace: entry.memory?.place ?? '',
      memoryDescription: entry.memory?.description ?? '',
    })
    setPhoto(entry.memory?.photo)
    setFormError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header className="page-header">
        <h1>Дневник</h1>
      </header>
      <section className="content-block">
        <form className="diary-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="track-name">Название трека</label>
              <input id="track-name" type="text" required value={form.trackTitle} placeholder="Например: Neon Skyline" onChange={(event) => updateField('trackTitle', event.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="artist-name">Исполнитель</label>
              <input id="artist-name" type="text" required value={form.artist} placeholder="Например: Static Rooms" onChange={(event) => updateField('artist', event.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="date-heard">Дата знакомства</label>
              <input id="date-heard" type="date" required value={form.dateHeard} onChange={(event) => updateField('dateHeard', event.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="rating">Оценка</label>
              <input id="rating" type="number" min="1" max="10" step="0.1" required value={form.rating} placeholder="9.4" onChange={(event) => updateField('rating', event.target.value)} />
            </div>
            <div className="form-field full-width">
              <label htmlFor="emotion">Эмоциональный тег</label>
              <select id="emotion" required value={form.emotion} onChange={(event) => updateField('emotion', event.target.value)}>
                <option value="">Выберите тег</option>
                <option value="вдохновение">Вдохновение</option>
                <option value="настроение">Настроение</option>
                <option value="ностальгия">Ностальгия</option>
                <option value="расслабление">Расслабление</option>
              </select>
            </div>
            <div className="form-field full-width">
              <label htmlFor="notes">Впечатления</label>
              <textarea id="notes" rows={6} required value={form.notes} placeholder="Опишите, что вы почувствовали..." onChange={(event) => updateField('notes', event.target.value)} />
            </div>
            <fieldset className="memory-fields form-field full-width">
              <legend>Воспоминание (необязательно)</legend>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="memory-place">Место или событие</label>
                  <input id="memory-place" type="text" value={form.memoryPlace} placeholder="Например: поездка в Аршан" onChange={(event) => updateField('memoryPlace', event.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="memory-photo">Фотография</label>
                  <input id="memory-photo" type="file" accept="image/*" onChange={(event) => void handlePhotoChange(event)} />
                  <small className="field-hint">Изображение будет сохранено в браузере вместе с записью.</small>
                  {photo && <img className="memory-photo-preview" src={photo} alt="Предпросмотр воспоминания" />}
                </div>
                <div className="form-field full-width">
                  <label htmlFor="memory-description">Описание воспоминания</label>
                  <textarea id="memory-description" rows={4} value={form.memoryDescription} placeholder="Опишите событие и связь с треком..." onChange={(event) => updateField('memoryDescription', event.target.value)} />
                </div>
              </div>
            </fieldset>
          </div>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={isSaving}>
              {isSaving ? 'Сохраняем...' : editingId ? 'Сохранить изменения' : 'Сохранить запись'}
            </button>
            {editingId !== null && <button type="button" className="secondary-button" onClick={resetForm}>Отменить редактирование</button>}
          </div>
        </form>

        <div className="saved-entries-wrapper">
          <button className="saved-entries-toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded((isExpanded) => !isExpanded)}>
            <span>Сохранённые записи</span>
            <span className="saved-entry-count">{entries.length}</span>
          </button>
          {expanded && (
            <div className="saved-entries-panel">
              {entriesLoading ? (
                <p role="status">Загружаем записи...</p>
              ) : entriesError ? (
                <div role="alert">
                  <p>{entriesError}</p>
                  <button className="secondary-button" type="button" onClick={onRetryEntries}>
                    Повторить загрузку
                  </button>
                </div>
              ) : entries.length === 0 ? (
                <p className="empty-message">Записей пока нет.</p>
              ) : (
                <div className="saved-entries">
                  {entries.map((entry) => (
                    <article className="saved-entry" key={entry.id}>
                      <div className="saved-entry-header">
                        <strong>{entry.trackTitle} — {entry.artist}</strong>
                        <span>{entry.emotion}</span>
                      </div>
                      <p className="saved-entry-meta">{entry.dateHeard} · Оценка: {entry.rating}</p>
                      <p>{entry.notes}</p>
                      {entry.memory?.description && <p className="entry-memory-link">{entry.memory.description}</p>}
                      <div className="entry-actions">
                        <button className="secondary-button" type="button" onClick={() => startEditing(entry)}>Редактировать</button>
                        <button
                          className="delete-button"
                          type="button"
                          disabled={deletingId === entry.id}
                          onClick={() => void handleDeleteEntry(entry.id)}
                        >
                          {deletingId === entry.id ? 'Удаляем...' : 'Удалить'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default DiaryPage
