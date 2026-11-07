import { Button } from '@timui/react'
import { SparklesIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline">
      Button
      <SparklesIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
    </Button>
  )
}
