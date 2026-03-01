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
    <div className="h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" id="docs-layout-panels">
        <ResizablePanel
          id="docs-layout-sidebar"
          defaultSize={18}
          minSize={15}
          maxSize={25}
          className="hidden md:block"
        >
          <Sidebar className="w-full h-full static border-none top-0 !ml-0" />
        </ResizablePanel>
        <ResizableHandle
          id="docs-layout-handle"
          withHandle={true}
          className="hidden md:flex bg-border/40 w-[1px]"
        />
        <ResizablePanel id="docs-layout-content" defaultSize={75}>
          <div className="h-full w-full overflow-y-auto px-4 md:px-6 lg:px-10 pt-8 pb-16">
            <div className="mx-auto w-full">{children}</div>
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
