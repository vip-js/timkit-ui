<script setup lang="ts">
import { h } from 'vue'
import { Button, ToastAction, toast } from '@timui/vue'

const handleUndo = () => {
  console.log('Undo')
}

const showToast = () => {
  toast({
    title: 'Your request was completed!',
    description: 'It was a long journey, but we made it!',
    action: h(
      ToastAction,
      {
        altText: 'Undo',
        onClick: handleUndo,
      },
      () => 'Undo'
    ),
  })
}
</script>

<template>
  <Button variant="outline" @click="showToast">Show toast</Button>
</template>
