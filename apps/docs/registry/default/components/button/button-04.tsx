import { Button } from '@timui/react'
import { ArchiveIcon } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks}>
      <ArchiveIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
      Button
    </Button>
  )
}
