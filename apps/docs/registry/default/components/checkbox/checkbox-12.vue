<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div>
      <div class="flex items-start gap-2">
        <Checkbox id="checkbox-12-id" aria-describedby="checkbox-12-id-description"
        />
        <div class="grow">
          <div class="grid gap-2">
            <Label for="checkbox-12-id">Checkbox with expansion</Label>
            <p id="checkbox-12-id" class="text-muted-foreground text-xs">
              You can use this checkbox with a label and a description.
            </p>
          </div>
          
          <div
            role="region" id="checkbox-12-id"
            class="grid transition-all ease-in-out data-[state=collapsed]:grid-rows-[0fr] data-[state=collapsed]:opacity-0 data-[state=expanded]:grid-rows-[1fr] data-[state=expanded]:opacity-100"
            data-state='collapsed'
          >
            <div class="pointer-events-none -m-2 overflow-hidden p-2">
              <div class="pointer-events-auto mt-3">
                <Input
                  type="text"
                  id="checkbox-11-additional-info"
                  placeholder="Enter details"
                  aria-label="Additional Information"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
