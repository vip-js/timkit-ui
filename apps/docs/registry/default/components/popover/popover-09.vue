<script setup lang="ts">
import { ref, type FunctionalComponent } from 'vue'
import { ClubIcon, DiamondIcon, HeartIcon, SpadeIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@timui/vue'

type TourStep = {
  icon: FunctionalComponent
  title: string
  description: string
}

const currentTip = ref(0)

const tourSteps: TourStep[] = [
  {
    icon: HeartIcon,
    title: 'Heart',
    description:
      "This is your new workspace. Here you'll find all your projects, recent activities, settings, and more.",
  },
  {
    icon: DiamondIcon,
    title: 'Diamond',
    description:
      'Use the toolbar above to create new projects, invite team members, or access settings.',
  },
  {
    icon: ClubIcon,
    title: 'Club',
    description:
      'Click the support icon in the top right corner to access our help center and documentation.',
  },
  {
    icon: SpadeIcon,
    title: 'Spade',
    description:
      'Press ⌘K to open the command palette. Use arrow keys to navigate and Enter to select an action.',
  },
]

const handleOpenChange = (open: boolean) => {
  if (open) currentTip.value = 0
}

const handleNavigation = () => {
  currentTip.value = currentTip.value === tourSteps.length - 1 ? 0 : currentTip.value + 1
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <Popover @update:open="handleOpenChange">
      <div class="grid grid-cols-2 place-items-center gap-4">
        <template v-for="(step, index) in tourSteps" :key="step.title">
          <PopoverAnchor v-if="currentTip === index">
            <div class="bg-secondary text-muted-foreground flex size-10 items-center justify-center rounded-md text-sm font-medium">
              {{ index + 1 }}
            </div>
          </PopoverAnchor>
          <div
            v-else
            class="bg-secondary text-muted-foreground flex size-10 items-center justify-center rounded-md text-sm font-medium"
          >
            {{ index + 1 }}
          </div>
        </template>
      </div>

      <PopoverTrigger as-child>
        <Button variant="outline">Start tour</Button>
      </PopoverTrigger>

      <PopoverContent class="max-w-[280px] py-3 shadow-none" :side="currentTip % 2 === 0 ? 'left' : 'right'" :showArrow="true">
        <div class="space-y-3">
          <div class="space-y-1">
            <p class="text-[13px] font-medium">{{ tourSteps[currentTip].title }}</p>
            <p class="text-muted-foreground text-xs">{{ tourSteps[currentTip].description }}</p>
          </div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-muted-foreground text-xs">{{ currentTip + 1 }}/{{ tourSteps.length }}</span>
            <button class="text-xs font-medium hover:underline" @click="handleNavigation">
              {{ currentTip === tourSteps.length - 1 ? 'Start over' : 'Next' }}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
