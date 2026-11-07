import { Label, Slider } from '@timui/react'

export default function Component() {
  return (
    <div className="*:not-first:mt-4">
      <Label>Simple slider</Label>
      <Slider id="volume" defaultValue={[25]} aria-label="Simple slider" />
    </div>
  )
}
