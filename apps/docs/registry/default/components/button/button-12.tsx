import { Button } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="inline-flex items-center gap-2">
      <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="ghost">Cancel</Button>
      <Button>Save</Button>
    </div>
  )
}
