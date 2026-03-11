<script setup lang="ts">
import { BellIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';



</script>

<template>
  <Popover><PopoverTrigger as-child><Button size="icon" variant="ghost" class="text-muted-foreground relative size-8 rounded-full shadow-none" aria-label="Open notifications"><BellIcon :size="16" aria-hidden="true" /><div v-if="unreadCount > 0" aria-hidden="true" class="bg-primary absolute top-0.5 right-0.5 size-1 rounded-full" /></Button></PopoverTrigger><PopoverContent class="w-80 p-1"><div class="flex items-baseline justify-between gap-4 px-3 py-2"><div class="text-sm font-semibold">Notifications</div><button v-if="unreadCount > 0" class="text-xs font-medium hover:underline" @click="handleMarkAllAsRead">Mark all as read
            </button></div><div role="separator" aria-orientation="horizontal" class="bg-border -mx-1 my-1 h-px"></div><div v-for="(notification, index) in notifications" :key="index" :key="notification.id" class="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"><div class="relative flex items-start pe-3"><div class="flex-1 space-y-1"><button class="text-foreground/80 text-left after:absolute after:inset-0" @click="handleNotificationClick(notification.id)"><span class="text-foreground font-medium hover:underline">{{ notification.user }}</span>{{ ' ' }}{{ notification.action }}{{ ' ' }}<span class="text-foreground font-medium hover:underline">{{ notification.target }}</span>.
                </button><div class="text-muted-foreground text-xs">{{ notification.timestamp }}</div></div><div v-if="notification.unread" class="absolute end-0 self-center"><span class="sr-only">Unread</span><Dot /></div></div></div></PopoverContent></Popover>
</template>
