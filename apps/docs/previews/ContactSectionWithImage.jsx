import React from "react";
import { Button, Checkbox, Input, Textarea } from "@timui/react";
export default function ContactSectionWithImage() {
    const servicesItems = ["Mobile development", "UI/UX Design", "web development", "SEO"]
    return (
        <main style={{height: "850px"}} className="flex overflow-hidden">
            <div className="flex-1 hidden lg:block">
                <img src="https://images.unsplash.com/photo-1697135807547-5fa9fd22d9ec?auto=format&fit=crop&q=80&w=3387&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-screen object-cover" />
            </div>
            <div className="py-12 flex-1 lg:flex lg:justify-center lg:h-screen lg:overflow-auto">
                <div className="max-w-lg flex-1 mx-auto px-4 text-gray-600">
                    <div>
                        <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                            Get in touch
                        </h3>
                        <p className="mt-3">
                            We'd love to hear from you! Please fill out the form bellow.
                        </p>
                    </div>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="space-y-5 mt-12 lg:pb-12"
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
                                Services
                            </label>
                            <ul className="grid gap-y-2 gap-x-6 flex-wrap grid-cols-2 mt-3">
                                {
                                    servicesItems.map((item, idx) => (
                                        <li key={idx} className="flex gap-x-3 text-sm">
                                            <Checkbox id={`service-${idx}`} />
                                            <label htmlFor={`service-${idx}`} className="cursor-pointer">{item}</label>
                                        </li>
                                    ))
                                }
                            </ul>
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
