import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import { clearSession, getSession } from '../services/auth'
import { notify } from '../services/notifications'
import { applyTheme, getStoredTheme } from '../services/theme'
import { getAllStudents } from '../services/storage'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const session = getSession()
  const students = getAllStudents()
  const [theme, setTheme] = useState(() => getStoredTheme())
  const [studentQuery, setStudentQuery] = useState('')
  const searchParams = new URLSearchParams(location.search)
  const isAdminSection =
    location.pathname.startsWith('/admin') ||
    (location.pathname.startsWith('/portal') && searchParams.get('mode') === 'admin')
  const isUserSection =
    location.pathname.startsWith('/reports') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/student/') ||
    location.pathname.startsWith('/profile/') ||
    (location.pathname.startsWith('/portal') && searchParams.get('mode') !== 'admin')

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    applyTheme(nextTheme)
    notify(`Switched to ${nextTheme} mode`, 'info')
  }

  function openAdmin() {
    navigate('/portal?mode=admin')
  }

  function openUser() {
    navigate('/reports')
  }

  function openStudent() {
    const query = studentQuery.trim().toLowerCase()
    if (!query) return
    const matched = students.find(s =>
      String(s.name || '').toLowerCase().includes(query) ||
      String(s.roll || '').toLowerCase().includes(query)
    )
    if (!matched) {
      notify('No student found for that query', 'error')
      return
    }
    navigate(`/profile/${matched.id}`)
    setStudentQuery('')
  }

  function logout() {
    clearSession()
    notify('Logged out successfully', 'success')
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <div className={styles.wrap}>
        <div className={styles.topRow}>
          <NavLink to="/" className={styles.brand}>
            <span className={styles.logoMark} aria-hidden="true">
              <span className={styles.logoTileA} />
              <span className={styles.logoTileB} />
              <span className={styles.logoTileC} />
            </span>
            <span>AchievoHub</span>
          </NavLink>
          <div className={styles.topRight}>
            {session && (
              <div className={styles.sessionTag}>
                {session.name || 'user'} | {session.role || 'user'}
              </div>
            )}
            <button
              type="button"
              className={styles.themeBtn}
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              <span className={styles.themeIcon} aria-hidden="true">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </button>
            <button type="button" className={styles.logout} onClick={logout}>Logout</button>
          </div>
        </div>

        <div className={styles.middleRow}>
          <div className={styles.switchGroup}>
            <button
              type="button"
              className={`${styles.switchBtn} ${isUserSection ? styles.switchActive : ''}`}
              onClick={openUser}
            >
              User
            </button>
            <button
              type="button"
              className={`${styles.switchBtn} ${isAdminSection ? styles.switchActive : ''}`}
              onClick={openAdmin}
            >
              Admin
            </button>
          </div>

          <div className={styles.studentSearch}>
            <input
              type="text"
              className={styles.searchInput}
              value={studentQuery}
              onChange={e => setStudentQuery(e.target.value)}
              placeholder="Find student by name or ID"
            />
            <button type="button" className={styles.searchBtn} onClick={openStudent}>
              Go
            </button>
          </div>

          <nav className={styles.nav}>
            <NavLink
              to="/reports"
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              Reports
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              Dashboard
            </NavLink>
          </nav>
        </div>

      </div>
    </header>
  )
}

