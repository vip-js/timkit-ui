import { Button } from "@timui/react";

export default function ButtonsWithLowColors() {
  return (
    <div className="btns-container">
        <Button variant="ghost" size="sm" className="px-3 py-1.5">
            Button
        </Button>
        <Button variant="ghost" size="default" className="px-4 py-2">
            Button
        </Button>
        <Button variant="ghost" size="lg" className="px-5 py-3">
            Button
        </Button>
        <Button variant="ghost" className="px-6 py-3.5">
            Button
        </Button>
        <Button variant="ghost" className="px-7 py-4">
            Button
        </Button>
    </div>
  )
}
        