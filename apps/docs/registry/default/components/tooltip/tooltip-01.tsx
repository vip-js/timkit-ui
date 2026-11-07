import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline" size="sm">
            Tiny
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">This is a simple tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
