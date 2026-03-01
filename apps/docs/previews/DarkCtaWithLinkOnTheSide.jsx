import { Button } from "@timui/react";

export default function DarkCtaWithLinkOnTheSide() {
    return (
        <section className="bg-gray-800 py-14">
            <div className="max-w-screen-xl mx-auto px-4  gap-x-12 justify-between md:flex md:px-8">
                <div className="max-w-xl">
                    <h3 className="text-white text-3xl font-semibold sm:text-4xl">
                        Build your SaaS solution with help from our experts
                    </h3>
                    <p className="mt-3 text-gray-300">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                </div>
                <div className="flex-none mt-4 md:mt-0">
                    <Button className="text-gray-800 bg-white hover:bg-gray-100">
                        Learn more
                    </Button>
                </div>
            </div>
        </section>
    )
}
        