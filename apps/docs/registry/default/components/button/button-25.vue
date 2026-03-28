<script setup lang="ts">
import { ref } from 'vue';
import { BellIcon } from 'lucide-vue-next';
import { Badge } from '@timui/vue';
import { Button } from '@timui/vue';



const count = ref(3);

</script>

<template>
  <Button variant="outline" size="icon" class="relative" @click="handleClick" aria-label="Notifications"><BellIcon :size="16" aria-hidden="true" /><Badge v-if="count > 0" class="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1"><template v-if="count > 99">
{{ '99+' }}
</template>
<template v-else>
{{ count }}
</template></Badge></Button>
</template>
