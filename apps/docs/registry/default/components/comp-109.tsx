import { ToggleGroup, ToggleGroupItem } from "@timkit/web"

export default function Component() {
  return (
    <ToggleGroup variant="outline" className="inline-flex" type="single">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  )
}
