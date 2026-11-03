import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <div className="logo">
          <span className="logo-mark" aria-hidden="true">♪</span>
          <span className="logo-text">Music Diary</span>
        </div>
      </header>

      <nav className="sidebar-nav" aria-label="Навигация по сайту">
        <NavLink className="nav-link" to="/" end>Главная</NavLink>
        <NavLink className="nav-link" to="/collection">Коллекция</NavLink>
        <NavLink className="nav-link" to="/diary">Дневник</NavLink>
        <NavLink className="nav-link" to="/memories">Воспоминания</NavLink>
        <NavLink className="nav-link" to="/stats">Статистика</NavLink>
        <NavLink className="nav-link" to="/profile">Профиль</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar