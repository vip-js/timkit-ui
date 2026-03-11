<script setup lang="ts">
import { LayoutGridIcon, PlusIcon, SearchIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import InfoMenu from '@/registry/default/components/navbar-components/info-menu.vue';
import NotificationMenu from '@/registry/default/components/navbar-components/notification-menu.vue';
import SettingsMenu from '@/registry/default/components/navbar-components/settings-menu.vue';


</script>

<template>
  <header class="border-b px-4 md:px-6"><div class="flex h-16 items-center justify-between gap-4"><div class="relative flex-1"><Input :id="`input-${id}`" class="peer h-8 w-full max-w-xs ps-8 pe-2" placeholder="Search..." type="search" /><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50"><SearchIcon :size="16" /></div></div><div class="flex items-center gap-4"><div class="inline-flex items-center gap-2 max-md:hidden"><Label :htmlFor="`switch-${id}`" class="text-sm font-medium">Test mode
            </Label><Switch :id="`switch-${id}`" :checked="checked" :onCheckedChange="setChecked" class="h-5 w-8 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-3 data-[state=checked]:[&_span]:rtl:-translate-x-3" aria-label="Toggle switch" /></div><div class="flex items-center gap-2"><Button size="icon" variant="ghost" class="text-muted-foreground size-8 rounded-full shadow-none" aria-label="Open layout menu"><LayoutGridIcon :size="16" aria-hidden="true" /></Button><InfoMenu /><NotificationMenu /><SettingsMenu /></div><Button class="size-8 rounded-full" size="icon" aria-label="Add new item"><PlusIcon :size="16" aria-hidden="true" /></Button></div></div></header>
</template>
