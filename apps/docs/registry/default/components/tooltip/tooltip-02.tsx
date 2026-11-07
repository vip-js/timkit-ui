import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline" size="sm">
            Dark
          </Button>
        </TooltipTrigger>
        <TooltipContent className="dark px-2 py-1 text-xs">
          This tooltip will be always dark
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
