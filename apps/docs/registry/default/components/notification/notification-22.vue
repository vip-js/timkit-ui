<script setup lang="ts">
import { h } from 'vue'
import { Button, ToastAction, toast } from '@timui/vue'

function showCustomToast() {
  toast({
    title: 'Message sent',
    description: 'It was a long journey, but we made it!',
    action: h(
      ToastAction,
      {
        altText: 'Undo',
        onClick: () =>
          toast({
            title: 'Undo clicked',
          }),
      },
      () => 'Undo'
    ),
  })
}
</script>

<template>
  <Button variant="outline" @click="showCustomToast">Custom toast</Button>
</template>
