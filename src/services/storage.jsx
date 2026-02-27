import { sampleData } from '../data/sampleData'

const KEY = 'ecm_storage_v1'

function migrateRollNumbers(data) {
  let changed = false
  let counter = 1
  const students = data.students.map(s => {
    const roll = String(s.roll || '')
    const isValidNewFormat = /^\d{6}$/.test(roll)
    if (!isValidNewFormat) {
      changed = true
      return { ...s, roll: `24${String(counter++).padStart(4, '0')}` }
    }
    counter = Math.max(counter, Number(roll.slice(2)) + 1)
    return s
  })
  return { changed, data: { ...data, students } }
}

function migrateSeedStudents(data) {
  let changed = false
  const existing = data.students || []
  const existingIds = new Set(existing.map(s => s.id))
  const missingStudents = (sampleData.students || []).filter(s => !existingIds.has(s.id))
  if (missingStudents.length === 0) return { changed, data }

  changed = true
  return {
    changed,
    data: {
      ...data,
      students: [...existing, ...missingStudents]
    }
  }
}

function migrateSeedAchievements(data) {
  let changed = false
  const seedStudents = sampleData.students || []
  const students = (data.students || []).map(student => {
    const seed = seedStudents.find(s => s.id === student.id)
    if (!seed || !Array.isArray(seed.achievements)) return student

    const existingIds = new Set((student.achievements || []).map(a => a.id))
    const missing = seed.achievements.filter(a => !existingIds.has(a.id))
    if (missing.length === 0) return student

    changed = true
    return {
      ...student,
      achievements: [...(student.achievements || []), ...missing]
    }
  })

  return { changed, data: { ...data, students } }
}

function read() {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(sampleData))
    return structuredClone(sampleData)
  }
  const parsed = JSON.parse(raw)
  const migratedStudents = migrateSeedStudents(parsed)
  const migratedRolls = migrateRollNumbers(migratedStudents.data)
  const migratedAchievements = migrateSeedAchievements(migratedRolls.data)
  if (migratedStudents.changed || migratedRolls.changed || migratedAchievements.changed) {
    write(migratedAchievements.data)
  }
  return migratedAchievements.data
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getAllStudents() {
  return read().students
}

export function getStudentById(id) {
  return getAllStudents().find(s => s.id === id)
}

export function addStudent(student) {
  const store = read()
  const nextRoll = `24${String(store.students.length + 1).padStart(4, '0')}`
  store.students.push({ ...student, roll: /^\d{6}$/.test(String(student.roll || '')) ? student.roll : nextRoll })
  write(store)
}

export function updateStudent(updated) {
  const store = read()
  store.students = store.students.map(s => s.id === updated.id ? updated : s)
  write(store)
}

export function deleteStudent(studentId) {
  const store = read()
  store.students = store.students.filter(s => s.id !== studentId)
  write(store)
}

export function addAchievement(studentId, achievement) {
  const store = read()
  const s = store.students.find(x => x.id === studentId)
  if (!s) throw new Error('student not found')
  s.achievements.push(achievement)
  write(store)
}

export function deleteAchievement(studentId, achId) {
  const store = read()
  const s = store.students.find(x => x.id === studentId)
  if (!s) throw new Error('student not found')
  s.achievements = s.achievements.filter(a => a.id !== achId)
  write(store)
}

