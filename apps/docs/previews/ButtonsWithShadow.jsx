import { Button } from "@timui/react";

export default function ButtonsWithShadow() {
    return (
        <div className="btns-container">
            <Button className="shadow-md focus:shadow-none px-4 py-2" size="sm">
                Button
            </Button>
            <Button className="shadow-md focus:shadow-none px-5 py-2.5" size="default">
                Button
            </Button>
            <Button className="shadow-md focus:shadow-none px-6 py-3" size="lg">
                Button
            </Button>
            <Button className="shadow-md focus:shadow-none px-7 py-3.5">
                Button
            </Button>
            <Button className="shadow-md focus:shadow-none px-8 py-4">
                Button
            </Button>
        </div>
    )
}
        