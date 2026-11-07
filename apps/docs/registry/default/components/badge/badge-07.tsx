import { Badge } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Badge onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline" className="gap-1">
      <svg
        className="text-emerald-500"
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
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Badge
    </Badge>
  )
}
