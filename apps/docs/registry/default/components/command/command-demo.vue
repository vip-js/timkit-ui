<script setup lang="ts">
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from 'lucide-vue-next';
import { Command } from '@/components/ui/command';
import { CommandEmpty } from '@/components/ui/command-empty';
import { CommandGroup } from '@/components/ui/command-group';
import { CommandInput } from '@/components/ui/command-input';
import { CommandItem } from '@/components/ui/command-item';
import { CommandList } from '@/components/ui/command-list';
import { CommandSeparator } from '@/components/ui/command-separator';
import { CommandShortcut } from '@/components/ui/command-shortcut';



</script>

<template>
  <Command class="rounded-lg border shadow-md md:min-w-[450px]"><CommandInput placeholder="Type a command or search..." /><CommandList><CommandEmpty>No results found.</CommandEmpty><CommandGroup heading="Suggestions"><CommandItem><Calendar class="mr-2 h-4 w-4" /><span>Calendar</span></CommandItem><CommandItem><Smile class="mr-2 h-4 w-4" /><span>Search Emoji</span></CommandItem><CommandItem><Calculator class="mr-2 h-4 w-4" /><span>Calculator</span></CommandItem></CommandGroup><CommandSeparator /><CommandGroup heading="Settings"><CommandItem><User class="mr-2 h-4 w-4" /><span>Profile</span><CommandShortcut>⌘P</CommandShortcut></CommandItem><CommandItem><CreditCard class="mr-2 h-4 w-4" /><span>Billing</span><CommandShortcut>⌘B</CommandShortcut></CommandItem><CommandItem><Settings class="mr-2 h-4 w-4" /><span>Settings</span><CommandShortcut>⌘S</CommandShortcut></CommandItem></CommandGroup></CommandList></Command>
</template>
