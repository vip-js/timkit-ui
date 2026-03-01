<script setup lang="ts">
import { isVNode } from 'vue'
import ToastComponent from './ui/toast/toast.vue'
import ToastCloseComponent from './ui/toast/toast-close.vue'
import ToastDescriptionComponent from './ui/toast/toast-description.vue'
import ToastTitleComponent from './ui/toast/toast-title.vue'
import ToastViewportComponent from './ui/toast/toast-viewport.vue'
import ToastProviderComponent from './ui/toast/toast-provider.vue'
import { useToast } from '../hooks/use-toast' 

const { toasts } = useToast()
</script>

<template>
  <ToastProviderComponent>
    <ToastComponent
      v-for="toast in toasts"
      :key="toast.id"
      v-bind="toast"
    >
      <div class="grid gap-1">
        <ToastTitleComponent v-if="toast.title">
          {{ toast.title }}
        </ToastTitleComponent>
        <div v-if="toast.description">
          <ToastDescriptionComponent v-if="isVNode(toast.description)">
            <component :is="toast.description" />
          </ToastDescriptionComponent>
          <ToastDescriptionComponent v-else>
            {{ toast.description }}
          </ToastDescriptionComponent>
        </div>
      </div>
      <component :is="toast.action" />
      <ToastCloseComponent />
    </ToastComponent>
    <ToastViewportComponent />
  </ToastProviderComponent>
</template>
