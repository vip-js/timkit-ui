import React from "react";
import { Button } from "@timui/react";
export default function PaginationWithCurrentPageInfo() {
    const [pages, setPages] = React.useState(["1", "2", "3", , "...", "8", "9", "10",])
    const [currentPage, setCurrentPage] = React.useState("1")
    return (
        <div className="max-w-screen-xl mx-auto mt-16 px-4 text-gray-600 md:px-8">
            <div className="hidden justify-between text-sm md:flex">
                <div>
                    Page {currentPage} of {pages.length}
                </div>
                <div className="flex items-center gap-12" aria-label="Pagination">
                    <Button variant="link" href="javascript:void(0)" className="hover:text-indigo-600">
                        Previous
                    </Button>
                    <ul className="flex items-center gap-1">
                        {
                            pages.map((item, idx) => (
                                <li key={item}>
                                    {
                                        item == "..." ? (
                                            <div>
                                                {item}
                                            </div>
                                        ) : (
                                            <Button variant="ghost" href="javascript:void(0)" aria-current={currentPage == item ? "page" : false} className={`px-3 py-2 rounded-lg duration-150 hover:text-white hover:bg-indigo-600 ${currentPage == item ? "bg-indigo-600 text-white font-medium" : ""}`}>
                                                {item}
                                            </Button>
                                        )
                                    }
                                </li>
                            ))
                        }
                    </ul>
                    <Button variant="link" href="javascript:void(0)" className="hover:text-indigo-600">
                        Next
                    </Button>
                </div>
            </div>
            {/* On mobile version */}
            <div className="flex items-center justify-between text-sm text-gray-600 font-medium md:hidden">
                <Button variant="ghost" href="javascript:void(0)" className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">Previous</Button>
                <div className="font-medium">
                    Page {currentPage} of {pages.length}
                </div>
                <Button variant="ghost" href="javascript:void(0)" className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">Next</Button>
            </div>
        </div>
    )
}
