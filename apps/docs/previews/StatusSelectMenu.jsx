import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@timui/react";
export default function StatusSelectMenu() {
    const menuItems = [
        { value: "normal", label: "Normal", bg: "bg-blue-600", textColor: "text-blue-600" },
        { value: "error", label: "Error", bg: "bg-red-600", textColor: "text-red-600" },
        { value: "pending", label: "Pending", bg: "bg-teal-600", textColor: "text-teal-600" },
        { value: "canceled", label: "Canceled", bg: "bg-gray-300", textColor: "text-gray-600" },
        { value: "reviewing", label: "Reviewing", bg: "bg-fuchsia-600", textColor: "text-fuchsia-600" },
    ]
    return (
        <div className="max-w-xs px-4 mx-auto mt-12 text-base">
            <Select defaultValue="normal">
                <SelectTrigger className="flex items-center justify-between gap-2 w-full px-3 py-2 text-gray-500 bg-white border rounded-md shadow-sm cursor-default outline-none focus:border-indigo-600">
                    <SelectValue>
                        {(selectedValue) => {
                            const item = menuItems.find(i => i.value === selectedValue);
                            return item ? (
                                <div className="flex items-center gap-x-3">
                                    Status <span className={`w-2 h-2 rounded-full ${item.bg}`}></span>
                                    <span className={`text-sm ${item.textColor}`}>{item.label}</span>
                                </div>
                            ) : "Select status";
                        }}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full mt-3 bg-white border rounded-md shadow-sm max-h-64">
                    {menuItems.map((item) => (
                        <SelectItem key={item.value} value={item.value} className="flex items-center justify-between gap-2 px-3 py-2 cursor-default duration-150 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50">
                            <div className="flex items-center gap-x-3">
                                <span className={`w-2 h-2 rounded-full ${item.bg}`}></span>
                                {item.label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
