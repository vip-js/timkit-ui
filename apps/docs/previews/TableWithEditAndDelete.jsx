import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@timui/react";

export default function TableWithEditAndDelete() {
    const tableItems = [
        {
            name: "Liam James",
            email: "liamjames@example.com",
            position: "Software engineer",
            salary: "$100K"
        },
        {
            name: "Olivia Emma",
            email: "oliviaemma@example.com",
            position: "Product designer",
            salary: "$90K"
        },
        {
            name: "William Benjamin",
            email: "william.benjamin@example.com",
            position: "Front-end developer",
            salary: "$80K"
        },
        {
            name: "Henry Theodore",
            email: "henrytheodore@example.com",
            position: "Laravel engineer",
            salary: "$120K"
        },
        {
            name: "Amelia Elijah",
            email: "amelia.elijah@example.com",
            position: "Open source manager",
            salary: "$75K"
        },
    ]
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-16 md:px-8">
            <div className="items-start justify-between md:flex">
                <div className="max-w-lg">
                    <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                        Team members
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
                <div className="mt-3 md:mt-0">
                    <a
                        href="javascript:void(0)"
                        className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
                    >
                        Add member
                    </a>
                </div>
            </div>
            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                <Table className="w-full table-auto text-sm text-left">
                    <TableHeader className="bg-gray-50 text-gray-600 font-medium border-b">
                        <TableRow>
                            <TableHead className="py-3 px-6">Username</TableHead>
                            <TableHead className="py-3 px-6">Email</TableHead>
                            <TableHead className="py-3 px-6">Position</TableHead>
                            <TableHead className="py-3 px-6">Salary</TableHead>
                            <TableHead className="py-3 px-6"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-gray-600 divide-y">
                        {
                            tableItems.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">{item.name}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">{item.email}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">{item.position}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap">{item.salary}</TableCell>
                                    <TableCell className="text-right px-6 whitespace-nowrap">
                                        <a href="javascript:void()" className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg">
                                            Edit
                                        </a>
                                        <button href="javascript:void()" className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg">
                                            Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
        