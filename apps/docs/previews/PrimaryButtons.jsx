import { Button } from "@timui/react";

export default function PrimaryButtons() {
    return (
        <div className="flex gap-2">
            <Button size="sm">Button</Button>
            <Button size="default">Button</Button>
            <Button size="lg">Button</Button>
            <Button className="px-6 py-3.5">Button</Button>
            <Button className="px-7 py-4">Button</Button>
        </div>
    )
}
        