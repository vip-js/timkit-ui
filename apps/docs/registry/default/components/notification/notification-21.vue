<script setup lang="ts">
import { Button } from '@/components/ui/button';



</script>

<template>
  <Button variant="outline" @click="{
        toast('Your request was completed!', {
          description: 'It was a long journey, but we made it!',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
        })
      }">Show sonner
    </Button>
</template>
