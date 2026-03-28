'use client'

import { useState } from 'react'
import { cn } from '@timui/core'

export default function AppToggle() {
  const [selectedValue, setSelectedValue] = useState('on')

  return (
    <div className="bg-input/50 relative inline-grid h-8 grid-cols-2 rounded-md p-0.5 text-sm font-medium">
      <span
        aria-hidden="true"
        className={cn(
          'bg-background pointer-events-none absolute inset-y-0 m-0.5 w-[calc(50%-2px)] rounded-sm shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          selectedValue === 'on' ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
        )}
      />
      <button
        type="button"
        aria-pressed={selectedValue === 'off'}
        onClick={() => setSelectedValue('off')}
        className={cn(
          'relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-3 whitespace-nowrap transition-colors select-none',
          selectedValue === 'on' && 'text-muted-foreground/70'
        )}
      >
        Sitemap
      </button>
      <button
        type="button"
        aria-pressed={selectedValue === 'on'}
        onClick={() => setSelectedValue('on')}
        className={cn(
          'relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-3 whitespace-nowrap transition-colors select-none',
          selectedValue === 'off' && 'text-muted-foreground/70'
        )}
      >
        Wireframe
      </button>
    </div>
  )
}
