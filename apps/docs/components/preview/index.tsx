"use client"

import { useEffect, useState } from "react"
import componentsNames from "@/componentsNames"
import { CheckIcon, Square2StackIcon } from "@heroicons/react/24/outline"
import * as Tabs from "@radix-ui/react-tabs"
import { motion } from "framer-motion"
import { MDXRemoteSerializeResult } from "next-mdx-remote"

import { IconHTML, IconReact, IconSvelte, IconVue } from "@/components/icons"
import MDXRemoteClient from "@/components/mdx-remote-client"
import PreviewSwitch from "@/components/preview-switch"
import SyntaxHeighlight from "@/components/syntax-heighlight"
import TabsTrigger from "@/components/tabs-trigger"
import Viewport from "@/components/viewport"

const tabs = [
  {
    name: "React.js",
    icon: <IconReact />,
    value: "react",
  },
  {
    name: "HTML",
    icon: <IconHTML />,
    value: "html",
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

export default ({
  item,
  mdxSource,
  slug,
}: {
  item: any
  mdxSource: MDXRemoteSerializeResult
  slug: string
}) => {
  const [isPreview, setPreview] = useState<boolean>(true)
  const [isClient, setIsClient] = useState(false)
  const [selectedFramework, setFramework] = useState("react")
  const [copied, setCopyed] = useState(false)

  const fullTech = {
    react: "jsxTail",
    vue: "vueTail",
    html: "htmlTail",
    svelte: "svelteTail",
  }[selectedFramework]

  const previewCode: string = item.ltr?.preview

  const copyCode = (code: string) => {
    const textare = document.createElement("textarea")
    textare.textContent = code
    document.body.append(textare)
    textare.select()
    document.execCommand("copy")
    textare.remove()
    setCopyed(true)
  }

  useEffect(() => {
    setIsClient(true)
    if (copied) {
      setTimeout(() => setCopyed(false), 2000)
    }
  }, [copied])

  return (
    <>
      <div className="items-start justify-between sm:flex">
        <h3 className="py-4 text-sm font-medium text-zinc-300">
          {item?.title}
        </h3>
        <div className="my-3 flex items-center gap-3 sm:mt-0">
          <PreviewSwitch preview={isPreview} setPreview={setPreview} />
        </div>
      </div>
      {isPreview ? (
        <Viewport>
          {/* isPreview-Viewport */}
          <MDXRemoteClient mdxSource={mdxSource} components={componentsNames} />
        </Viewport>
      ) : (
        ""
      )}
      {!isPreview && (
        <>
          {!isClient ? (
            <div className="text-muted-foreground rounded-2xl border border-zinc-800 p-6 text-sm">
              加载代码视图…
            </div>
          ) : (
            <Tabs.Root
              onValueChange={(val) => setFramework(val)}
              className="relative flex-1 overflow-hidden rounded-2xl border border-zinc-800"
              defaultValue={selectedFramework}
            >
              <Tabs.List
                className="flex items-center overflow-auto border-b border-b-zinc-800 bg-[linear-gradient(175deg,_rgba(24,_24,_27,_0.80)_3.95%,_rgba(24,_24,_27,_0.00)_140.01%)] px-4 py-2"
                aria-label="Switch between supported frameworks"
              >
                {tabs.map((item, idx) => (
                  <TabsTrigger
                    key={idx}
                    value={item.value}
                    selectedTab={selectedFramework}
                  >
                    <div className="relative z-10 flex items-center gap-x-2">
                      {item.icon}
                      {item.name}
                    </div>
                  </TabsTrigger>
                ))}
              </Tabs.List>
              {item.ltr[selectedFramework] &&
              item.ltr[selectedFramework][fullTech as string].length > 0 ? (
                <button
                  className="absolute top-16 right-6 flex h-7 w-7 items-center justify-center rounded-md text-sm font-medium text-zinc-300 duration-200 hover:bg-zinc-600"
                  onClick={() =>
                    copyCode(item.ltr[selectedFramework].jsxTail[0].code)
                  }
                >
                  {copied ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <Square2StackIcon className="h-5 w-5" />
                  )}
                </button>
              ) : null}
              {tabs.map((tab, idx) => (
                <Tabs.Content
                  key={idx}
                  className="overflow-auto p-4 delay-1000 duration-1000 data-[state=active]:opacity-100 data-[state=inactive]:opacity-0"
                  value={tab.value}
                  forceMount
                >
                  {item.ltr[selectedFramework] &&
                  item.ltr[selectedFramework][fullTech as string].length > 0 ? (
                    <motion.div
                      className="h-[640px] opacity-0"
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.9 }}
                    >
                      <SyntaxHeighlight
                        code={
                          item.ltr[selectedFramework][fullTech as string][0]
                            ?.code
                        }
                      />
                    </motion.div>
                  ) : (
                    <div className="rounded-xl bg-zinc-800 py-20 text-center text-lg font-semibold text-white">
                      In progress...
                    </div>
                  )}
                </Tabs.Content>
              ))}
            </Tabs.Root>
          )}
        </>
      )}
    </>
  )
}
