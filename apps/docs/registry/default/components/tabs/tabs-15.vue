<script setup lang="ts">
import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from 'lucide-vue-next';
import { Badge } from '@timui/vue';
import { Tabs } from '@timui/vue';
import { TabsContent } from '@timui/vue';
import { TabsList } from '@timui/vue';
import { TabsTrigger } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';




</script>

<template>
  <Tabs default-value="tab-1" class="items-center"><TabsList><TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><span><TabsTrigger value="tab-1" class="py-3"><HouseIcon :size="16" aria-hidden="true" /></TabsTrigger></span></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">Overview</TooltipContent></Tooltip></TooltipProvider><TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><span><TabsTrigger value="tab-2" class="group py-3"><span class="relative"><PanelsTopLeftIcon :size="16" aria-hidden="true" /><Badge class="border-background absolute -top-2.5 left-full min-w-4 -translate-x-1.5 px-0.5 text-[10px]/[.875rem] transition-opacity group-data-[state=inactive]:opacity-50">3
                    </Badge></span></TabsTrigger></span></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">Projects</TooltipContent></Tooltip></TooltipProvider><TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><span><TabsTrigger value="tab-3" class="py-3"><BoxIcon :size="16" aria-hidden="true" /></TabsTrigger></span></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">Packages</TooltipContent></Tooltip></TooltipProvider></TabsList><TabsContent value="tab-1"><p class="text-muted-foreground p-4 text-center text-xs">Content for Tab 1</p></TabsContent><TabsContent value="tab-2"><p class="text-muted-foreground p-4 text-center text-xs">Content for Tab 2</p></TabsContent><TabsContent value="tab-3"><p class="text-muted-foreground p-4 text-center text-xs">Content for Tab 3</p></TabsContent></Tabs>
</template>
