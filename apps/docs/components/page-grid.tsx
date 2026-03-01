export default function PageGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-12 gap-6 md:gap-8 xl:gap-10">{children}</div>
    </div>
  )
}
