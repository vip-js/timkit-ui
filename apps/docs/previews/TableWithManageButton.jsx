import { Button } from "@timui/react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@timui/react";

export default function TableWithManageButton() {
    const tableItems = [
        {
            name: "Solo learn app",
            date: "Oct 9, 2023",
            status: "Active",
            price: "$35.000",
            plan: "Monthly subscription"
        },
        {
            name: "Window wrapper",
            date: "Oct 12, 2023",
            status: "Active",
            price: "$12.000",
            plan: "Monthly subscription"
        },
        {
            name: "Unity loroin",
            date: "Oct 22, 2023",
            status: "Archived",
            price: "$20.000",
            plan: "Annually subscription"
        },
        {
            name: "Background remover",
            date: "Jan 5, 2023",
            status: "Active",
            price: "$5.000",
            plan: "Monthly subscription"
        },
        {
            name: "Colon tiger",
            date: "Jan 6, 2023",
            status: "Active",
            price: "$9.000",
            plan: "Annually subscription"
        },
    ]
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-16 md:px-8">
            <div className="items-start justify-between md:flex">
                <div className="max-w-lg">
                    <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                        All products
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
                <div className="mt-3 md:mt-0">
                    <Button size="sm">
                        Add product
                    </Button>
                </div>
            </div>
            <div className="mt-12 relative h-max overflow-auto">
                <Table className="w-full table-auto text-sm text-left">
                    <TableHeader className="text-gray-600 font-medium border-b">
                        <TableRow>
                            <TableHead className="py-3 pr-6">name</TableHead>
                            <TableHead className="py-3 pr-6">date</TableHead>
                            <TableHead className="py-3 pr-6">status</TableHead>
                            <TableHead className="py-3 pr-6">Purchase</TableHead>
                            <TableHead className="py-3 pr-6">price</TableHead>
                            <TableHead className="py-3 pr-6"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-gray-600 divide-y">
                        {
                            tableItems.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="pr-6 py-4 whitespace-nowrap">{item.name}</TableCell>
                                    <TableCell className="pr-6 py-4 whitespace-nowrap">{item.date}</TableCell>
                                    <TableCell className="pr-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-2 rounded-full font-semibold text-xs ${item.status == "Active" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"}`}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="pr-6 py-4 whitespace-nowrap">{item.plan}</TableCell>
                                    <TableCell className="pr-6 py-4 whitespace-nowrap">{item.price}</TableCell>
                                    <TableCell className="text-right whitespace-nowrap">
                                        <Button variant="ghost" size="sm" className="py-1.5 px-3">
                                            Manage
                                        </Button>
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
        