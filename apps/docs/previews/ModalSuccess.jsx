import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter, DialogDescription } from "@timui/react";

export default function ModalSuccess() {
    const [state, setState] = React.useState(true);
    React.useEffect(() => {
        if (!state) setTimeout(() => setState(true), 1200);
    }, [state]);

    return (
        <div style={{height: '550px'}}>
            <Dialog open={state} onOpenChange={setState}>
                <DialogTrigger asChild>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Open Dialog
                    </button>
                </DialogTrigger>
                <DialogContent className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
                    <div className="mt-3">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="mt-2 text-center">
                            <DialogTitle className="text-lg font-medium text-gray-800">
                                Successfully accepted!
                            </DialogTitle>
                            <DialogDescription className="mt-2 text-[15px] leading-relaxed text-gray-500">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc eget lorem dolor sed viverra ipsum nunc. Consequat id porta nibh venenatis.
                            </DialogDescription>
                        </div>
                    </div>
                    <DialogFooter className="items-center gap-2 mt-3 sm:flex">
                        <DialogClose className="w-full mt-2 p-2.5 flex-1 text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2">
                            Dashboard
                        </DialogClose>
                        <DialogClose className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2">
                            Undo
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
        