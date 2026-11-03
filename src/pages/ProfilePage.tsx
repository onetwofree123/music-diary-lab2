import { useState } from 'react'
import type { FormEvent } from 'react'

function ProfilePage() {
  const [name, setName] = useState('Алина')
  const [email, setEmail] = useState('alina@example.com')
  const [bio, setBio] = useState('Люблю треки, которые напоминают вечерний город и легкую ностальгию.')
  const [saved, setSaved] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <>
      <header className="page-header">
        <h1>Профиль</h1>
      </header>
      <section className="content-block">
        <div className="profile-card">
          <div className="avatar">{name.trim().charAt(0).toUpperCase() || 'A'}</div>
          <div className="profile-meta">
            <h2>{name || 'Пользователь'}</h2>
            <p>Слушает: indie pop, synthwave, dream pop</p>
          </div>
        </div>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="profile-name">Имя</label>
              <input id="profile-name" type="text" required value={name} onChange={(event) => { setName(event.target.value); setSaved(false) }} />
            </div>
            <div className="form-field">
              <label htmlFor="profile-email">Email</label>
              <input id="profile-email" type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setSaved(false) }} />
            </div>
            <div className="form-field full-width">
              <label htmlFor="profile-bio">О себе</label>
              <textarea id="profile-bio" rows={5} value={bio} onChange={(event) => { setBio(event.target.value); setSaved(false) }} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">Сохранить</button>
            {saved && <p role="status">Изменения сохранены в текущем сеансе.</p>}
          </div>
        </form>
      </section>
    </>
  )
}

export default ProfilePage
