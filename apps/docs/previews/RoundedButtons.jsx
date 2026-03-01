import { Button } from "@timui/react";

export default function RoundedButtons() {
  return (
        <div className="btns-container">
        <Button size="sm" className="rounded-full px-3 py-1.5">
            Button
        </Button>
        <Button size="default" className="rounded-full px-4 py-2">
            Button
        </Button>
        <Button size="lg" className="rounded-full px-5 py-3">
            Button
        </Button>
        <Button className="rounded-full px-6 py-3.5">
            Button
        </Button>
        <Button className="rounded-full px-7 py-4">
            Button
        </Button>
    </div>
  )
}
        