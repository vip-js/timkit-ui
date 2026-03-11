/**
 * Inline theme detection hook - no npm dependency required.
 * Replaces next-themes' useTheme for the purpose of detecting system dark/light theme.
 */
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

let _theme: Theme = 'system'
const _listeners = new Set<() => void>()

function applyTheme(theme: Theme) {
  _theme = theme
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else if (theme === 'light') {
    root.classList.remove('dark')
    root.classList.add('light')
  } else {
    // system
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
    root.classList.toggle('light', !prefersDark)
  }
  _listeners.forEach((fn) => fn())
}

function getResolvedTheme(): 'light' | 'dark' {
  if (_theme === 'dark') return 'dark'
  if (_theme === 'light') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => _theme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return getResolvedTheme()
  })

  useEffect(() => {
    const update = () => {
      setTheme(_theme)
      setResolvedTheme(getResolvedTheme())
    }
    _listeners.add(update)

    // Listen to system preference changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', update)

    return () => {
      _listeners.delete(update)
      mq.removeEventListener('change', update)
    }
  }, [])

  return {
    theme,
    resolvedTheme,
    setTheme: (t: Theme) => {
      applyTheme(t)
    },
    systemTheme:
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ('dark' as const)
        : ('light' as const),
  }
}
