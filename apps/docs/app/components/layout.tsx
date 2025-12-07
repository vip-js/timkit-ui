import { ReactNode } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@timui/react'

import Sidebar from '@/components/sidebar'

const title = 'Modern UI Components | Float UI'

export const metadata = {
  metadataBase: new URL('https://ui.timkit.cn'),
  title,
  openGraph: {
    title,
    url: 'https://ui.timkit.cn',
  },
  twitter: {
    title,
  },
}

type Props = {
  children: ReactNode
}

const DocsLayout = (props: Props) => {
  const { children } = props
  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={15} maxSize={40} className="hidden md:block">
          <Sidebar className="w-full h-full static border-none top-0 !ml-0" />
        </ResizablePanel>
        <ResizableHandle withHandle={true} className="hidden md:flex bg-border/40 w-[1px]" />
        <ResizablePanel defaultSize={75}>
          <div className="h-full w-full overflow-y-auto px-4 md:px-8 lg:px-12 pt-10 pb-20">
            <div className="mx-auto max-w-5xl">{children}</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Mobile Sidebar Fallback */}
      <div className="md:hidden">
        <Sidebar />
        <div className="px-4 py-8">{children}</div>
      </div>
    </div>
  )
}

export default DocsLayout
