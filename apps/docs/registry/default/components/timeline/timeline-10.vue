<script setup lang="ts">
import { BookOpenIcon, MessageCircleIcon, PencilIcon, PlusIcon } from 'lucide-vue-next'
import { Timeline } from '@timui/vue'
import { TimelineContent } from '@timui/vue'
import { TimelineItem } from '@timui/vue'

type ActionType = 'post' | 'reply' | 'edit' | 'create'

type ActivityItem = {
  id: number
  user: string
  image: string
  action: ActionType
  date: Date
}

const items: ActivityItem[] = [
  {
    id: 1,
    user: 'Matt',
    image: '/avatar-40-02.jpg',
    action: 'post',
    date: new Date(Date.now() - 59000),
  },
  {
    id: 2,
    user: 'Matt',
    image: '/avatar-40-02.jpg',
    action: 'reply',
    date: new Date(Date.now() - 180000),
  },
  {
    id: 3,
    user: 'Matt',
    image: '/avatar-40-02.jpg',
    action: 'edit',
    date: new Date(Date.now() - 300000),
  },
  {
    id: 4,
    user: 'Matt',
    image: '/avatar-40-02.jpg',
    action: 'create',
    date: new Date(Date.now() - 600000),
  },
]

const iconMap = {
  post: BookOpenIcon,
  reply: MessageCircleIcon,
  edit: PencilIcon,
  create: PlusIcon,
} as const

const textMap: Record<ActionType, string> = {
  post: 'wrote a new post',
  reply: 'replied to a comment',
  edit: 'edited a post',
  create: 'created a new project',
}

const getRelativeTimeString = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }

  const days = Math.floor(diffInSeconds / 86400)
  return `${days} ${days === 1 ? 'day' : 'days'} ago`
}
</script>

<template>
  <div class="space-y-3">
    <div class="text-muted-foreground text-xs font-medium">Activity</div>
    <Timeline>
      <TimelineItem
        v-for="item in items"
        :key="item.id"
        :step="item.id"
        class="m-0! flex-row items-center gap-3 py-2.5!"
      >
        <component :is="iconMap[item.action]" class="text-muted-foreground/80" :size="16" />
        <img :src="item.image" :alt="item.user" class="size-6 rounded-full" />
        <TimelineContent class="text-foreground">
          <a class="font-medium hover:underline" href="#">{{ item.user }}</a>
          <span class="font-normal">
            {{ ' ' }}{{ textMap[item.action] }}{{ ' ' }}
            <a class="hover:underline" href="#">{{ getRelativeTimeString(item.date) }}</a>
          </span>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </div>
</template>
