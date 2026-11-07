import { Button } from '@timui/react'
import { StarIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks}>
      <StarIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
      <span className="flex items-baseline gap-2">
        Star
        <span className="text-primary-foreground/60 text-xs">729</span>
      </span>
    </Button>
  )
}
