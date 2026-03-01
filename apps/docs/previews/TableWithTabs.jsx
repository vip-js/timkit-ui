import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@timui/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@timui/react";

export default function TableWithTabs() {
    const tableItems = [
        {
            label: "Pages",
            value: "pages",
            title: "Top pages",
            items: [
                {
                    prop: "https://www.google.com",
                    clicks: "129",
                    impression: "Good"
                },
                {
                    prop: "https://www.youtube.com",
                    clicks: "798",
                    impression: "Normal"
                },
                {
                    prop: "https://www.github.com",
                    clicks: "399",
                    impression: "Great"
                },
                {
                    prop: "https://www.timkit-ui.com",
                    clicks: "678",
                    impression: "Bad"
                },
            ]
        },
        {
            label: "Countries",
            value: "countries",
            title: "Top countries",
            items: [
                {
                    prop: "Mauritania",
                    clicks: "203",
                    impression: "Good"
                },
                {
                    prop: "United state america",
                    clicks: "408",
                    impression: "Great"
                },
                {
                    prop: "France",
                    clicks: "99",
                    impression: "Bad"
                },
                {
                    prop: "Germany",
                    clicks: "320",
                    impression: "Normal"
                },
            ]
        },
        {
            label: "Devices",
            value: "devices",
            title: "Top devices",
            items: [
                {
                    prop: "Android",
                    clicks: "360",
                    impression: "Normal"
                },
                {
                    prop: "Linux",
                    clicks: "190",
                    impression: "Good"
                },
                {
                    prop: "Macbook",
                    clicks: "129",
                    impression: "Good"
                },
                {
                    prop: "Windows",
                    clicks: "50",
                    impression: "Bad"
                },
            ]
        },
    ]
    const labelColors = {
        "Good": {
            color: "text-green-600 bg-green-50",
        },
        "Normal": {
            color: "text-blue-600 bg-blue-50",
        },
        "Great": {
            color: "text-pink-600 bg-pink-50",
        },
        "Bad": {
            color: "text-red-600 bg-red-50",
        },
    }
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-16 md:px-8">
            <div className="max-w-lg">
                <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                    Reports
                </h3>
                <p className="text-gray-600 mt-2">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
            </div>
            <div className="text-sm mt-12">
                <Tabs defaultValue="pages">
                    <TabsList className="w-full border-b flex items-center gap-x-3 overflow-x-auto">
                        {tableItems.map((item, idx) => (
                            <TabsTrigger
                                key={idx}
                                value={item.value}
                                className="group outline-none py-1.5 border-b-2 border-white text-gray-500 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
                            >
                                <div className="py-2.5 px-4 rounded-lg duration-150 group-hover:text-indigo-600 group-hover:bg-gray-50 group-active:bg-gray-100 font-medium">
                                    {item.label}
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tableItems.map((item, idx) => (
                        <TabsContent key={idx} value={item.value}>
                            <div className="overflow-x-auto">
                                <Table className="w-full table-auto text-left">
                                    <TableHeader className="text-gray-600 font-medium border-b">
                                        <TableRow>
                                            <TableHead className="w-9/12 py-4 pr-6">{item.title}</TableHead>
                                            <TableHead className="py-4 pr-6">Clicks</TableHead>
                                            <TableHead className="py-4 pr-6">Impression</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="text-gray-600 divide-y">
                                        {item.items.map((tableItem, itemIdx) => (
                                            <TableRow key={itemIdx}>
                                                <TableCell className="pr-6 py-4 whitespace-nowrap">{tableItem.prop}</TableCell>
                                                <TableCell className="pr-6 py-4 whitespace-nowrap text-indigo-600">{tableItem.clicks}</TableCell>
                                                <TableCell className="pr-6 py-4 whitespace-nowrap">
                                                    <span className={`py-2 px-3 rounded-full font-semibold text-xs ${labelColors[tableItem?.impression]?.color || ""}`}>{tableItem.impression}</span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    )
}
        