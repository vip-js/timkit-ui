import { Button } from '@timui/react'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks}>
      Button
      <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
    </Button>
  )
}
