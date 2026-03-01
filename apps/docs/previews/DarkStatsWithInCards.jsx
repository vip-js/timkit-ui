import React from "react";
import { Card, CardContent } from "@timui/react";
export default function DarkStatsWithInCards() {
    const stats = [
        {
            data: "35K",
            title: "Customers"
        },
        {
            data: "40+",
            title: "Countries"
        },
        {
            data: "30M+",
            title: "Total revenue"
        },
    ]
    return (
        <section className="py-28 bg-gray-900">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h3 className="text-white text-3xl font-semibold sm:text-4xl">
                        Our customers are always happy
                    </h3>
                    <p className="mt-3 text-gray-300">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi venenatis sollicitudin quam ut tincidunt.
                    </p>
                </div>
                <div className="mt-12">
                    <ul className="flex flex-col gap-4 items-center justify-center sm:flex-row">
                        {
                            stats.map((item, idx) => (
                                <Card key={idx} className="w-full text-center bg-gray-800 px-12 py-4 rounded-lg sm:w-auto border-0">
                                    <CardContent className="p-0">
                                        <h4 className="text-4xl text-white font-semibold">{item.data}</h4>
                                        <p className="mt-3 text-gray-400 font-medium">{item.title}</p>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}
        