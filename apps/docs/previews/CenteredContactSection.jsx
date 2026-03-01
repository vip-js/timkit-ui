import { Input, Button, Textarea } from "@timui/react";

export default function CenteredContactSection() {
    return (
        <main className="py-14">
            <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
                <div className="max-w-lg mx-auto space-y-3 sm:text-center">
                    <h3 className="text-indigo-600 font-semibold">
                        Contact
                    </h3>
                    <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                        Get in touch
                    </p>
                    <p>
                        We'd love to hear from you! Please fill out the form bellow.
                    </p>
                </div>
                <div className="mt-12 max-w-lg mx-auto">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="space-y-5"
                    >
                        <div className="flex flex-col items-center gap-y-5 gap-x-6 [&>*]:w-full sm:flex-row">
                            <div>
                                <label className="font-medium">
                                    First name
                                </label>
                                <Input
                                    type="text"
                                    required
                                    className="w-full mt-2"
                                />
                            </div>
                            <div>
                                <label className="font-medium">
                                    Last name
                                </label>
                                <Input
                                    type="text"
                                    required
                                    className="w-full mt-2"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-medium">
                                Email
                            </label>
                            <Input
                                type="email"
                                required
                                className="w-full mt-2"
                            />
                        </div>
                        <div>
                            <label className="font-medium">
                                Phone number
                            </label>
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                                    <select className="text-sm bg-transparent outline-none rounded-lg h-full">
                                        <option>US</option>
                                        <option>ES</option>
                                        <option>MR</option>
                                    </select>
                                </div>
                                <Input
                                    type="number"
                                    placeholder="+1 (555) 000-000"
                                    required
                                    className="w-full pl-[4.5rem] pr-3"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-medium">
                                Message
                            </label>
                            <Textarea required className="w-full mt-2 h-36 resize-none"></Textarea>
                        </div>
                        <Button
                            className="w-full"
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    )
}
        