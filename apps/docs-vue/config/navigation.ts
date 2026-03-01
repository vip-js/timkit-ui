export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: string
  label?: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navigation: NavGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Theming', href: '/docs/theming' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Accordion', href: '/docs/components/accordion' },
      { title: 'Alert', href: '/docs/components/alert' },
      { title: 'Alert Dialog', href: '/docs/components/alert-dialog' },
      { title: 'Avatar', href: '/docs/components/avatar' },
      { title: 'Badge', href: '/docs/components/badge' },
      { title: 'Button', href: '/docs/components/button' },
      { title: 'Card', href: '/docs/components/card' },
      { title: 'Checkbox', href: '/docs/components/checkbox' },
      { title: 'Collapsible', href: '/docs/components/collapsible' },
      { title: 'Dialog', href: '/docs/components/dialog' },
      { title: 'Dropdown Menu', href: '/docs/components/dropdown-menu' },
      { title: 'Input', href: '/docs/components/input' },
      { title: 'Label', href: '/docs/components/label' },
      { title: 'Pagination', href: '/docs/components/pagination' },
      { title: 'Popover', href: '/docs/components/popover' },
      { title: 'Progress', href: '/docs/components/progress' },
      { title: 'Radio Group', href: '/docs/components/radio-group' },
      { title: 'Select', href: '/docs/components/select' },
      { title: 'Separator', href: '/docs/components/separator' },
      { title: 'Slider', href: '/docs/components/slider' },
      { title: 'Switch', href: '/docs/components/switch' },
      { title: 'Tabs', href: '/docs/components/tabs' },
      { title: 'Textarea', href: '/docs/components/textarea' },
      { title: 'Toast', href: '/docs/components/toast' },
      { title: 'Toggle', href: '/docs/components/toggle' },
      { title: 'Tooltip', href: '/docs/components/tooltip' },
    ],
  },
]

export default navigation
