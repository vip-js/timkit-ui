<script setup lang="ts">
import { h } from 'vue';
import { Button } from '@timui/vue';
import { ToastAction } from '@timui/vue';
import { useToast } from '@/registry/default/hooks/use-toast-vue';

const { toast } = useToast();

const TryAgainAction = () =>
  h(ToastAction, { altText: 'Try again' }, { default: () => 'Try again' });

function handleShowToast() {
  toast({
    title: "We couldn't complete your request!",
    description: 'There was a problem with your request.',
    action: TryAgainAction,
  });
}
</script>

<template>
  <Button variant="outline" @click="handleShowToast">Show toast</Button>
</template>
