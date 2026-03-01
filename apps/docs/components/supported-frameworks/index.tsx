import supportedFrameworksJSON from '@/utils/supported-frameworks-json'

import { FRAMEWORK_TABS } from '@/lib/framework-utils'
import FrameworksTabs, { type FrameworkPane, type FrameworkTab } from '@/components/frameworks-tabs'

import PreviewCard from './preview-card'

const frameworkTabs: FrameworkTab[] = FRAMEWORK_TABS

const frameworkPanes: FrameworkPane[] = supportedFrameworksJSON

const SupportedFrameworks = () => {
  return (
    <section className="mt-28">
      <div className="custom-screen">
        <div className="mx-auto max-w-xl space-y-4 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            多框架同构体验
          </h2>
          <p className="text-muted-foreground">
            React、Vue、HTML、Weapp 一套思路，全平台一致的组件展示与交互。
          </p>
        </div>
        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <FrameworksTabs tabs={frameworkTabs} panes={frameworkPanes} className="flex-1" />
          <PreviewCard />
        </div>
      </div>
    </section>
  )
}

export default SupportedFrameworks
