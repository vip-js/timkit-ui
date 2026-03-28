<script setup lang="ts">
import { ref } from 'vue';
import { MoonIcon, SunIcon } from 'lucide-vue-next';
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';



const checked = ref<boolean>(true);


const id = 'switch-10';


function setChecked(next: typeof checked.value | ((prev: typeof checked.value) => typeof checked.value)) {
  checked.value = typeof next === 'function'
    ? (next as (prev: typeof checked.value) => typeof checked.value)(checked.value)
    : next;
}

</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" :checked="checked" :onCheckedChange="setChecked" aria-label="Toggle switch" /><Label :htmlFor="id"><span class="sr-only">Toggle switch</span><template v-if="checked">
<SunIcon :size="16" aria-hidden="true" />
</template>
<template v-else>
<MoonIcon :size="16" aria-hidden="true" />
</template></Label></div>
</template>
