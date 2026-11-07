import { Button } from '@timui/react'
import { ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} className="group h-auto gap-4 py-3 text-left" variant="outline">
      <div className="space-y-1">
        <h3>Talent Agency</h3>
        <p className="text-muted-foreground font-normal whitespace-break-spaces">
          Matches for your roster
        </p>
      </div>
      <ChevronRightIcon
        className="opacity-60 transition-transform group-hover:translate-x-0.5"
        size={16}
        aria-hidden="true"
      />
    </Button>
  )
}
