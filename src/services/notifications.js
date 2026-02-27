const listeners = new Set()

export function subscribeNotifications(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function notify(message, type = 'info') {
  for (const listener of listeners) {
    listener({
      id: Date.now() + Math.random(),
      message,
      type
    })
  }
}
