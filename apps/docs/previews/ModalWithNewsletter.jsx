import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@timui/react";

export default function ModalWithNewsletter() {
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
                    <div className="max-w-sm mx-auto py-3 space-y-3 text-center">
                        <DialogTitle className="text-lg font-medium text-gray-800">
                            Sign up for our newsletter
                        </DialogTitle>
                        <DialogDescription className="text-[15px] text-gray-600">
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </DialogDescription>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <svg className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                />
                            </div>
                            <DialogClose className="block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2">
                                Subscribe
                            </DialogClose>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
        