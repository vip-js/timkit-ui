import { Button } from "@timui/react";

export default function SectionHeaderWithButtons() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="items-start justify-between py-4 border-b md:flex">
                <div>
                    <h3 className="text-gray-800 text-2xl font-bold">
                        Analytics
                    </h3>
                </div>
                <div className="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
                    <Button size="sm">
                        Browse reports
                    </Button>
                    <Button variant="outline" size="sm">
                        Engagement
                    </Button>
                </div>
            </div>
        </div>
    )
}
        