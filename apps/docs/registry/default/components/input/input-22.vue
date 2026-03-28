<script setup lang="ts">
import { Button } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-22';

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with button</Label><div class="flex gap-2"><Input :id="id" class="flex-1" placeholder="Email" type="email" /><Button variant="outline">Send</Button></div></div>
</template>
