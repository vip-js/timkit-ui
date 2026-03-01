import React from "react";
import { RadioGroup, RadioGroupItem } from "@timui/react";
export default function BasicRadioGroup() {
    return (
      <div className="flex justify-center pt-6">
        <div>
            <h2 className="text-gray-800 font-medium">Select user role</h2>
            <RadioGroup defaultValue="admin" className="mt-3 space-y-3">
                <div className="flex items-center gap-x-2.5">
                    <RadioGroupItem value="admin" id="admin" />
                    <label htmlFor="admin" className="text-sm text-gray-700 font-medium">
                        Admin
                    </label>
                </div>
                <div className="flex items-center gap-x-2.5">
                    <RadioGroupItem value="write-read" id="write-read" />
                    <label htmlFor="write-read" className="text-sm text-gray-700 font-medium">
                        Write and Read
                    </label>
                </div>
                <div className="flex items-center gap-x-2.5">
                    <RadioGroupItem value="read-only" id="read-only" />
                    <label htmlFor="read-only" className="text-sm text-gray-700 font-medium">
                        Read only
                    </label>
                </div>
                <div className="flex items-center gap-x-2.5">
                    <RadioGroupItem value="write-only" id="write-only" />
                    <label htmlFor="write-only" className="text-sm text-gray-700 font-medium">
                        Write only
                    </label>
                </div>
            </RadioGroup>
        </div>
      </div>
    )
}
        