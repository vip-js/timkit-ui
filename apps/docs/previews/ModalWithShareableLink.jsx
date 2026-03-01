import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@timui/react";

export default function ModalWithShareableLink() {
    const [state, setState] = React.useState(true);
    const [copyState, setCopyState] = React.useState(false);
    const URLLink = "https://example.lorem/shortlink";

    // Copy the link
    const handleCopy = () => {
        navigator.clipboard.writeText(URLLink).then(function () {
            setCopyState(true);
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    };

    React.useEffect(() => {
        if (copyState) {
            setTimeout(() => setCopyState(false), 3000);
        }
    }, [copyState]);

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
                    <div className="py-3 space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle className="text-lg font-medium text-gray-800">
                                    Get a shareable link
                                </DialogTitle>
                                <DialogDescription className="text-[15px] text-gray-600 mt-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
                                </DialogDescription>
                            </div>
                        </div>
                        <div className="p-2 border rounded-lg flex items-center justify-between">
                            <p className="text-sm text-gray-600 overflow-hidden">{URLLink}</p>
                            <button
                                className={`relative text-gray-500 hover:text-gray-800 duration-150 ${copyState ? "text-indigo-600 pointer-events-none" : ""}`}
                                onClick={handleCopy}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                {copyState ? (
                                    <div className="absolute -top-12 -left-3 px-2 py-1.5 rounded-xl bg-indigo-600 font-semibold text-white text-[10px] after:absolute after:inset-x-0 after:mx-auto after:top-[22px] after:w-2 after:h-2 after:bg-indigo-600 after:rotate-45">Copied</div>
                                ) : ""}
                            </button>
                        </div>
                        <DialogClose className="mt-2 py-2.5 px-8 flex-1 text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2">
                            Done
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
        