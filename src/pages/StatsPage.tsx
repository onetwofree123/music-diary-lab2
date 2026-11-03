import type { DiaryEntry } from '../types/diary'
import type { Track } from '../types/track'

interface StatsPageProps {
  tracks: Track[]
  entries: DiaryEntry[]
}

function StatsPage({ tracks, entries }: StatsPageProps) {
  const genreCounts = new Map<string, number>()
  tracks.forEach((track) => {
    track.genre.forEach((genre) => genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1))
  })
  const favoriteGenre = [...genreCounts.entries()].sort((first, second) => second[1] - first[1])[0]?.[0] ?? '—'
  const averageRating = tracks.length
    ? (tracks.reduce((total, track) => total + track.rating, 0) / tracks.length).toFixed(1)
    : '—'
  const currentMonthEntries = entries.filter((entry) => {
    const entryDate = new Date(`${entry.dateHeard}T00:00:00`)
    const now = new Date()
    return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <>
      <header className="page-header">
        <h1>Статистика</h1>
      </header>
      <section className="content-block">
        <div className="stats-summary">
          <article className="summary-card"><h3>Всего треков</h3><p>{tracks.length}</p></article>
          <article className="summary-card"><h3>Любимый жанр</h3><p>{favoriteGenre}</p></article>
          <article className="summary-card"><h3>Средняя оценка</h3><p>{averageRating}</p></article>
          <article className="summary-card"><h3>Новых в этом месяце</h3><p>{currentMonthEntries}</p></article>
        </div>
      </section>
    </>
  )
}

export default StatsPage
