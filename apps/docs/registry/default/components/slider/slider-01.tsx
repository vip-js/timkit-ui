import { Label } from '../../ui/label'
import { Slider } from '../../ui/slider'

export default function Component() {
  return (
    <div className="*:not-first:mt-4">
      <Label>Simple slider</Label>
      <Slider defaultValue={[25]} aria-label="Simple slider" />
    </div>
  )
}
