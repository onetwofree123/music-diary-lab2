import type { DiaryEntry } from '../types/diary'

interface MemoriesPageProps {
  entries: DiaryEntry[]
}

function MemoriesPage({ entries }: MemoriesPageProps) {
  const memories = entries.filter((entry) => entry.memory)

  return (
    <>
      <header className="page-header">
        <h1>Воспоминания</h1>
      </header>
      <section className="content-block">
        {memories.length === 0 ? (
          <p className="empty-message">Воспоминаний пока нет. Добавь его к записи в дневнике.</p>
        ) : (
          <div className="memory-grid" aria-live="polite">
            {memories.map((entry) => (
              <article className="memory-card" key={entry.id}>
                {entry.memory?.photo && (
                  <div className="memory-cover">
                    <img
                      className="memory-photo"
                      src={entry.memory.photo}
                      alt={entry.memory.place || `Воспоминание о ${entry.trackTitle}`}
                    />
                  </div>
                )}
                <div className="memory-body">
                  <span className="memory-date">{entry.dateHeard}</span>
                  <h3>{entry.memory?.place || entry.trackTitle}</h3>
                  <p className="memory-track">{entry.trackTitle} · {entry.artist}</p>
                  {entry.memory?.description && <p>{entry.memory.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default MemoriesPage
