<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { SelectNative } from '@/components/ui/select-native'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-12-id">Timezone select (native)</Label>
      <SelectNative id="select-12-id" defaultValue="Europe/London">
        
          <option key=Europe/London value=Europe/London>
            (GMT+0) Europe/London
          </option>
        

          <option key=America/New_York value=America/New_York>
            (GMT-4) America/New York
          </option>
        

          <option key=Asia/Shanghai value=Asia/Shanghai>
            (GMT+8) Asia/Shanghai
          </option>
        
      </SelectNative>
    </div>
</template>
