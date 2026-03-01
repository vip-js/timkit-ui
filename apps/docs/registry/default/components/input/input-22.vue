<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-22-id">Input with button</Label>
      <div class="flex gap-2">
        <Input id="input-22-id" class="flex-1" placeholder="Email" type="email" />
        <Button variant="outline">Send</Button>
      </div>
    </div>
</template>
