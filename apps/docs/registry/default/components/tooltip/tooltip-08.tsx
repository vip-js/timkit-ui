import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@timui/react'
import { useState } from 'react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline" size="sm">
            Stats
          </Button>
        </TooltipTrigger>
        <TooltipContent className="py-3">
          <ul className="grid gap-3 text-xs">
            <li className="grid gap-0.5">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium">Completed</span>
            </li>
            <li className="grid gap-0.5">
              <span className="text-muted-foreground">Code Coverage</span>
              <span className="font-medium">94.3%</span>
            </li>
            <li className="grid gap-0.5">
              <span className="text-muted-foreground">Last Deploy</span>
              <span className="font-medium">Today at 15:42</span>
            </li>
            <li className="grid gap-0.5">
              <span className="text-muted-foreground">Performance Score</span>
              <span className="font-medium">98/100</span>
            </li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
