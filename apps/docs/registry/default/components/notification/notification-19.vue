<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast-action';
import { useToast } from '@/registry/default/hooks/use-toast.vue';


</script>

<template>
  <Button variant="outline" @click="{
        toast({
          title: "We couldn't complete your request!",
          description: 'There was a problem with your request.',
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }">Show toast
    </Button>
</template>
