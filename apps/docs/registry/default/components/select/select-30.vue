<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-30-id">Timezone select</Label>
      <Select defaultValue="Europe/London">
        <SelectTrigger id="select-30-id">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          
            <SelectItem key=Europe/London value=Europe/London>
              (GMT+0) Europe/London
            </SelectItem>
          

            <SelectItem key=America/New_York value=America/New_York>
              (GMT-4) America/New York
            </SelectItem>
          

            <SelectItem key=Asia/Shanghai value=Asia/Shanghai>
              (GMT+8) Asia/Shanghai
            </SelectItem>
          
        </SelectContent>
      </Select>
    </div>
</template>
