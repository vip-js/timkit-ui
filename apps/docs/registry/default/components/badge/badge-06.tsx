import { Badge } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Badge onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="items-baseline gap-1.5">
      Badge
      <span className="text-primary-foreground/60 text-[0.625rem] font-medium">73</span>
    </Badge>
  )
}
