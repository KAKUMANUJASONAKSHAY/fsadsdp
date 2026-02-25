import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import { clearSession, getSession } from '../services/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const session = getSession()

  function openAdmin() {
    navigate('/portal?mode=admin')
  }

  function openUser() {
    navigate('/reports')
  }

  function logout() {
    clearSession()
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
            <button type="button" className={styles.logout} onClick={logout}>Logout</button>
          </div>
        </div>

        <div className={styles.middleRow}>
          <div className={styles.switchGroup}>
            <button type="button" className={styles.switchBtn} onClick={openUser}>User</button>
            <button type="button" className={styles.switchBtn} onClick={openAdmin}>Admin</button>
          </div>

          <nav className={styles.nav}>
            <NavLink
              to="/reports"
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              Library
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
