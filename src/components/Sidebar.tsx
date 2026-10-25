function Sidebar() {
    return (
        <aside className = "sidebar">
          <header className = "sidebar-header">
            <div className = "logo">
                <span className = "logo-mark" aria-hidden="true">♪</span>
            </div>
          </header>

          <nav className = "sidebar-nav" aria-label ="Навигация по сайту">
            <a className = "nav-link" href = "/">Главная</a>
            <a className = "nav-link" href = "/tracks">Коллекция</a>
            <a className = "nav-link" href = "/diary">Дневник</a>
            <a className = "nav-link" href = "/memories">Воспоминания</a>
            <a className = "nav-link" href = "/stats">Статистика</a>
            <a className = "nav-link" href = "/profile">Профиль</a>
        </nav>
        </aside>
    )
}

export default Sidebar