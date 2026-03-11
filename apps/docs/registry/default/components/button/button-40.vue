<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';



</script>

<template>
  <div class="divide-primary-foreground/30 inline-flex divide-x rounded-md shadow-xs rtl:space-x-reverse"><Button class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10">{{ options[Number(selectedIndex)].label }}</Button><DropdownMenu><DropdownMenuTrigger as-child><Button class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10" size="icon" aria-label="Options"><ChevronDownIcon :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent class="max-w-64 md:max-w-xs" side="bottom" :sideOffset="4" align="end"><DropdownMenuRadioGroup :value="selectedIndex" @update:modelValue="setSelectedIndex"><DropdownMenuRadioItem v-for="(option, index) in options" :key="index" :key="option.label" :value="String(index)" class="items-start [&>span]:pt-1.5"><div class="flex flex-col gap-1"><span class="text-sm font-medium">{{ option.label }}</span><span class="text-muted-foreground text-xs">{{ option.description }}</span></div></DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu></div>
</template>
