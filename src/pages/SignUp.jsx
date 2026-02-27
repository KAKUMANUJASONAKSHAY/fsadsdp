import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllStudents } from '../services/storage'
import { signUpUser, validatePassword } from '../services/auth'
import { notify } from '../services/notifications'

export default function SignUp() {
  const navigate = useNavigate()
  const students = getAllStudents()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const hasLength = password.length >= 8
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/.test(password)

  function submit(e) {
    e.preventDefault()
    setError('')

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      notify(passwordError, 'error')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      notify('Passwords do not match', 'error')
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
      notify('Account created successfully. Please log in.', 'success')
      navigate('/login')
    } catch (err) {
      setError(err.message)
      notify(err.message, 'error')
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
            <span className={hasLength ? 'meterOn' : ''} />
            <span className={hasLength ? 'meterOn' : ''} />
            <span className={hasNumber ? 'meterOn' : ''} />
            <span className={hasSpecial ? 'meterOn' : ''} />
            <span className={hasLength && hasNumber && hasSpecial ? 'meterOn' : ''} />
          </div>
          <div className="small">
            Password must be 8+ characters and include a number and special character.
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

