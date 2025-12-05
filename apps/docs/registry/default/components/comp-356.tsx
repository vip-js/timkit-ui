import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@timkit/web"

export default function Component() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            W/ arrow
          </Button>
        </TooltipTrigger>
        <TooltipContent className="dark px-2 py-1 text-xs" showArrow={true}>
          This tooltip has an arrow
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
