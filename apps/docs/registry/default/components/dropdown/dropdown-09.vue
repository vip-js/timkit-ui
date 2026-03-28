<script setup lang="ts">
import { ref } from 'vue';
import { ArchiveRestoreIcon, ChevronDownIcon, PlusIcon, Share2Icon, TrashIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@timui/vue';



const framework = ref('nextjs');
const emailNotifications = ref(false);
const pushNotifications = ref(true);


function setFramework(next: typeof framework.value | ((prev: typeof framework.value) => typeof framework.value)) {
  framework.value = typeof next === 'function'
    ? (next as (prev: typeof framework.value) => typeof framework.value)(framework.value)
    : next;
}

function setEmailNotifications(next: typeof emailNotifications.value | ((prev: typeof emailNotifications.value) => typeof emailNotifications.value)) {
  emailNotifications.value = typeof next === 'function'
    ? (next as (prev: typeof emailNotifications.value) => typeof emailNotifications.value)(emailNotifications.value)
    : next;
}

function setPushNotifications(next: typeof pushNotifications.value | ((prev: typeof pushNotifications.value) => typeof pushNotifications.value)) {
  pushNotifications.value = typeof next === 'function'
    ? (next as (prev: typeof pushNotifications.value) => typeof pushNotifications.value)(pushNotifications.value)
    : next;
}

</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline">Rich menu with icons
          <ChevronDownIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuGroup><DropdownMenuItem><PlusIcon :size="16" class="opacity-60" aria-hidden="true" /><span>New</span><DropdownMenuShortcut>⌘N</DropdownMenuShortcut></DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuGroup><DropdownMenuSub><DropdownMenuSubTrigger inset>Framework</DropdownMenuSubTrigger><DropdownMenuPortal><DropdownMenuSubContent><DropdownMenuRadioGroup :value="framework" @update:modelValue="setFramework"><DropdownMenuRadioItem value="nextjs">Next.js</DropdownMenuRadioItem><DropdownMenuRadioItem value="sveltekit" disabled>SvelteKit
                  </DropdownMenuRadioItem><DropdownMenuRadioItem value="remix">Remix</DropdownMenuRadioItem><DropdownMenuRadioItem value="astro">Astro</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuSubContent></DropdownMenuPortal></DropdownMenuSub><DropdownMenuSub><DropdownMenuSubTrigger inset>Notifications</DropdownMenuSubTrigger><DropdownMenuPortal><DropdownMenuSubContent><DropdownMenuCheckboxItem :checked="emailNotifications" :onCheckedChange="setEmailNotifications">Email
                </DropdownMenuCheckboxItem><DropdownMenuCheckboxItem :checked="pushNotifications" :onCheckedChange="setPushNotifications">Push
                </DropdownMenuCheckboxItem></DropdownMenuSubContent></DropdownMenuPortal></DropdownMenuSub></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuGroup><DropdownMenuItem><Share2Icon :size="16" class="opacity-60" aria-hidden="true" /><span>Share</span></DropdownMenuItem><DropdownMenuItem><ArchiveRestoreIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Archive</span></DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuItem variant="destructive"><TrashIcon :size="16" aria-hidden="true" /><span>Delete</span><DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut></DropdownMenuItem></DropdownMenuContent></DropdownMenu>
</template>
