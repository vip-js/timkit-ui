<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Options with flag</Label><Select default-value="2"><SelectTrigger :id="id" class="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"><SelectValue placeholder="Select framework" /></SelectTrigger><SelectContent class="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0"><SelectGroup v-for="(continent, index) in countries" :key="index" :key="continent.continent"><SelectLabel class="ps-2">{{ continent.continent }}</SelectLabel><SelectItem v-for="(item, index) in continent.items" :key="index" :key="item.value" :value="item.value"><span class="text-lg leading-none">{{ item.flag }}</span>{{ ' ' }}<span class="truncate">{{ item.label }}</span></SelectItem></SelectGroup></SelectContent></Select></div>
</template>
