import { Label, Slider } from '@timui/react'

export default function Component() {
  return (
    <div className="*:not-first:mt-4">
      <Label>Dual range slider</Label>
      <Slider defaultValue={[25, 75]} step={10} aria-label="Dual range slider" />
    </div>
  )
}
