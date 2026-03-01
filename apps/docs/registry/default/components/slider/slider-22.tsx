import { Label, Slider } from '@timui/react'

export default function Component() {
  return (
    <div className="*:not-first:mt-4">
      <Label>Vertical slider</Label>
      <div className="flex h-40 justify-center">
        <Slider defaultValue={[5]} max={10} orientation="vertical" aria-label="Vertical slider" />
      </div>
    </div>
  )
}
