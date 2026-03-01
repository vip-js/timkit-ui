<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-37-id">Options with flag</Label>
      <Select defaultValue="2">
        <SelectTrigger id="select-37-id"
          class="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
        >
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent class="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
          
            <SelectGroup>
              <SelectLabel class="ps-2">America</SelectLabel>
              
                <SelectItem value="1">
                  <span class="text-lg leading-none">🇺🇸</span> 
                  <span class="truncate">United States</span>
                </SelectItem>
              

                <SelectItem value="2">
                  <span class="text-lg leading-none">🇨🇦</span> 
                  <span class="truncate">Canada</span>
                </SelectItem>
              

                <SelectItem value="3">
                  <span class="text-lg leading-none">🇲🇽</span> 
                  <span class="truncate">Mexico</span>
                </SelectItem>
              
            </SelectGroup>
          

            <SelectGroup>
              <SelectLabel class="ps-2">Africa</SelectLabel>
              
                <SelectItem value="4">
                  <span class="text-lg leading-none">🇿🇦</span> 
                  <span class="truncate">South Africa</span>
                </SelectItem>
              

                <SelectItem value="5">
                  <span class="text-lg leading-none">🇳🇬</span> 
                  <span class="truncate">Nigeria</span>
                </SelectItem>
              

                <SelectItem value="6">
                  <span class="text-lg leading-none">🇲🇦</span> 
                  <span class="truncate">Morocco</span>
                </SelectItem>
              
            </SelectGroup>
          

            <SelectGroup>
              <SelectLabel class="ps-2">Asia</SelectLabel>
              
                <SelectItem value="7">
                  <span class="text-lg leading-none">🇨🇳</span> 
                  <span class="truncate">China</span>
                </SelectItem>
              

                <SelectItem value="8">
                  <span class="text-lg leading-none">🇯🇵</span> 
                  <span class="truncate">Japan</span>
                </SelectItem>
              

                <SelectItem value="9">
                  <span class="text-lg leading-none">🇮🇳</span> 
                  <span class="truncate">India</span>
                </SelectItem>
              
            </SelectGroup>
          

            <SelectGroup>
              <SelectLabel class="ps-2">Europe</SelectLabel>
              
                <SelectItem value="10">
                  <span class="text-lg leading-none">🇬🇧</span> 
                  <span class="truncate">United Kingdom</span>
                </SelectItem>
              

                <SelectItem value="11">
                  <span class="text-lg leading-none">🇫🇷</span> 
                  <span class="truncate">France</span>
                </SelectItem>
              

                <SelectItem value="12">
                  <span class="text-lg leading-none">🇩🇪</span> 
                  <span class="truncate">Germany</span>
                </SelectItem>
              
            </SelectGroup>
          

            <SelectGroup>
              <SelectLabel class="ps-2">Oceania</SelectLabel>
              
                <SelectItem value="13">
                  <span class="text-lg leading-none">🇦🇺</span> 
                  <span class="truncate">Australia</span>
                </SelectItem>
              

                <SelectItem value="14">
                  <span class="text-lg leading-none">🇳🇿</span> 
                  <span class="truncate">New Zealand</span>
                </SelectItem>
              
            </SelectGroup>
          
        </SelectContent>
      </Select>
    </div>
</template>
