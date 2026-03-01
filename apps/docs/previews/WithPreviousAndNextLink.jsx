import React from "react";
import { Button } from "@timui/react";

export default function WithPreviousAndNextLink() {
    const [pages, setPages] = React.useState(["1", "2", "3", , "...", "8", "9", "10",])
    const [currentPage, setCurrentPage] = React.useState("1")
    return (
        <div className="max-w-screen-xl mx-auto mt-16 px-4 text-gray-600 md:px-8">
            <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                <Button variant="outline" href="javascript:void(0)" className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">Previous</Button>
                <div>
                    Page {currentPage} of {pages.length}
                </div>
                <Button variant="outline" href="javascript:void(0)" className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">Next</Button>
            </div>
        </div>
    )
}
        