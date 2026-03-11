<script setup lang="ts">
import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs-content';
import { TabsList } from '@/components/ui/tabs-list';
import { TabsTrigger } from '@/components/ui/tabs-trigger';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent } from '@/components/ui/tooltip-content';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { TooltipTrigger } from '@/components/ui/tooltip-trigger';



</script>

<template>
  <Tabs default-value="tab-1" orientation="vertical" class="w-full flex-row"><TabsList class="flex-col"><TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><span><TabsTrigger value="tab-1" class="py-3"><HouseIcon :size="16" aria-hidden="true" /></TabsTrigger></span></TooltipTrigger><TooltipContent side="right" class="px-2 py-1 text-xs">Overview
            </TooltipContent></Tooltip></TooltipProvider><TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><span><TabsTrigger value="tab-2" class="group py-3"><span class="relative"><PanelsTopLeftIcon :size="16" aria-hidden="true" /><Badge class="border-background absolute -top-2.5 left-full min-w-4 -translate-x-1.5 px-0.5 text-[10px]/[.875rem] transition-opacity group-data-[state=inactive]:opacity-50">3
                    </Badge></span></TabsTrigger></span></TooltipTrigger><TooltipContent side="right" class="px-2 py-1 text-xs">Projects
            </TooltipContent></Tooltip></TooltipProvider><TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><span><TabsTrigger value="tab-3" class="py-3"><BoxIcon :size="16" aria-hidden="true" /></TabsTrigger></span></TooltipTrigger><TooltipContent side="right" class="px-2 py-1 text-xs">Packages
            </TooltipContent></Tooltip></TooltipProvider></TabsList><div class="grow rounded-md border text-start"><TabsContent value="tab-1"><p class="text-muted-foreground px-4 py-3 text-xs">Content for Tab 1</p></TabsContent><TabsContent value="tab-2"><p class="text-muted-foreground px-4 py-3 text-xs">Content for Tab 2</p></TabsContent><TabsContent value="tab-3"><p class="text-muted-foreground px-4 py-3 text-xs">Content for Tab 3</p></TabsContent></div></Tabs>
</template>
