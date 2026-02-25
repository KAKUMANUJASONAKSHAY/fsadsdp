import React, { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { getSession, setSession } from '../services/auth'

export default function Portal() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const session = getSession()
  const [mode, setMode] = useState(searchParams.get('mode') === 'admin' ? 'admin' : 'user')
  const [adminCode, setAdminCode] = useState('')
  const [showAdminCode, setShowAdminCode] = useState(false)
  const [error, setError] = useState('')

  if (!session) return <Navigate to="/login" replace />

  function verifyAdmin(e) {
    e.preventDefault()
    setError('')
    if (adminCode !== 'admin123') {
      setError('Invalid admin code')
      return
    }
    setSession({ ...session, role: 'admin', adminVerified: true })
    navigate('/admin')
  }

  return (
    <div className="container page pageNarrow">
      <section className="card stack">
        <div className="roleTabs" style={{ maxWidth: 360 }}>
          <button
            type="button"
            className={`roleTab ${mode === 'user' ? 'roleTabActive' : ''}`}
            onClick={() => {
              setMode('user')
              setError('')
              navigate('/reports')
            }}
          >
            User
          </button>
          <button
            type="button"
            className={`roleTab ${mode === 'admin' ? 'roleTabActive' : ''}`}
            onClick={() => {
              setMode('admin')
              setError('')
            }}
          >
            Admin
          </button>
        </div>

        {mode === 'user' ? (
          <div className="stack">
            <h3 style={{ margin: 0 }}>User Access</h3>
            <div className="small">Opening reports...</div>
          </div>
        ) : (
          <form onSubmit={verifyAdmin} className="stack">
            <h3 style={{ margin: 0 }}>Admin Access</h3>
            <div className="inlineRow">
              <input
                className="control"
                type={showAdminCode ? 'text' : 'password'}
                value={adminCode}
                onChange={e => setAdminCode(e.target.value)}
                placeholder="Enter Admin Code"
                required
              />
              <button type="button" className="btn" onClick={() => setShowAdminCode(v => !v)}>
                {showAdminCode ? 'Hide' : 'Show'}
              </button>
            </div>
            {error && <div className="small" style={{ color: 'var(--danger)' }}>{error}</div>}
            <button className="btn btn-accent" type="submit">Verify</button>
          </form>
        )}
      </section>
    </div>
  )
}
