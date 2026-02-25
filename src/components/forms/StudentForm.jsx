import React, { useState } from 'react'
import styles from './StudentForm.module.css'

export default function StudentForm({ onSave }) {
  const [name, setName] = useState('')
  const [roll, setRoll] = useState('')
  const [cls, setCls] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!name || !roll) return
    const student = {
      id: 's' + Date.now(),
      name,
      roll,
      class: cls,
      achievements: []
    }
    onSave(student)
    setName(''); setRoll(''); setCls('')
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}>
        <label className="small">Name</label>
        <input value={name} onChange={e => setName(e.target.value)} className={styles.input} />
      </div>
      <div className={styles.field}>
        <label className="small">Roll</label>
        <input value={roll} onChange={e => setRoll(e.target.value)} className={styles.input} />
      </div>
      <div className={styles.field}>
        <label className="small">Class</label>
        <input value={cls} onChange={e => setCls(e.target.value)} className={styles.input} />
      </div>
      <button type="submit" className="btn btn-primary">Add Student</button>
    </form>
  )
}

