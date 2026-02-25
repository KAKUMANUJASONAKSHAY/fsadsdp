import React from 'react'
import { Link } from 'react-router-dom'
import styles from './StudentCard.module.css'

export default function StudentCard({ student }) {
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div>
          <div className={styles.name}>{student.name}</div>
          <div className="small">{student.roll} • {student.class}</div>
        </div>
        <div className={styles.right}>
          <div className="small">{student.achievements.length} achievements</div>
          <Link to={`/profile/${student.id}`} className="link">View profile</Link>
        </div>
      </div>
    </div>
  )
}
