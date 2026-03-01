import React from "react";
import { Card, CardContent } from "@timui/react";
import { RadioGroup, RadioGroupItem } from "@timui/react";
export default function PricingCardsRadioGroup() {
    const plans = [
        {
            value: "hobby",
            name: "Hobby plan",
            description: "For personal or non-commercial projects.",
        },
        {
            value: "pro",
            name: "Pro plan",
            description: "For team collaboration with advanced features.",
        },
        {
            value: "enterprise",
            name: "Enterprise plan",
            description: "For teams with security,and performance needs.",
        },
    ]
    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h2 className="text-gray-800 font-medium">Find a plan to power your projects</h2>
            <RadioGroup defaultValue="pro" className="mt-6 space-y-3">
                {
                    plans.map((item) => (
                        <div key={item.value} className="relative">
                            <RadioGroupItem
                                value={item.value}
                                id={item.value}
                                className="peer sr-only"
                            />
                            <label
                                htmlFor={item.value}
                                className="block relative cursor-pointer"
                            >
                                <Card className="w-full p-5 rounded-lg border bg-white shadow-sm ring-indigo-600 peer-checked:ring-2 duration-200">
                                    <CardContent className="pl-7 p-0">
                                        <h3 className="leading-none text-gray-800 font-medium">
                                            {item.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                    </CardContent>
                                </Card>
                                <span className="block absolute top-5 left-5 border peer-checked:border-[5px] peer-checked:border-indigo-600 w-4 h-4 rounded-full">
                                </span>
                            </label>
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}
