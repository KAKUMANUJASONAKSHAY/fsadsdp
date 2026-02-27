import React, { useEffect, useState } from 'react'
import { subscribeNotifications } from '../services/notifications'

export default function ToastHost() {
  const [items, setItems] = useState([])

  useEffect(() => {
    return subscribeNotifications(item => {
      setItems(prev => [...prev, item])
      window.setTimeout(() => {
        setItems(prev => prev.filter(x => x.id !== item.id))
      }, 2800)
    })
  }, [])

  return (
    <div className="toastHost" aria-live="polite">
      {items.map(item => (
        <div key={item.id} className={`toast toast-${item.type}`}>
          {item.message}
        </div>
      ))}
    </div>
  )
}
