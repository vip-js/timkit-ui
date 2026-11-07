import { Button } from '@timui/react'
import { ChevronLeftIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="link" className="gap-1">
      <ChevronLeftIcon className="opacity-60" size={16} aria-hidden="true" />
      Go back
    </Button>
  )
}
