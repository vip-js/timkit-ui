<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with mask</Label><Input :id="id" placeholder="AB12 CDE" type="text" :ref="withMask('AA99 AAA', {
          placeholder: '',
          showMaskOnHover: false,
        })" /><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Built with{{ ' ' }}<a class="hover:text-foreground underline" href="https://github.com/eduardoborges/use-mask-input" target="_blank" rel="noopener nofollow">use-mask-input
        </a></p></div>
</template>
