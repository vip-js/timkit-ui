'use client'

import { useEffect, useState } from 'react'
import { RiMoonClearLine, RiSunLine } from '@remixicon/react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const id = 'theme-toggle'
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [system, setSystem] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const smartToggle = () => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (theme === 'system') {
      setTheme(prefersDarkScheme ? 'light' : 'dark')
      setSystem(false)
    } else if (
      (theme === 'light' && !prefersDarkScheme) ||
      (theme === 'dark' && prefersDarkScheme)
    ) {
      setTheme(theme === 'light' ? 'dark' : 'light')
      setSystem(false)
    } else {
      setTheme('system')
      setSystem(true)
    }
  }

  const getCurrentIcon = () => {
    const active = theme === 'system' ? resolvedTheme : theme
    return active === 'dark' ? 'dark' : 'light'
  }

  const isDark = getCurrentIcon() === 'dark'

  // Render a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center">
        <button
          className="linear-border linear-elevated-hover linear-bg-subtle-hover transition-linear flex size-9 cursor-pointer items-center justify-center rounded-md outline-none ring-foreground/50 focus-visible:ring-2"
          aria-label="Toggle theme"
          disabled
        >
          <RiSunLine size={16} aria-hidden="true" />
          <span className="sr-only">Switch theme</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={smartToggle}
        className="linear-border linear-elevated-hover linear-bg-subtle-hover transition-linear flex size-9 cursor-pointer items-center justify-center rounded-md outline-none ring-foreground/50 focus-visible:ring-2"
        aria-label="Toggle theme"
        title={`Current theme: ${getCurrentIcon()}`}
      >
        {isDark ? (
          <RiMoonClearLine size={16} aria-hidden="true" />
        ) : (
          <RiSunLine size={16} aria-hidden="true" />
        )}
        <span className="sr-only">Switch theme</span>
      </button>
    </div>
  )
}
