<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';



const isExpanded = ref<boolean>(false);

</script>

<template>
  <Button class="gap-1" variant="ghost" @click="toggleExpand" :aria-expanded="isExpanded" aria-controls="expandable-content"><template v-if="isExpanded">
{{ 'Show less' }}
</template>
<template v-else>
{{ 'Show more' }}
</template><template v-if="isExpanded">
<ChevronUpIcon class="-me-1" :size="16" aria-hidden="true" />
</template>
<template v-else>
<ChevronDownIcon class="-me-1" :size="16" aria-hidden="true" />
</template></Button>
</template>
