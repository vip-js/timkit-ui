import { Button } from '@timui/react'
import { LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} disabled>
      <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />
      Button
    </Button>
  )
}
