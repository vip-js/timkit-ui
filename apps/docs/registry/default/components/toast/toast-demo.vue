<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';


</script>

<template>
  <Button variant="outline" @click="{
        toast({
          title: 'Scheduled: Catch up ',
          description: 'Friday, February 10, 2023 at 5:57 PM',
        })
      }">Show Toast
    </Button>
</template>
