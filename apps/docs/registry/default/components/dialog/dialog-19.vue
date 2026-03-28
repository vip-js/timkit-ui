<script setup lang="ts">
import { computed, ref } from 'vue';
import { CheckIcon, ImagePlusIcon, XIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';
import { useCharacterLimit } from '@/registry/default/hooks/use-character-limit-vue';
import { useFileUpload } from '@/registry/default/hooks/use-file-upload-vue';

const initialBgImage = [
  {
    name: 'profile-bg.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: '/profile-bg.jpg',
    id: 'profile-bg-123456789',
  },
];

const initialAvatarImage = [
  {
    name: 'avatar-72-01.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: '/avatar-72-01.jpg',
    id: 'avatar-123456789',
  },
];

const id = 'dialog-19';

const firstName = ref('Margaret');
const lastName = ref('Villard');
const username = ref('margaret-villard-69');
const website = ref('www.margaret.com');

const maxLength = 180;
const {
  value,
  characterCount,
  maxLength: limit,
} = useCharacterLimit({
  maxLength,
  initialValue: 'Hey, I am Margaret, a web developer who loves turning ideas into amazing websites!',
});

const [{ files: bgFiles }, { removeFile: removeBgFile, openFileDialog: openBgDialog, getInputProps: getBgInputProps }] = useFileUpload({
  accept: 'image/*',
  initialFiles: initialBgImage,
});

const [{ files: avatarFiles }, { openFileDialog: openAvatarDialog, getInputProps: getAvatarInputProps }] = useFileUpload({
  accept: 'image/*',
  initialFiles: initialAvatarImage,
});

const currentBgImage = computed(() => bgFiles.value[0]?.preview ?? null);
const currentAvatarImage = computed(() => avatarFiles.value[0]?.preview ?? null);

function removeCurrentBgImage() {
  const imageId = bgFiles.value[0]?.id;
  if (imageId) {
    removeBgFile(imageId);
  }
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">Edit profile</Button>
    </DialogTrigger>
    <DialogContent class="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
      <DialogHeader class="contents space-y-0 text-left">
        <DialogTitle class="border-b px-6 py-4 text-base">Edit profile</DialogTitle>
      </DialogHeader>
      <DialogDescription class="sr-only">
        Make changes to your profile here. You can change your photo and set a username.
      </DialogDescription>

      <div class="overflow-y-auto">
        <div class="h-32">
          <div class="bg-muted relative flex size-full items-center justify-center overflow-hidden">
            <img
              v-if="currentBgImage"
              class="size-full object-cover"
              :src="currentBgImage"
              :alt="currentBgImage ? 'Preview of uploaded image' : 'Default profile background'"
              :width="512"
              :height="96"
            />
            <div class="absolute inset-0 flex items-center justify-center gap-2">
              <button
                type="button"
                class="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                @click="openBgDialog"
                :aria-label="currentBgImage ? 'Change image' : 'Upload image'"
              >
                <ImagePlusIcon :size="16" aria-hidden="true" />
              </button>
              <button
                v-if="currentBgImage"
                type="button"
                class="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                @click="removeCurrentBgImage"
                aria-label="Remove image"
              >
                <XIcon :size="16" aria-hidden="true" />
              </button>
            </div>
          </div>
          <input v-bind="getBgInputProps()" class="sr-only" aria-label="Upload image file" />
        </div>

        <div class="-mt-10 px-6">
          <div class="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
            <img
              v-if="currentAvatarImage"
              :src="currentAvatarImage"
              class="size-full object-cover"
              :width="80"
              :height="80"
              alt="Profile image"
            />
            <button
              type="button"
              class="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              @click="openAvatarDialog"
              aria-label="Change profile picture"
            >
              <ImagePlusIcon :size="16" aria-hidden="true" />
            </button>
            <input v-bind="getAvatarInputProps()" class="sr-only" aria-label="Upload profile picture" />
          </div>
        </div>

        <div class="px-6 pt-4 pb-6">
          <form class="space-y-4">
            <div class="flex flex-col gap-4 sm:flex-row">
              <div class="flex-1 space-y-2">
                <Label :htmlFor="`${id}-first-name`">First name</Label>
                <Input :id="`${id}-first-name`" v-model="firstName" placeholder="Matt" type="text" required />
              </div>
              <div class="flex-1 space-y-2">
                <Label :htmlFor="`${id}-last-name`">Last name</Label>
                <Input :id="`${id}-last-name`" v-model="lastName" placeholder="Welsh" type="text" required />
              </div>
            </div>

            <div class="*:not-first:mt-2">
              <Label :htmlFor="`${id}-username`">Username</Label>
              <div class="relative">
                <Input
                  :id="`${id}-username`"
                  v-model="username"
                  class="peer pe-9"
                  placeholder="Username"
                  type="text"
                  required
                />
                <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                  <CheckIcon :size="16" class="text-emerald-500" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div class="*:not-first:mt-2">
              <Label :htmlFor="`${id}-website`">Website</Label>
              <div class="flex rounded-md shadow-xs">
                <span class="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
                  https://
                </span>
                <Input
                  :id="`${id}-website`"
                  v-model="website"
                  class="-ms-px rounded-s-none shadow-none"
                  placeholder="yourwebsite.com"
                  type="text"
                />
              </div>
            </div>

            <div class="*:not-first:mt-2">
              <Label :htmlFor="`${id}-bio`">Biography</Label>
              <Textarea
                :id="`${id}-bio`"
                v-model="value"
                placeholder="Write a few sentences about yourself"
                :maxLength="maxLength"
                :aria-describedby="`${id}-description`"
              />
              <p :id="`${id}-description`" class="text-muted-foreground mt-2 text-right text-xs" role="status" aria-live="polite">
                <span class="tabular-nums">{{ limit - characterCount }}</span> characters left
              </p>
            </div>
          </form>
        </div>
      </div>

      <DialogFooter class="border-t px-6 py-4">
        <DialogClose as-child>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose as-child>
          <Button type="button">Save changes</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
