<script setup lang="ts">
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-06';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with error</Label><Input :id="id" class="peer" placeholder="Email" type="email" default-value="invalid@email.com" aria-invalid /><p class="peer-aria-invalid:text-destructive mt-2 text-xs" role="alert" aria-live="polite">Email is invalid
      </p></div>
</template>
