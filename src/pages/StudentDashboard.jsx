import React from 'react'
import { Link, useParams } from 'react-router-dom'
import AchievementCard from '../components/AchievementCard'
import { getStudentById } from '../services/Storage'

export default function StudentDashboard() {
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
      <section className="card">
        <div className="header-row">
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{student.name}</div>
            <div className="small">{student.roll} - {student.class}</div>
          </div>
          <Link to={`/profile/${student.id}`} className="link">View profile</Link>
        </div>
      </section>

      <section className="stack">
        {student.achievements.length === 0 && <div className="card empty small">No achievements yet.</div>}
        <div className="achievementList">
          {student.achievements.map(achievement => (
            <AchievementCard key={achievement.id} a={achievement} />
          ))}
        </div>
      </section>
    </div>
  )
}
