<script setup lang="ts">
import { CompassIcon, FeatherIcon, HouseIcon, PlusIcon, SearchIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NotificationMenu from '@/registry/default/components/navbar-components/notification-menu.vue';
import TeamSwitcher from '@/registry/default/components/navbar-components/team-switcher.vue';
import UserMenu from '@/registry/default/components/navbar-components/user-menu.vue';

const navigationLinks = [
  { href: '#', label: 'Dashboard', icon: HouseIcon },
  { href: '#', label: 'Explore', icon: CompassIcon },
  { href: '#', label: 'Write', icon: FeatherIcon },
  { href: '#', label: 'Search', icon: SearchIcon },
];
</script>

<template>
  <header class="border-b px-4 md:px-6"><div class="flex h-16 items-center justify-between gap-4"><div class="flex flex-1 items-center gap-2"><Popover><PopoverTrigger as-child><Button class="group size-8 md:hidden" variant="ghost" size="icon"><svg class="pointer-events-none" :width="16" :height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M4 12L20 12" class="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]" /><path d="M4 12H20" class="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45" /><path d="M4 12H20" class="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]" /></svg></Button></PopoverTrigger><PopoverContent align="start" class="w-48 p-1 md:hidden"><NavigationMenu class="max-w-none *:w-full"><NavigationMenuList class="flex-col items-start gap-0 md:gap-2">{{ navigationLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className="flex-row items-center gap-2 py-1.5"
                        >
                          <Icon size={16} className="text-muted-foreground" aria-hidden="true" />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  }) }}</NavigationMenuList></NavigationMenu></PopoverContent></Popover><TeamSwitcher :teams="teams" :defaultTeam="teams[0]" /></div><NavigationMenu class="max-md:hidden"><NavigationMenuList class="gap-2">{{ navigationLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={link.href}
                    className="flex size-8 items-center justify-center p-1.5"
                    title={link.label}
                  >
                    <Icon aria-hidden="true" />
                    <span className="sr-only">{link.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            }) }}</NavigationMenuList></NavigationMenu><div class="flex flex-1 items-center justify-end gap-4"><Button size="sm" class="aspect-square text-sm max-sm:p-0"><PlusIcon class="opacity-60 sm:-ms-1" :size="16" aria-hidden="true" /><span class="max-sm:sr-only">Post</span></Button><NotificationMenu /><UserMenu /></div></div></header>
</template>
