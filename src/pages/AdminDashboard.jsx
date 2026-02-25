import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import StudentCard from '../components/StudentCard'
import StudentForm from '../components/forms/StudentForm'
import AchievementForm from '../components/forms/AchievementForm'
import { getAllStudents, addStudent, addAchievement, deleteAchievement } from '../services/storage'

export default function AdminDashboard() {
  const [students, setStudents] = useState(getAllStudents())
  const [selected, setSelected] = useState(null)

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

  return (
    <div className="container page pageNarrow">
      <aside className="stack">
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

        <div
          className="studentGrid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 320px))',
            justifyContent: 'center'
          }}
        >
          {students.map(student => (
            <div key={student.id} onClick={() => handleSelect(student.id)} className="clickable">
              <StudentCard student={student} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

