import { Button } from "@timkit/web"

export default function TestButtonPage() {
  return (
    <div className="space-y-4 p-10">
      <h1 className="text-2xl font-bold">Button Test</h1>
      <div className="flex gap-4">
        <Button>Default Button</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  )
}
