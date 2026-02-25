import React from 'react'
import { useParams } from 'react-router-dom'
import AchievementCard from '../components/AchievementCard'
import { getStudentById } from '../services/storage'

export default function StudentProfile() {
  const { id } = useParams()
  const student = getStudentById(id)

  if (!student) {
    return (
      <div className="container">
        <div className="card">Student not found</div>
      </div>
    )
  }

  return (
    <div className="container page pageNarrow">
      <section className="card stack">
        <h2 style={{ margin: 0 }}>Profile</h2>
        <div style={{ fontWeight: 700 }}>{student.name}</div>
        <div className="small">{student.roll} - {student.class}</div>
      </section>

      <section className="card stack">
        <h3 style={{ margin: 0 }}>Achievements</h3>
        {student.achievements.length === 0 && <div className="small empty">No achievements available.</div>}
        <div className="achievementList">
          {student.achievements.map(achievement => (
            <AchievementCard key={achievement.id} a={achievement} />
          ))}
        </div>
      </section>
    </div>
  )
}

