import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllStudents } from '../services/storage'
import { signUpUser } from '../services/auth'

export default function SignUp() {
  const navigate = useNavigate()
  const students = getAllStudents()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      signUpUser({
        name: username,
        email: username.includes('@') ? username : `${username}@achievohub.local`,
        password,
        role,
        studentId: role === 'student' ? (students[0]?.id || '') : ''
      })
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container authCenter">
      <section className="card authCard stack">
        <h2 style={{ margin: 0 }}>Create your account</h2>
        <form onSubmit={submit} className="stack">
          <input
            className="control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
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

          <div className="passwordMeter" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <input
            className="control"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
          />

          <select className="control" value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">User</option>
            <option value="admin">Admin</option>
          </select>

          {error && <div className="small" style={{ color: 'var(--danger)' }}>{error}</div>}

          <button className="btn btn-accent" type="submit">Create Account</button>
        </form>

        <div className="small" style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login" className="link">Log In</Link>
        </div>
      </section>
    </div>
  )
}

