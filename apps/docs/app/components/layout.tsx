import { ReactNode } from "react"

import Sidebar from "@/components/sidebar"

const title = "Modern UI Components | Float UI"

export const metadata = {
  metadataBase: new URL("https://ui.timkit.cn"),
  title,
  openGraph: {
    title,
    url: "https://ui.timkit.cn",
  },
  twitter: {
    title,
  },
}

type Props = {
  children: ReactNode
}

export default (props: Props) => {
  const { children } = props
  return (
    <main className="custom-screen-lg relative">
      <div className="lg:flex">
        <Sidebar />
        <div className="mt-20 mb-12 flex-1 overflow-hidden xl:mt-10 xl:px-8">
          {children}
        </div>
      </div>
    </main>
  )
}
