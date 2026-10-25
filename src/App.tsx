import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  return (
    <div className = "app-shell">
      <Sidebar />

      <main className ="main-panel">
        <header className = "page-header">
          <h1>История музыкальных впечатлений</h1>
        </header>

        <section className = "content-block hero-block">
          <p className = "lead">Личный музыкальный дневник</p>
          <p className = "hero-text">
            Сохраняйте любимые треки, фиксируйте эмоции от прослушивания,
            записывайте воспоминания и анализируйте свои предпочтения.
          </p>

          <div className = "hero-actions">
            <a className = "primary-button" href = "/tracks">
            Смотреть коллекцию
            </a>
            <a className = "primary-button" href = "/diary">
            Добавить запись
            </a>
          </div>
        </section>

        <section className = "popular-section" aria-labelledby = "popular-heading">
          <h2 id = "popular-heading">Популярные треки</h2>
          <p>Список треков добавим следующим этапом.</p>
        </section>
      </main>
      </div>
  )
}

export default App