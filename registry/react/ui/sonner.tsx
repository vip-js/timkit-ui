'use client'

import * as React from 'react'
import { Toaster as Sonner, ToasterProps } from 'sonner'

import { useTheme } from '../hooks/use-theme'

const SonnerToaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          description: 'text-muted-foreground!',
        },
      }}
      {...props}
    />
  )
}

export { SonnerToaster }
