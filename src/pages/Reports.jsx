import React, { useState } from 'react'
import { getAllStudents } from '../services/storage'

export default function Reports() {
  const students = getAllStudents()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('name_asc')
  const [classFilter, setClassFilter] = useState('all')
  const totalStudents = students.length
  const totalAchievements = students.reduce((acc, s) => acc + s.achievements.length, 0)
  const reportItems = students.map(s => ({
    id: s.id,
    name: s.name,
    roll: s.roll,
    class: s.class,
    achievements: s.achievements.length,
    latestTitle: s.achievements[0]?.title || 'General Progress Report'
  }))
  const topStudents = [...students]
    .sort((a, b) => b.achievements.length - a.achievements.length)
    .slice(0, 5)
  const classes = ['all', ...new Set(students.map(s => s.class).filter(Boolean))]
  const q = query.trim().toLowerCase()
  const filteredReports = reportItems.filter(item => {
    const matchesQuery =
      !q ||
      String(item.name || '').toLowerCase().includes(q) ||
      String(item.roll || '').toLowerCase().includes(q)
    const matchesClass = classFilter === 'all' || item.class === classFilter
    return matchesQuery && matchesClass
  })

  filteredReports.sort((a, b) => {
    if (sortBy === 'name_desc') return b.name.localeCompare(a.name)
    if (sortBy === 'achievements_desc') return b.achievements - a.achievements
    if (sortBy === 'achievements_asc') return a.achievements - b.achievements
    return a.name.localeCompare(b.name)
  })

  function exportCsv() {
    const headers = ['Name', 'Roll', 'Class', 'Achievements', 'Latest']
    const lines = filteredReports.map(item =>
      [item.name, item.roll, item.class, String(item.achievements), item.latestTitle]
        .map(value => `"${String(value ?? '').replaceAll('"', '""')}"`)
        .join(',')
    )
    const csv = [headers.join(','), ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'achievohub-reports.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

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
        <div className="reportToolbar">
          <input
            className="control"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or ID"
          />
          <select className="control" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            {classes.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All classes' : c}</option>
            ))}
          </select>
          <select className="control" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
            <option value="achievements_desc">Most achievements</option>
            <option value="achievements_asc">Least achievements</option>
          </select>
          <button type="button" className="btn btn-accent" onClick={exportCsv}>Export CSV</button>
        </div>
        <div className="reportGrid">
          {filteredReports.map(item => (
            <article key={item.id} className="reportBox">
              <div className="reportBoxTitle">{item.name}</div>
              <div className="small">ID: {item.roll}</div>
              <div className="small">Class: {item.class || '-'}</div>
              <div className="small reportBoxMeta">{item.latestTitle}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h3 style={{ margin: 0 }}>Top students</h3>
        {topStudents.length === 0 && <div className="small empty">No student data available.</div>}
        <div className="reportGrid">
          {topStudents.map(student => (
            <article key={student.id} className="reportBox">
              <div className="reportBoxTitle">{student.name}</div>
              <div className="small">{student.roll}</div>
              <div className="small reportBoxMeta">{student.achievements.length} achievements</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
