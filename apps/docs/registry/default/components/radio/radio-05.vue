<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<RadioGroup class="gap-6" >
      <div>
        <div class="flex items-start gap-2">
          <RadioGroupItem
            value="with-expansion" id="radio-05-id" aria-describedby="radio-05-id-1-description"
          />
          <div class="grow">
            <div class="grid grow gap-2">
              <Label for="radio-05-id">Radio with expansion</Label>
              <p id="radio-05-id" class="text-muted-foreground text-xs">
                You can use this radio with a label and a description.
              </p>
            </div>
            
            <div
              role="region" id="radio-05-id" aria-labelledby="radio-05-id-1"
              class="grid transition-all ease-in-out data-[state=collapsed]:grid-rows-[0fr] data-[state=collapsed]:opacity-0 data-[state=expanded]:grid-rows-[1fr] data-[state=expanded]:opacity-100"
              data-state='collapsed'
            >
              <div class="pointer-events-none -m-2 overflow-hidden p-2">
                <div class="pointer-events-auto mt-3">
                  <Input
                    type="text"
                    id="radio-05-additional-info"
                    placeholder="Enter details"
                    aria-label="Additional Information"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-start gap-2">
        <RadioGroupItem
          value="without-expansion" id="radio-05-id" aria-describedby="radio-05-id-2-description"
        />
        <div class="grid grow gap-2">
          <Label for="radio-05-id">Radio without expansion</Label>
          <p id="radio-05-id" class="text-muted-foreground text-xs">
            You can use this checkbox with a label and a description.
          </p>
        </div>
      </div>
    </RadioGroup>
</template>
