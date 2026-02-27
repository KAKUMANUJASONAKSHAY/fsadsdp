const USERS_KEY = 'ecm_users_v1'
const SESSION_KEY = 'ecm_session_v1'

const seedUsers = [
  {
    id: 'u_admin',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'Admin@123',
    role: 'admin'
  }
]

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must include at least one number'
  }
  if (!/[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]/.test(password)) {
    return 'Password must include at least one special character'
  }
  return ''
}

function readUsers() {
  const raw = localStorage.getItem(USERS_KEY)
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers))
    return [...seedUsers]
  }
  return JSON.parse(raw)
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signUpUser(userInput) {
  const users = readUsers()
  const exists = users.some(u => u.email.toLowerCase() === userInput.email.toLowerCase())
  if (exists) {
    throw new Error('Account already exists with this email/username. Please log in.')
  }
  const passwordError = validatePassword(userInput.password)
  if (passwordError) {
    throw new Error(passwordError)
  }

  const user = {
    id: 'u_' + Date.now(),
    name: userInput.name,
    email: userInput.email,
    password: userInput.password,
    role: userInput.role,
    studentId: userInput.studentId || ''
  }

  users.push(user)
  writeUsers(users)
  return user
}

export function loginUser(identifier, password) {
  const users = readUsers()
  const matchedUser = users.find(u => {
    const matchesEmail = u.email.toLowerCase() === identifier.toLowerCase()
    const matchesName = u.name.toLowerCase() === identifier.toLowerCase()
    return (matchesEmail || matchesName) && u.password === password
  })

  if (matchedUser) return matchedUser
  return null
}

export function setSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      role: user.role,
      studentId: user.studentId || '',
      adminVerified: Boolean(user.adminVerified)
    })
  )
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

