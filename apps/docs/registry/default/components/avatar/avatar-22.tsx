import { Button } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <div className="bg-background flex items-center rounded-full border p-1 shadow-sm">
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
      </div>
      <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks}
        variant="secondary"
        className="text-muted-foreground hover:text-foreground flex items-center justify-center rounded-full bg-transparent px-3 text-xs shadow-none hover:bg-transparent"
      >
        +3
      </Button>
    </div>
  )
}
