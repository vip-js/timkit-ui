import { Input, Button, Textarea } from "@timui/react";

export default function DarkContactSection() {
    return (
        <main className="relative py-28 bg-gray-900">
            <div className="relative z-10 max-w-screen-xl mx-auto text-gray-600 sm:px-4 md:px-8">
                <div className="max-w-lg space-y-3 px-4 sm:mx-auto sm:text-center sm:px-0">
                    <h3 className="text-cyan-400 font-semibold">
                        Contact
                    </h3>
                    <p className="text-white text-3xl font-semibold sm:text-4xl">
                        Get in touch
                    </p>
                    <p className="text-gray-300">
                        We'd love to hear from you! Please fill out the form bellow.
                    </p>
                </div>
                <div className="mt-12 mx-auto px-4 p-8 bg-white sm:max-w-lg sm:px-8 sm:rounded-xl">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="space-y-5"
                    >
                        <div>
                            <label className="font-medium">
                                Full name
                            </label>
                            <Input
                                type="text"
                                required
                                className="w-full mt-2"
                            />
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
                            className="w-full bg-gray-800 hover:bg-gray-700"
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
            <div className='absolute inset-0 blur-[118px] max-w-lg h-[800px] mx-auto sm:max-w-3xl sm:h-[400px]' style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)" }}></div>
        </main>
    )
}
        