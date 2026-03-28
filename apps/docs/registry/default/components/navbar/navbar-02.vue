<script setup lang="ts">
import { cn } from '@timui/core'
import { BookOpenIcon, InfoIcon, LifeBuoyIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@timui/vue'
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue'
import Logo from '@/registry/default/components/navbar-components/logo.vue'

type NavItem = {
  href: string
  label: string
  description?: string
  icon?: 'BookOpenIcon' | 'LifeBuoyIcon' | 'InfoIcon'
}

type NavLink = {
  href?: string
  label: string
  submenu?: boolean
  type?: 'description' | 'simple' | 'icon'
  items?: NavItem[]
}

const navigationLinks: NavLink[] = [
  { href: '#', label: 'Home' },
  {
    label: 'Features',
    submenu: true,
    type: 'description',
    items: [
      {
        href: '#',
        label: 'Components',
        description: 'Browse all components in the library.',
      },
      {
        href: '#',
        label: 'Documentation',
        description: 'Learn how to use the library.',
      },
      {
        href: '#',
        label: 'Templates',
        description: 'Pre-built layouts for common use cases.',
      },
    ],
  },
  {
    label: 'Pricing',
    submenu: true,
    type: 'simple',
    items: [
      { href: '#', label: 'Product A' },
      { href: '#', label: 'Product B' },
      { href: '#', label: 'Product C' },
      { href: '#', label: 'Product D' },
    ],
  },
  {
    label: 'About',
    submenu: true,
    type: 'icon',
    items: [
      { href: '#', label: 'Getting Started', icon: 'BookOpenIcon' },
      { href: '#', label: 'Tutorials', icon: 'LifeBuoyIcon' },
      { href: '#', label: 'About Us', icon: 'InfoIcon' },
    ],
  },
]

const iconMap = {
  BookOpenIcon,
  LifeBuoyIcon,
  InfoIcon,
} as const

const needsSeparator = (index: number) => {
  if (index >= navigationLinks.length - 1) return false
  const current = navigationLinks[index]
  const next = navigationLinks[index + 1]
  return (
    (!!current.submenu && !next.submenu) ||
    (!current.submenu && !!next.submenu) ||
    (!!current.submenu && !!next.submenu && current.type !== next.type)
  )
}

const listMinWidth = (type?: NavLink['type']) => (type === 'description' ? 'min-w-64' : 'min-w-48')
</script>

<template>
  <header class="border-b px-4 md:px-6">
    <div class="flex h-16 items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <Popover>
          <PopoverTrigger as-child>
            <Button class="group size-8 md:hidden" variant="ghost" size="icon">
              <svg
                class="pointer-events-none"
                :width="16"
                :height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12L20 12"
                  class="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                />
                <path
                  d="M4 12H20"
                  class="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                />
                <path
                  d="M4 12H20"
                  class="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                />
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" class="w-64 p-1 md:hidden">
            <NavigationMenu class="max-w-none *:w-full">
              <NavigationMenuList class="flex-col items-start gap-0 md:gap-2">
                <NavigationMenuItem v-for="(link, index) in navigationLinks" :key="index" class="w-full">
                  <template v-if="link.submenu">
                    <div class="text-muted-foreground px-2 py-1.5 text-xs font-medium">{{ link.label }}</div>
                    <ul>
                      <li v-for="(item, itemIndex) in link.items" :key="itemIndex">
                        <NavigationMenuLink :href="item.href" class="py-1.5">{{ item.label }}</NavigationMenuLink>
                      </li>
                    </ul>
                  </template>
                  <NavigationMenuLink v-else :href="link.href" class="py-1.5">{{ link.label }}</NavigationMenuLink>

                  <div
                    v-if="needsSeparator(index)"
                    role="separator"
                    aria-orientation="horizontal"
                    class="bg-border -mx-1 my-1 h-px w-full"
                  />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </PopoverContent>
        </Popover>

        <div class="flex items-center gap-6">
          <a href="#" class="text-primary hover:text-primary/90">
            <Logo />
          </a>

          <NavigationMenu :viewport="false" class="max-md:hidden">
            <NavigationMenuList class="gap-2">
              <NavigationMenuItem v-for="(link, index) in navigationLinks" :key="index">
                <template v-if="link.submenu">
                  <NavigationMenuTrigger class="text-muted-foreground hover:text-primary bg-transparent px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5">
                    {{ link.label }}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent class="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                    <ul :class="cn(listMinWidth(link.type))">
                      <li v-for="(item, itemIndex) in link.items" :key="itemIndex">
                        <NavigationMenuLink
                          :href="item.href"
                          :class="cn('py-1.5', link.type === 'icon' && item.icon && 'inline-flex items-center gap-2')"
                        >
                          <template v-if="link.type === 'icon' && item.icon">
                            <component
                              :is="iconMap[item.icon]"
                              :size="16"
                              class="text-foreground opacity-60"
                              aria-hidden="true"
                            />
                            <span class="leading-none">{{ item.label }}</span>
                          </template>

                          <template v-else-if="link.type === 'description' && item.description">
                            <div class="space-y-1">
                              <div class="font-medium">{{ item.label }}</div>
                              <p class="text-muted-foreground line-clamp-2 text-xs">{{ item.description }}</p>
                            </div>
                          </template>

                          <template v-else>
                            <span>{{ item.label }}</span>
                          </template>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </template>

                <NavigationMenuLink
                  v-else
                  :href="link.href"
                  class="text-muted-foreground hover:text-primary py-1.5 font-medium"
                >
                  {{ link.label }}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button as-child variant="ghost" size="sm" class="text-sm"><a href="#">Sign In</a></Button>
        <Button as-child size="sm" class="text-sm"><a href="#">Get Started</a></Button>
      </div>
    </div>
  </header>
</template>
