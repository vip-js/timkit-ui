import React from "react"
import { BlockModule } from "@/lib/block-registry"

export const TextBlock: BlockModule = {
  metadata: {
    name: "TextBlock",
    type: "basic",
    tags: ["text"],
    description: "Simple responsive text block",
    responsive: true,
  },
  component: ({ text }: { text: string }) => (
    <p className="my-4 text-base md:text-lg lg:text-xl">{text}</p>
  ),
}
