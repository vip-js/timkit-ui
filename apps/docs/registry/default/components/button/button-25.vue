<script setup lang="ts">
import { BellIcon } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';



</script>

<template>
  <Button variant="outline" size="icon" class="relative" @click="handleClick" aria-label="Notifications"><BellIcon :size="16" aria-hidden="true" /><Badge v-if="count > 0" class="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">{{ count > 99 ? '99+' : count }}</Badge></Button>
</template>
