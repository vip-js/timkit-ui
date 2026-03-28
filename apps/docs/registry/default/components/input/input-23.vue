<script setup lang="ts">
import { ref } from 'vue';
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';



const isVisible = ref<boolean>(false);


const id = 'input-23';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Show/hide password input</Label><div class="relative"><Input :id="id" class="pe-9" placeholder="Password" :type="isVisible ? 'text' : 'password'" /><button class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50" type="button" @click="toggleVisibility" :aria-label="isVisible ? 'Hide password' : 'Show password'" :aria-pressed="isVisible" aria-controls="password"><template v-if="isVisible">
<EyeOffIcon :size="16" aria-hidden="true" />
</template>
<template v-else>
<EyeIcon :size="16" aria-hidden="true" />
</template></button></div></div>
</template>
