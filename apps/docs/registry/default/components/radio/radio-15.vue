<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
</script>
<template>
<fieldset class="space-y-4">
      <legend class="text-foreground text-sm leading-none font-medium">Choose plan</legend>
      <RadioGroup class="gap-0 -space-y-px rounded-md shadow-xs" defaultValue="2">
        
          <div
            class="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <RadioGroupItem id="radio-15-id"
                  value="1"
                  class="after:absolute after:inset-0"-1"}-price"}
                />
                <Label class="inline-flex items-start" for="radio-15-id">
                  Hobby
                  
                </Label>
              </div>
              <div id="radio-15-id"-1"}-price" class="text-muted-foreground text-xs leading-[inherit]"
              >
                $9/mo
              </div>
            </div>
          </div>
        

          <div
            class="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <RadioGroupItem id="radio-15-id"
                  value="2"
                  class="after:absolute after:inset-0"-2"}-price"}
                />
                <Label class="inline-flex items-start" for="radio-15-id">
                  Plus
                  
                </Label>
              </div>
              <div id="radio-15-id"-2"}-price" class="text-muted-foreground text-xs leading-[inherit]"
              >
                $29/mo
              </div>
            </div>
          </div>
        

          <div
            class="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <RadioGroupItem id="radio-15-id"
                  value="3"
                  class="after:absolute after:inset-0"-3"}-price"}
                />
                <Label class="inline-flex items-start" for="radio-15-id">
                  Team
                  
                </Label>
              </div>
              <div id="radio-15-id"-3"}-price" class="text-muted-foreground text-xs leading-[inherit]"
              >
                $49/mo
              </div>
            </div>
          </div>
        

          <div
            class="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <RadioGroupItem id="radio-15-id"
                  value="4"
                  class="after:absolute after:inset-0"-4"}-price"}
                />
                <Label class="inline-flex items-start" for="radio-15-id">
                  Enterprise
                  
                </Label>
              </div>
              <div id="radio-15-id"-4"}-price" class="text-muted-foreground text-xs leading-[inherit]"
              >
                Custom
              </div>
            </div>
          </div>
        
      </RadioGroup>
    </fieldset>
</template>
