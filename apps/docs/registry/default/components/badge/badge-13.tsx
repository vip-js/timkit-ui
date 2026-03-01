'use client'

import { useState } from 'react'
import { Badge } from '@timui/react'

export default function Component() {
  const [isActive, setIsActive] = useState(true)

  if (!isActive) return null

  return (
    <Badge variant="outline" className="gap-0 rounded-md px-2 py-1">
      Tag
      <button
        className="focus-visible:border-ring focus-visible:ring-ring/50 text-foreground/60 hover:text-foreground -my-[5px] -ms-0.5 -me-2 inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        onClick={() => setIsActive(false)}
        aria-label="Delete"
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="M6 6 18 18" />
        </svg>
      </button>
    </Badge>
  )
}
