import { Button } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="flex -space-x-3">
      <img
        className="ring-background rounded-full ring-2"
        src="/avatar-80-03.jpg"
        width={40}
        height={40}
        alt="Avatar 01"
      />
      <img
        className="ring-background rounded-full ring-2"
        src="/avatar-80-04.jpg"
        width={40}
        height={40}
        alt="Avatar 02"
      />
      <img
        className="ring-background rounded-full ring-2"
        src="/avatar-80-05.jpg"
        width={40}
        height={40}
        alt="Avatar 03"
      />
      <img
        className="ring-background rounded-full ring-2"
        src="/avatar-80-06.jpg"
        width={40}
        height={40}
        alt="Avatar 04"
      />
      <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks}
        variant="secondary"
        className="bg-secondary text-muted-foreground ring-background hover:bg-secondary hover:text-foreground flex size-10 items-center justify-center rounded-full text-xs ring-2"
        size="icon"
      >
        +3
      </Button>
    </div>
  )
}
