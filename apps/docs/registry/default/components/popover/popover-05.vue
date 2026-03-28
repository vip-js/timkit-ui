<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@timui/vue';
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue';



const currentTip = ref(0);

</script>

<template>
  <Popover><PopoverTrigger as-child><Button variant="outline">Tooltip-like with steps</Button></PopoverTrigger><PopoverContent class="max-w-[280px] py-3 shadow-none" side="top"><div class="space-y-3"><div class="space-y-1"><p class="text-[13px] font-medium">{{ tips[currentTip].title }}</p><p class="text-muted-foreground text-xs">{{ tips[currentTip].description }}</p></div><div class="flex items-center justify-between gap-2"><span class="text-muted-foreground text-xs">{{ currentTip + 1 }}/{{ tips.length }}</span><button class="text-xs font-medium hover:underline" @click="handleNavigation"><template v-if="currentTip === tips.length - 1">
{{ 'Start over' }}
</template>
<template v-else>
{{ 'Next' }}
</template></button></div></div></PopoverContent></Popover>
</template>
