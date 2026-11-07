import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Textarea,
} from '@timui/react'

export default function Component() {
  const [demoClicks, setDemoClicks] = useState(0)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => setDemoClicks((count) => count + 1)} data-clicks={demoClicks} variant="outline">Feedback</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send us feedback</DialogTitle>
          <DialogDescription>
            Watch{' '}
            <a className="text-foreground hover:underline" href="#">
              tutorials
            </a>
            , read Timkit UI&lsquo;s{' '}
            <a className="text-foreground hover:underline" href="#">
              documentation
            </a>
            , or join our{' '}
            <a className="text-foreground hover:underline" href="#">
              Discord
            </a>{' '}
            for community help.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5">
          <Textarea
            id="feedback"
            placeholder="How can we improve Timkit UI?"
            aria-label="Send feedback"
          />
          <div className="flex flex-col sm:flex-row sm:justify-end">
            <Button type="button">Send feedback</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
