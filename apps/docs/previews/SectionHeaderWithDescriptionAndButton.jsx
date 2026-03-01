import { Button } from "@timui/react";

export default function SectionHeaderWithDescriptionAndButton() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="items-start justify-between py-4 border-b md:flex">
                <div className="max-w-lg">
                    <h3 className="text-gray-800 text-2xl font-bold">
                        Team members
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
                <div className="mt-6 md:mt-0">
                    <Button size="sm">
                        New member
                    </Button>
                </div>
            </div>
        </div>
    )
}
        