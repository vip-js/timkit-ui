import React from "react";
import { RadioGroup, RadioGroupItem } from "@timui/react";
export default function ColorPickerRadioGroup() {
    const colors = [
        { value: "blue", bg: "bg-[#2563EB]", ring: "ring-[#2563EB]" },
        { value: "purple", bg: "bg-[#8B5CF6]", ring: "ring-[#8B5CF6]" },
        { value: "pink", bg: "bg-[#DB2777]", ring: "ring-[#DB2777]" },
        { value: "gray", bg: "bg-[#475569]", ring: "ring-[#475569]" },
        { value: "orange", bg: "bg-[#EA580C]", ring: "ring-[#EA580C]" }
    ]
    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h2 className="text-gray-800 font-medium">Pick your favorite color</h2>
            <RadioGroup defaultValue="purple" className="mt-4 flex items-center flex-wrap gap-4">
                {
                    colors.map((item, idx) => (
                        <div key={item.value} className="flex-none">
                            <RadioGroupItem
                                value={item.value}
                                id={item.value}
                                className="peer sr-only"
                            />
                            <label
                                htmlFor={item.value}
                                className={`inline-flex justify-center items-center w-8 h-8 rounded-full peer-checked:ring ring-offset-2 cursor-pointer duration-150 ${item.bg} ${item.ring} relative`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-white absolute inset-0 m-auto z-0 pointer-events-none hidden peer-checked:block duration-150">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </label>
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}
        