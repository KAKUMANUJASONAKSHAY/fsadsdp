import React from 'react'
import { getAllStudents } from '../services/storage'

export default function Dashboard() {
  const students = getAllStudents()
  const achievements = students.flatMap(student =>
    student.achievements.map(achievement => ({ ...achievement, studentName: student.name, roll: student.roll }))
  )
  const totalStudents = students.length
  const totalAchievements = achievements.length
  const activeStudents = students.filter(s => s.achievements.length > 0).length
  const participationRate = totalStudents ? Math.round((activeStudents / totalStudents) * 100) : 0

  const categories = achievements.reduce((acc, item) => {
    const key = item.category || 'Other'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const topCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const topStudents = [...students]
    .sort((a, b) => b.achievements.length - a.achievements.length)
    .slice(0, 5)

  const recentAchievements = [...achievements]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5)

  return (
    <div className="container page pageNarrow">
      <h2 style={{ margin: 0 }}>Dashboard</h2>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 12
        }}
      >
        <article className="card stack" style={{ minHeight: 130 }}>
          <h3 style={{ margin: 0 }}>Total Students</h3>
          <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1 }}>{totalStudents}</div>
        </article>
        <article className="card stack" style={{ minHeight: 130 }}>
          <h3 style={{ margin: 0 }}>Total Achievements</h3>
          <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1 }}>{totalAchievements}</div>
        </article>
        <article className="card stack" style={{ minHeight: 130 }}>
          <h3 style={{ margin: 0 }}>Participation Rate</h3>
          <div style={{ fontSize: 46, fontWeight: 700, lineHeight: 1 }}>{participationRate}%</div>
        </article>
      </section>

      <section className="stack" style={{ marginTop: 6 }}>
        <h2 style={{ margin: 0 }}>Top Categories</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 12
          }}
        >
          {topCategories.map(([category, count]) => (
            <article key={category} className="card stack" style={{ minHeight: 120 }}>
              <h3 style={{ margin: 0 }}>{category}</h3>
              <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1 }}>{count}</div>
            </article>
          ))}
          {topCategories.length === 0 && (
            <article className="card small">No category data yet.</article>
          )}
        </div>
      </section>

      <section className="stack" style={{ marginTop: 6 }}>
        <h2 style={{ margin: 0 }}>Recent Achievements</h2>
        <div className="achievementList">
          {recentAchievements.map(item => (
            <div key={item.id} className="achRow">
              <div>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div className="small">{item.studentName} ({item.roll})</div>
              </div>
              <div className="small">{item.date || '-'}</div>
            </div>
          ))}
          {recentAchievements.length === 0 && <div className="card small">No achievements yet.</div>}
        </div>
      </section>

      <section className="stack" style={{ marginTop: 6 }}>
        <h2 style={{ margin: 0 }}>Top Students</h2>
        <div className="achievementList">
          {topStudents.map(student => (
            <div key={student.id} className="achRow">
              <div>
                <div style={{ fontWeight: 600 }}>{student.name}</div>
                <div className="small">ID: {student.roll}</div>
              </div>
              <div className="small">{student.achievements.length} achievements</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

