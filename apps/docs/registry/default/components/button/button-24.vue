<script setup lang="ts">
import { ref } from 'vue';
import { BookmarkIcon } from 'lucide-vue-next';
import { Toggle } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';



const bookmarked = ref<boolean>(false);


function setBookmarked(next: typeof bookmarked.value | ((prev: typeof bookmarked.value) => typeof bookmarked.value)) {
  bookmarked.value = typeof next === 'function'
    ? (next as (prev: typeof bookmarked.value) => typeof bookmarked.value)(bookmarked.value)
    : next;
}

</script>

<template>
  <TooltipProvider><Tooltip><TooltipTrigger as-child><div><Toggle class="group size-9 p-0 hover:bg-indigo-50 hover:text-indigo-500 data-[state=on]:bg-indigo-50 data-[state=on]:text-indigo-500" aria-label="BookmarkIcon this" :pressed="bookmarked" :onPressedChange="setBookmarked"><BookmarkIcon :size="16" aria-hidden="true" /></Toggle></div></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs"><p><template v-if="bookmarked">
{{ 'Remove bookmark' }}
</template>
<template v-else>
{{ 'BookmarkIcon this' }}
</template></p></TooltipContent></Tooltip></TooltipProvider>
</template>
