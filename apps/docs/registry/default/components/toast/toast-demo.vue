<script setup lang="ts">
import { Button } from '@timui/vue';
import { useToast } from '@/registry/default/hooks/use-toast-vue';

const { toast } = useToast();

function handleShowToast() {
  toast({
    title: 'Scheduled: Catch up ',
    description: 'Friday, February 10, 2023 at 5:57 PM',
  });
}
</script>

<template>
  <Button variant="outline" @click="handleShowToast">Show Toast</Button>
</template>
