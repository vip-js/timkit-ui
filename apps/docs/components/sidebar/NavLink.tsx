import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import mergeTW from '@/utils/mergeTW'

const NavLink = ({ ...props }) => {
  const {
    children,
    href = '',
    className = '',
    active = '',
  }: {
    children?: ReactNode
    href?: string
    className?: string
    active?: string
  } = props

  const pathname = usePathname()

  const isActive: boolean = pathname == href
  const activeClass = isActive ? active : ''

  return (
    <Link
      href={href}
      {...props}
      className={mergeTW(
        'group relative z-10 block rounded-lg px-3 py-2 transition-colors duration-150',
        activeClass,
        className
      )}
    >
      <span
        className={`border-l py-0.5 pl-6 duration-150 group-hover:border-indigo-500 ${
          isActive ? 'border-indigo-500' : 'border-transparent'
        }`}
      >
        {children}
      </span>
    </Link>
  )
}

export default NavLink
