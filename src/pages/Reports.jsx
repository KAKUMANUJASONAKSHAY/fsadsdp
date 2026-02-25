import React from 'react'
import { getAllStudents } from '../services/storage'

export default function Reports() {
  const students = getAllStudents()
  const totalStudents = students.length
  const totalAchievements = students.reduce((acc, s) => acc + s.achievements.length, 0)
  const reportItems = students.map(s => ({
    id: s.id,
    name: s.name,
    roll: s.roll,
    latestTitle: s.achievements[0]?.title || 'General Progress Report'
  }))
  const topStudents = [...students]
    .sort((a, b) => b.achievements.length - a.achievements.length)
    .slice(0, 5)

  return (
    <div className="container page pageNarrow">
      <section className="card stack">
        <h2 style={{ margin: 0 }}>Reports</h2>
        <div className="statsGrid">
          <article className="card">
            <div className="small">Total students</div>
            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700 }}>{totalStudents}</div>
          </article>
          <article className="card">
            <div className="small">Total achievements</div>
            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700 }}>{totalAchievements}</div>
          </article>
        </div>
      </section>

      <section className="card stack">
        <h3 style={{ margin: 0 }}>Student Reports</h3>
        <div className="achievementList">
          {reportItems.map(item => (
            <div key={item.id} className="achRow">
              <div>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div className="small">ID: {item.roll}</div>
              </div>
              <div className="small">{item.latestTitle}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h3 style={{ margin: 0 }}>Top students</h3>
        {topStudents.length === 0 && <div className="small empty">No student data available.</div>}
        <div className="achievementList">
          {topStudents.map(student => (
            <div key={student.id} className="achRow">
              <div>
                <div style={{ fontWeight: 600 }}>{student.name}</div>
                <div className="small">{student.roll}</div>
              </div>
              <div className="small">{student.achievements.length} achievements</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

