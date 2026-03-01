<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type Component, type VNodeChild, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Command from "../command/command.vue";
import CommandEmpty from "../command/command-empty.vue";
import CommandGroup from "../command/command-group.vue";
import CommandItem from "../command/command-item.vue";
import CommandList from "../command/command-list.vue";
import CommandInput from "../command/command-input.vue";

const multiselectVariants = cva('')
const multiselectCommandVariants = cva('h-auto overflow-visible bg-transparent')
const multiselectContainerVariants = cva(
    'border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive relative min-h-[38px] rounded-md border text-sm transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50'
)
const multiselectTagVariants = cva(
    'animate-fadeIn bg-background text-secondary-foreground hover:bg-background relative inline-flex h-7 cursor-default items-center rounded-md border ps-2 pe-7 pl-2 text-xs font-medium transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-fixed:pe-2'
)
const multiselectTagRemoveVariants = cva(
    'text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-md border border-transparent p-0 outline-hidden transition-[color,box-shadow] outline-none focus-visible:ring-[3px]'
)
const multiselectInputVariants = cva(
    'placeholder:text-muted-foreground/70 flex-1 bg-transparent outline-none disabled:cursor-not-allowed px-3 py-2'
)
const multiselectClearButtonVariants = cva(
    'text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute end-0 top-0 flex size-9 items-center justify-center rounded-md border border-transparent transition-[color,box-shadow] outline-none focus-visible:ring-[3px]'
)
const multiselectDropdownVariants = cva(
    'border-input absolute top-2 z-10 w-full overflow-hidden rounded-md border text-popover-foreground bg-popover shadow-md'
)
const multiselectListVariants = cva('bg-popover text-popover-foreground shadow-lg outline-hidden')
const multiselectGroupVariants = cva('h-full overflow-auto')

export type Option = {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: any;
}

interface GroupOption {
  [key: string]: Option[];
}

const props = withDefaults(defineProps<{
  modelValue?: Option[];
  options?: Option[];
  defaultOptions?: Option[];
  variant?: string;
  defaultValue?: Option[];
  onSearch?: (term: string) => Promise<Option[]>;
  onSearchSync?: (term: string) => Option[];
  placeholder?: string;
  maxSelected?: number;
  hideClearAllButton?: boolean;
  hidePlaceholderWhenSelected?: boolean;
  emptyIndicator?: any;
  loadingIndicator?: any;
  delay?: number;
  triggerSearchOnFocus?: boolean;
  creatable?: boolean;
  groupBy?: string;
  selectFirstItem?: boolean;
  class?: HTMLAttributes['class'];
  badgeClass?: string;
  disabled?: boolean;
  onMaxSelected?: (count: number) => void;
}>(), {
  modelValue: () => [],
  options: () => [],
  maxSelected: Number.MAX_SAFE_INTEGER,
  selectFirstItem: true,
  placeholder: "Select...",
  delay: 500
});

const emit = defineEmits(["update:modelValue", "change", "search-change"]);

const commandRef = ref<any>(null);
const open = ref(false);
const isLoading = ref(false);
const selected = ref<Option[]>(props.modelValue || []);
const activeOptions = ref<GroupOption>({});
const inputValue = ref("");

const transToGroupOption = (list: Option[] = [], groupBy?: string): GroupOption => {
  if (list.length === 0) return {};
  if (!groupBy) return { "": list };
  const groupOption: GroupOption = {};
  list.forEach((option) => {
    const key = (option[groupBy] as string) || "";
    if (!groupOption[key]) groupOption[key] = [];
    groupOption[key].push(option);
  });
  return groupOption;
};

// Sync selected with modelValue
watch(() => props.modelValue, (val) => {
  selected.value = val || [];
}, { deep: true });

// Sync options to local state
watch(() => props.options, (val) => {
  if (!val || props.onSearch) return;
  activeOptions.value = transToGroupOption(val, props.groupBy);
}, { deep: true, immediate: true });

// Debounced search logic
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const debouncedSearchTerm = ref("");

watch(inputValue, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedSearchTerm.value = val;
  }, props.delay);
});

