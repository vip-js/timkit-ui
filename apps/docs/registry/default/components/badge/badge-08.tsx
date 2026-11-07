import { Badge } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Badge onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline" className="gap-1.5">
      <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
      Badge
    </Badge>
  )
}
