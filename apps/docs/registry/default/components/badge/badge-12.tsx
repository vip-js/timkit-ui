'use client'

import { useState } from 'react'
import { Badge } from '@timui/react'

export default function Component() {
  const [isActive, setIsActive] = useState(true)

  if (!isActive) return null

  return (
    <Badge className="gap-0">
      Removable
      <button
        className="focus-visible:border-ring focus-visible:ring-ring/50 text-primary-foreground/60 hover:text-primary-foreground -my-px -ms-px -me-1.5 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        onClick={() => setIsActive(false)}
      >
        <svg
          width={12}
          height={12}
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
