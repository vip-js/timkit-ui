import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter, DialogDescription } from "@timui/react";

export default function ModalDialog() {
    const [state, setState] = React.useState(true);
    React.useEffect(() => {
        if (!state) setTimeout(() => setState(true), 1200);
    }, [state]);

    return (
        <div style={{height: '580px'}}>
            <Dialog open={state} onOpenChange={setState}>
                <DialogTrigger asChild>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Open Dialog
                    </button>
                </DialogTrigger>
                <DialogContent className="relative w-full max-w-lg mx-auto bg-white rounded-md shadow-lg">
                    <DialogHeader className="flex items-center justify-between p-4 border-b">
                        <DialogTitle className="text-lg font-medium text-gray-800">
                            Terms and agreements
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 p-4 mt-3 text-[15.5px] leading-relaxed text-gray-500">
                        <DialogDescription asChild>
                            <p>
                                Commodo eget a et dignissim dignissim morbi vitae, mi. Mi aliquam sit ultrices enim cursus. Leo sapien, pretium duis est eu volutpat interdum eu non. Odio eget nullam elit laoreet. Libero at felis nam at orci venenatis rutrum nunc. Etiam mattis ornare pellentesque iaculis enim.
                            </p>
                        </DialogDescription>
                        <DialogDescription asChild>
                            <p>
                                Felis eu non in aliquam egestas placerat. Eget maecenas ornare venenatis lacus nunc, sit arcu. Nam pharetra faucibus eget facilisis pulvinar eu sapien turpis at. Nec aliquam aliquam blandit eu ipsum.
                            </p>
                        </DialogDescription>
                    </div>
                    <DialogFooter className="flex items-center gap-3 p-4 mt-5 border-t">
                        <DialogClose className="px-6 py-2 text-white bg-indigo-600 rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2">
                            Accept
                        </DialogClose>
                        <DialogClose className="px-6 py-2 text-gray-800 border rounded-md outline-none ring-offset-2 ring-indigo-600 focus:ring-2">
                            Cancel
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
        