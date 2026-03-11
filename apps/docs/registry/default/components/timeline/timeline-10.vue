<script setup lang="ts">
import { BookOpenIcon, LucideIcon, MessageCircleIcon, PencilIcon, PlusIcon } from 'lucide-vue-next';
import { Timeline } from '@/components/ui/timeline';
import { TimelineContent } from '@/components/ui/timeline-content';
import { TimelineItem } from '@/components/ui/timeline-item';



</script>

<template>
  <div class="space-y-3"><div class="text-muted-foreground text-xs font-medium">Activity</div><Timeline>{{ items.map((item) => {
          const ActionIcon = getActionIcon(item.action)
          return (
            <TimelineItem
              key={item.id}
              step={item.id}
              className="m-0! flex-row items-center gap-3 py-2.5!"
            >
              <ActionIcon className="text-muted-foreground/80" size={16} />
              <img src={item.image} alt={item.user} className="size-6 rounded-full" />
              <TimelineContent className="text-foreground">
                <a className="font-medium hover:underline" href="#">
                  {item.user}
                </a>
                <span className="font-normal">
                  {' '}
                  {getActionText(item.action)}{' '}
                  <a className="hover:underline" href="#">
                    {getRelativeTimeString(item.date)}
                  </a>
                </span>
              </TimelineContent>
            </TimelineItem>
          )
        }) }}</Timeline></div>
</template>
