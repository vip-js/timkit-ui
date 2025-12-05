"use client"

import { useState } from "react"
import supportedFrameworksJSON from "@/utils/supportedFrameworksJSON"
import * as Tabs from "@radix-ui/react-tabs"
import { m } from "framer-motion"

import { IconHTML, IconReact, IconSvelte, IconVue } from "@/components/icons"
import LazyMotionWrapper from "@/components/lazy-motion-wrapper"
import SyntaxHeighlight from "@/components/syntax-heighlight"
import TabsTrigger from "@/components/tabs-trigger"

export default () => {
  const [selectedTab, setSelectedTab] = useState("html")

  const tabs = [
    {
      name: "HTML",
      icon: <IconHTML />,
      value: "html",
    },
    {
      name: "React.js",
      icon: <IconReact />,
      value: "react",
    },
    {
      name: "Vue.js",
      icon: <IconVue />,
      value: "vue",
    },
    {
      name: "Svelte.js",
      icon: <IconSvelte />,
      value: "svelte",
    },
  ]

  return (
    <Tabs.Root
      className="flex-1 overflow-hidden rounded-2xl border border-zinc-800"
      defaultValue={selectedTab}
      onValueChange={(value) => setSelectedTab(value)}
    >
      <Tabs.List
        className="flex items-center overflow-auto border-b border-b-zinc-800 bg-[linear-gradient(175deg,_rgba(24,_24,_27,_0.80)_3.95%,_rgba(24,_24,_27,_0.00)_140.01%)] px-4 py-2"
        aria-label="Switch between supported frameworks"
      >
        {tabs.map((item, idx) => (
          <TabsTrigger key={idx} value={item.value} selectedTab={selectedTab}>
            <div className="relative z-10 flex items-center gap-x-2">
              {item.icon}
              {item.name}
            </div>
          </TabsTrigger>
        ))}
      </Tabs.List>
      {supportedFrameworksJSON.map((item, idx) => (
        <Tabs.Content
          key={idx}
          className="h-[640px] overflow-auto p-4 delay-1000 duration-1000 data-[state=active]:opacity-100 data-[state=inactive]:opacity-0"
          value={item.value}
        >
          <LazyMotionWrapper>
            <m.div
              className="opacity-0"
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
            >
              <SyntaxHeighlight code={item.code} />
            </m.div>
          </LazyMotionWrapper>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
