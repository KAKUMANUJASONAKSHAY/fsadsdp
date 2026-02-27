import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import StudentCard from '../components/StudentCard'
import StudentForm from '../components/forms/StudentForm'
import AchievementForm from '../components/forms/AchievementForm'
import { getAllStudents, addStudent, addAchievement, deleteAchievement, deleteStudent } from '../services/storage'
import { notify } from '../services/notifications'

export default function AdminDashboard() {
  const [students, setStudents] = useState(getAllStudents())
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')

  function refresh() {
    setStudents(getAllStudents())
    setSelected(null)
  }

  function handleAddStudent(student) {
    addStudent(student)
    refresh()
  }

  function handleSelect(id) {
    setSelected(getAllStudents().find(s => s.id === id))
  }

  function handleAddAchievementForSelected(achievement) {
    if (!selected) return
    addAchievement(selected.id, achievement)
    setStudents(getAllStudents())
    setSelected(getAllStudents().find(s => s.id === selected.id))
  }

  function handleDeleteAchievement(achievementId) {
    if (!selected) return
    deleteAchievement(selected.id, achievementId)
    setStudents(getAllStudents())
    setSelected(getAllStudents().find(s => s.id === selected.id))
  }

  function handleDeleteStudent() {
    if (!selected) return
    const confirmed = window.confirm(`Delete student "${selected.name}" and all achievements?`)
    if (!confirmed) return
    deleteStudent(selected.id)
    notify('Student deleted successfully', 'success')
    refresh()
  }

  const filteredStudents = students.filter(student =>
    String(student.name || '').toLowerCase().includes(query.trim().toLowerCase()) ||
    String(student.roll || '').toLowerCase().includes(query.trim().toLowerCase())
  )
  const studentCount = students.length
  const achievementCount = students.reduce((acc, s) => acc + s.achievements.length, 0)

  return (
    <div className="container page pageNarrow">
      <aside className="stack">
        <section className="card statStrip">
          <article>
            <div className="small">Students</div>
            <div className="statValue">{studentCount}</div>
          </article>
          <article>
            <div className="small">Achievements</div>
            <div className="statValue">{achievementCount}</div>
          </article>
        </section>
        <StudentForm onSave={handleAddStudent} />

        {selected ? (
          <section className="card stack">
            <div>
              <div style={{ fontWeight: 700 }}>{selected.name}</div>
              <div className="small">{selected.roll} - {selected.class}</div>
            </div>

            <div className="achievementList">
              {selected.achievements.length === 0 && <div className="empty small">No achievements yet</div>}
              {selected.achievements.map(achievement => (
                <div key={achievement.id} className="achRow">
                  <div>
                    <div style={{ fontWeight: 600 }}>{achievement.title}</div>
                    <div className="small">{achievement.date} - {achievement.category}</div>
                  </div>
                  <button className="btn btn-danger" onClick={() => handleDeleteAchievement(achievement.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <AchievementForm onSave={handleAddAchievementForSelected} />
            <button className="btn btn-danger" type="button" onClick={handleDeleteStudent}>
              Delete Student
            </button>
          </section>
        ) : (
          <div className="card small empty">Select a student to manage achievements.</div>
        )}
      </aside>

      <section className="stack">
        <h2 style={{ margin: 0, textAlign: 'center' }}>Students</h2>
        <div style={{ textAlign: 'center' }}>
          <Link to="/" className="link">Back to login</Link>
        </div>
        <input
          className="control"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search students by name or ID"
        />

        <div
          className="studentGrid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 320px))',
            justifyContent: 'center'
          }}
        >
          {filteredStudents.map(student => (
            <div key={student.id} onClick={() => handleSelect(student.id)} className="clickable">
              <StudentCard student={student} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

