import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, setSession } from '../services/auth'
import CaptchaBox from '../components/CaptchaBox'
import { notify } from '../services/notifications'
import { applyTheme, getStoredTheme } from '../services/theme'

export default function Login() {
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loginMode, setLoginMode] = useState('user')
  const [captchaCode, setCaptchaCode] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [theme, setTheme] = useState(() => getStoredTheme())
  const [error, setError] = useState('')

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  function submit(e) {
    e.preventDefault()
    setError('')
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError('Captcha verification failed')
      notify('Captcha verification failed', 'error')
      return
    }

    const existingUser = loginUser(identifier, password)
    const user = existingUser || {
      id: 'u_demo_' + Date.now(),
      name: identifier || (loginMode === 'admin' ? 'Admin User' : 'Demo User'),
      email: identifier?.includes('@') ? identifier : `${identifier || 'demo'}@achievohub.local`,
      role: loginMode === 'admin' ? 'admin' : 'student',
      studentId: 's1'
    }

    if (loginMode === 'admin') {
      setSession({ ...user, role: 'admin', adminVerified: true })
      notify(`Welcome back, ${user.name || 'Admin'}!`, 'success')
      navigate('/admin')
      return
    }

    setSession({ ...user, adminVerified: false })
    notify(`Welcome back, ${user.name || 'User'}!`, 'success')
    navigate('/portal')
  }

  return (
    <div className="container authCenter">
      <section className="card authSplit">
        <aside className="authBrandPanel">
          <div className="authLogoWrap">
            <span className="authLogoMark" aria-hidden="true">
              <span className="authLogoTileA" />
              <span className="authLogoTileB" />
              <span className="authLogoTileC" />
            </span>
            <h1 className="authBrandTitle">AchievoHub</h1>
          </div>
          <p className="small">Track achievements, monitor reports, and manage student growth with confidence.</p>
          <p className="small">
            Unified dashboards for students and admins, secure authentication, and actionable insights in one place.
          </p>
          <p className="small">
            Built for faster reporting, better visibility, and smoother academic performance tracking.
          </p>
        </aside>

        <div className="stack">
          <div className="authHeaderRow">
            <h2 style={{ margin: 0 }}>Login</h2>
            <button
              type="button"
              className="themeIconBtn"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
          <div className="roleTabs">
            <button
              type="button"
              className={`roleTab ${loginMode === 'user' ? 'roleTabActive' : ''}`}
              onClick={() => setLoginMode('user')}
            >
              User Login
            </button>
            <button
              type="button"
              className={`roleTab ${loginMode === 'admin' ? 'roleTabActive' : ''}`}
              onClick={() => setLoginMode('admin')}
            >
              Admin Login
            </button>
          </div>
          <form onSubmit={submit} className="stack">
            <input
              className="control"
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Username or Email"
              required
            />

            <input
              className="control"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            <CaptchaBox onChange={setCaptchaCode} />
            <input
              className="control"
              type="text"
              value={captchaInput}
              onChange={e => setCaptchaInput(e.target.value)}
              placeholder="Enter CAPTCHA text"
              autoComplete="off"
              required
            />

            {error && <div className="small" style={{ color: 'var(--danger)' }}>{error}</div>}

            <button className="btn btn-accent" type="submit">Login</button>
          </form>

          <div className="small" style={{ textAlign: 'center' }}>
            Don't have an account? <Link to="/signup" className="link">Sign Up</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

