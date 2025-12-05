import FrameworksTabs from "./frameworks-tabs"
import PreviewCard from "./preview-card"

export default () => {
  return (
    <section className="mt-32">
      <div className="custom-screen">
        <div className="mx-auto max-w-xl space-y-4 text-center">
          <h2 className="heading text-4xl">使用您喜爱的框架</h2>
          <p className="text-zinc-400">使用您喜爱的 JS 框架复制粘贴所需组件</p>
        </div>
        <div className="mt-10 flex items-center justify-between gap-x-6">
          <FrameworksTabs />
          <PreviewCard />
        </div>
      </div>
    </section>
  )
}
