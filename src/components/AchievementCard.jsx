import React from 'react'
import styles from './AchievementCard.module.css'

export default function AchievementCard({ a, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div>
          <div className={styles.title}>{a.title}</div>
          <div className="small">{a.category} • {a.date}</div>
          <div className="small" style={{marginTop:6}}>{a.description}</div>
        </div>
        {onDelete && (
          <button className="btn btn-danger" onClick={() => onDelete(a.id)}>Delete</button>
        )}
      </div>
    </div>
  )
}

