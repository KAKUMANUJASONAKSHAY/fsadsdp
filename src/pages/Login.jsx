import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, setSession } from '../services/auth'

export default function Login() {
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    setError('')

    const user = loginUser(identifier, password)
    if (!user) {
      setError('Invalid username/email or password')
      return
    }

    setSession({ ...user, adminVerified: false })
    navigate('/portal')
  }

  return (
    <div className="container authCenter">
      <section className="card authCard stack">
        <h2 style={{ margin: 0 }}>Login to AchievoHub</h2>
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

          {error && <div className="small" style={{ color: 'var(--danger)' }}>{error}</div>}

          <button className="btn btn-accent" type="submit">Login</button>
        </form>

        <div className="small" style={{ textAlign: 'center' }}>
          Don't have an account? <Link to="/signup" className="link">Sign Up</Link>
        </div>
      </section>
    </div>
  )
}

