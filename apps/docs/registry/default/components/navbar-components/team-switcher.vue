<script setup lang="ts">
import { ref } from 'vue'
import { ChevronsUpDown } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@timui/vue'

interface Props {
  teams: string[]
  defaultTeam: string
}

const props = defineProps<Props>()
const selectedProject = ref(props.defaultTeam)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="p-0 hover:bg-transparent">
        <span
          class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full"
        >
          {{ selectedProject.charAt(0).toUpperCase() }}
        </span>
        <div class="flex flex-col gap-0.5 leading-none">
          <span>{{ selectedProject }}</span>
        </div>
        <ChevronsUpDown :size="14" class="text-muted-foreground/80" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem
        v-for="project in props.teams"
        :key="project"
        @click="selectedProject = project"
      >
        {{ project }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
