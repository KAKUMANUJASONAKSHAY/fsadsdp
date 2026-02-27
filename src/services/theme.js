const THEME_KEY = 'ecm_theme_v1'

export function getStoredTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_KEY, theme)
}

export function initTheme() {
  const theme = getStoredTheme()
  applyTheme(theme)
  return theme
}
