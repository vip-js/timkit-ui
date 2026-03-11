<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="flex items-center gap-2"><Checkbox :style="{
            '--primary': 'var(--color-emerald-500)',
          } as React.CSSProperties" :id="id" class="rounded-full" defaultChecked /><Label :htmlFor="id" class="peer-data-[state=checked]:line-throgh after:bg-muted-foreground peer-data-[state=checked]:text-muted-foreground relative after:absolute after:top-1/2 after:left-0 after:h-px after:w-full after:origin-bottom after:-translate-y-1/2 after:scale-x-0 after:transition-transform after:ease-in-out peer-data-[state=checked]:after:origin-bottom peer-data-[state=checked]:after:scale-x-100">Fancy todo item
      </Label></div>
</template>
