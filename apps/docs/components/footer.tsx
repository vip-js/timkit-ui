export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-border/60 px-6 py-10 md:mt-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="flex flex-col gap-6 text-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="text-base font-semibold text-foreground">Timkit UI</div>
          <p className="text-muted-foreground">
            设计灵感来自 Linear 的清晰与秩序，用于快速搭建现代产品体验。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <span>&copy; {new Date().getFullYear()}</span>
          <a
            className="font-medium text-foreground transition hover:text-primary"
            href="https://x.com/pacovitiello"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pasquale
          </a>
          <a
            className="font-medium text-foreground transition hover:text-primary"
            href="https://x.com/DavidePacilio"
            target="_blank"
            rel="noopener noreferrer"
          >
            Davide
          </a>
        </div>
      </div>
    </footer>
  )
}
