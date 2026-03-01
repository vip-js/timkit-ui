import React from "react";
import { Button } from "@timui/react";

export default function BlogCardsSecondary() {
    const posts = [
        {
            title: "What is SaaS? Software as a Service Explained",
            desc: "Going into this journey, I had a standard therapy regimen, based on looking at the research literature. After I saw the movie, I started to ask other people what they did for their anxiety, and some",
            date: "Thursday, December 9th 2021",
            href: "javascript:void(0)"
        },
        {
            title: "A Quick Guide to WordPress Hosting",
            desc: "According to him, \"I'm still surprised that this has happened. But we are surprised because we are so surprised.\" More revelations about Whittington will be featured in the film.",
            date: "Thursday, December 9th 2021",
            href: "javascript:void(0)"
        },
        {
            title: "7 Promising VS Code Extensions Introduced in 2022",
            desc: "I hope I remembered all the stuff that they needed to know. They're like, 'okay,' and write it in their little reading notebooks. I realized today that I have all this stuff that",
            date: "Thursday, December 9th 2021",
            href: "javascript:void(0)"
        },
        {
            title: "How to Use Root C++ Interpreter Shell to Write C++ Programs",
            desc: "The powerful gravity waves resulting from the impact of the planets' moons—four in total—were finally resolved in 2015 when gravitational microlensing was used to observe the event.",
            date: "Thursday, December 9th 2021",
            href: "javascript:void(0)"
        }
    ]
    return (
        <section className="py-12 mx-auto px-4 max-w-screen-xl md:px-8">
            <div className="max-w-lg">
                <h1 className="text-3xl text-gray-800 font-semibold">
                    Blog
                </h1>
                <p className="mt-3 text-gray-500">
                    Blogs that are loved by the community. Updated every hour.
                    The powerful gravity waves resulting from the impact of the planets, were finally resolved in 2015
                </p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {
                    posts.map((item, idx) => (
                        <article className="mt-5 pt-8 md:pt-0" key={idx}>
                            <a href={item.href}>
                                <span className="block text-gray-400 text-sm">
                                    {item.date}
                                </span>
                                <div className="mt-2">
                                    <h3 className="text-xl text-gray-900 font-semibold hover:underline">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 mt-1 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                                <Button variant="link" className="mt-2 flex items-center text-[14px] text-blue-600 hover:text-blue-600 hover:underline">
                                    READ MORE
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Button>
                            </a>
                        </article>
                    ))
                }
            </div>
        </section>
    )
}
