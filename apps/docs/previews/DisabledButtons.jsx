import { Button } from "@timui/react";

export default function DisabledButtons() {
    return (
        <div className="btns-container">
            <Button disabled className="px-4 py-2" size="sm">
                Button
            </Button>
            <Button disabled className="px-5 py-2.5" size="default">
                Button
            </Button>
            <Button disabled className="px-6 py-3" size="lg">
                Button
            </Button>
            <Button disabled className="px-7 py-3.5">
                Button
            </Button>
            <Button disabled className="px-8 py-4">
                Button
            </Button>
        </div>
    )
}
        