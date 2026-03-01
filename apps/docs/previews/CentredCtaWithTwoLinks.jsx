import { Button } from "@timui/react";

export default function CentredCtaWithTwoLinks() {
    return (
        <section className="py-14">
            <div className="max-w-screen-xl mx-auto px-4 md:text-center md:px-8">
                <div className="max-w-xl md:mx-auto">
                    <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                        Build the future with us
                    </h3>
                    <p className="mt-3 text-gray-600">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident.
                    </p>
                </div>
                <div className="flex gap-3 items-center mt-4 md:justify-center">
                    <Button>
                        Get started
                    </Button>
                    <Button variant="outline">
                        Learn more
                    </Button>
                </div>
            </div>
        </section>
    )
}
        