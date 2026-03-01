import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import mergeTW from '@/utils/merge-tw'

const NavLink = ({
  children,
  href = '',
  className = '',
}: {
  children: ReactNode
  href?: string
  className?: string
}) => {
  const pathname = usePathname()
  const isActive: boolean = pathname == href

  return (
    <Link
      href={href}
      className={mergeTW(
        'group flex w-full items-center rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
        className
      )}
    >
      {children}
    </Link>
  )
}

export default NavLink