watch([debouncedSearchTerm, open, () => props.groupBy], async ([term, isOpen]) => {
   if (!isOpen) return;
   if (props.onSearch) {
     isLoading.value = true;
     const res = await props.onSearch(term);
     activeOptions.value = transToGroupOption(res, props.groupBy);
     isLoading.value = false;
   } else if (props.onSearchSync) {
     const res = props.onSearchSync(term);
     activeOptions.value = transToGroupOption(res, props.groupBy);
   } else {
     // Local filtering
     const filtered = props.options.filter(opt => 
        opt.label.toLowerCase().includes(term.toLowerCase())
     );
     activeOptions.value = transToGroupOption(filtered, props.groupBy);
   }
});

const handleUnselect = (option: Option) => {
  const next = selected.value.filter(s => s.value !== option.value);
  selected.value = next;
  emit("update:modelValue", next);
  emit("change", next);
};

const handleSelect = (option: Option) => {
    if (selected.value.length >= props.maxSelected) {
        props.onMaxSelected?.(selected.value.length);
        return;
    }
    // Prevent duplicate selection
    if (selected.value.find(s => s.value === option.value)) return;
    
    // Clear input
    inputValue.value = "";
    if (commandRef.value?.api) commandRef.value.api.value.setInputValue("");

    const next = [...selected.value, option];
    selected.value = next;
    emit("update:modelValue", next);
    emit("change", next);
};

// Use Command's API to detect input changes if we can't bind directly?
// CommandInput (Zig) uses api.inputProps. 
// We need to capture input. We can use `watch` on commandRef.api.value.inputValue if exposed.
// My Command component exposes `api`.
watch(() => commandRef.value?.api?.value?.inputValue, (val) => {
    if (val !== undefined) inputValue.value = val;
});

// Handling open state
const handleFocus = () => {
    if (!props.disabled) open.value = true;
};
const handleBlur = () => {
    // Check if clicking inside? Zig handles outside click for Combobox via Popover logic?
    // My Command is typically open=true always (inline) or Dialog.
    // Multiselect here creates a Dropdown manually.
    // If Command component has `open: true` internally, it renders.
    // Here we wrap CommandList in `multiselectDropdownVariants` div which is conditioned on `open`.
    // We need to handle outside click.
    setTimeout(() => { open.value = false; }, 200); // Simple delay for click to register
};

</script>

<template>
  <Command
    ref="commandRef"
    :class="multiselectCommandVariants()"
    multiple
    v-model:modelValue="selected"
  >
    <div :class="cn(multiselectContainerVariants(), props.class)">
       <div class="flex flex-wrap gap-1 p-1">
          <!-- Tags -->
          <div v-for="option in selected" :key="option.value" :class="cn(multiselectTagVariants(), props.badgeClass)">
             {{ option.label }}
             <button :class="multiselectTagRemoveVariants()" type="button" @click.stop="handleUnselect(option)">
                <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             </button>
          </div>
          
          <!-- Input -->
          <CommandInput
            :class="cn(multiselectInputVariants(), { 'ml-1': selected.length > 0 })"
            :placeholder="selected.length > 0 && props.hidePlaceholderWhenSelected ? '' : props.placeholder"
            @focus="handleFocus"
            @blur="handleBlur"
          />
          
          <!-- Clear Button -->
           <button
              v-if="!props.hideClearAllButton && !props.disabled && selected.length > 0"
              type="button"
              :class="multiselectClearButtonVariants()"
              @click.stop="selected = []; emit('update:modelValue', []); emit('change', [])"
           >
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
           </button>
       </div>
    </div>
    
    <div class="relative">
      <div v-if="open" :class="multiselectDropdownVariants()">
        <CommandList :class="multiselectListVariants()">
           <CommandEmpty v-if="Object.keys(activeOptions).length === 0 && !isLoading">
              {{ props.emptyIndicator || "No results found." }}
           </CommandEmpty>
           
           <template v-for="(options, group) in activeOptions" :key="group">
              <CommandGroup :heading="group || undefined" :class="multiselectGroupVariants()">
                 <CommandItem 
                    v-for="opt in options" 
                    :key="opt.value" 
                    :value="opt.value" 
                    :label="opt.label"
                    @select="handleSelect(opt)"
                    class="cursor-pointer"
                 >
                    {{ opt.label }}
                 </CommandItem>
              </CommandGroup>
           </template>
        </CommandList>
      </div>
    </div>
  </Command>
</template>
