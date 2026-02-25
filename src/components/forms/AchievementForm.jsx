import React, { useState } from 'react'
import styles from './AchievementForm.module.css'

export default function AchievementForm({ onSave }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')
  const [award, setAward] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title) return
    onSave({
      id: 'a' + Date.now(),
      title,
      description: desc,
      date,
      category,
      award
    })
    setTitle(''); setDesc(''); setDate(''); setCategory(''); setAward('')
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}>
        <label className="small">Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className={styles.input} />
      </div>
      <div className={styles.field}>
        <label className="small">Description</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} className={styles.input} />
      </div>
      <div className={styles.row}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className={styles.input} />
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className={styles.input} />
        <input placeholder="Award" value={award} onChange={e => setAward(e.target.value)} className={styles.input} />
      </div>
      <button type="submit" className="btn btn-primary">Add Achievement</button>
    </form>
  )
}
