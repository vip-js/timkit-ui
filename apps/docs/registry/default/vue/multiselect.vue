<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-vue-next";
import Command from "./command.vue";
import CommandEmpty from "./command-empty.vue";
import CommandGroup from "./command-group.vue";
import CommandItem from "./command-item.vue";
import CommandList from "./command-list.vue";
import CommandInput from "./command-input.vue";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
}

interface GroupOption {
  [key: string]: Option[];
}

const props = defineProps<{
  modelValue?: Option[];
  defaultOptions?: Option[];
  options?: Option[];
  placeholder?: string;
  loadingIndicator?: any;
  emptyIndicator?: any;
  delay?: number;
  triggerSearchOnFocus?: boolean;
  onSearch?: (value: string) => Promise<Option[]>;
  onSearchSync?: (value: string) => Option[];
  maxSelected?: number;
  onMaxSelected?: (maxLimit: number) => void;
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  groupBy?: string;
  class?: string;
  badgeClass?: string;
  selectFirstItem?: boolean;
  creatable?: boolean;
  hideClearAllButton?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const inputRef = ref<{ inputEl?: HTMLInputElement | null } | null>(null);
const listId = `multiselect-list-${Math.random().toString(36).slice(2)}`;
const dropdownRef = ref<{ rootEl?: HTMLElement | null } | null>(null);
const open = ref(false);
const onScrollbar = ref(false);
const isLoading = ref(false);

const selected = ref<Option[]>(props.modelValue ?? []);
const options = ref<GroupOption>({});
const inputValue = ref("");

const maxSelected = computed(() => props.maxSelected ?? Number.MAX_SAFE_INTEGER);
const selectFirstItem = computed(() => props.selectFirstItem ?? true);

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

const removePickedOption = (groupOption: GroupOption, picked: Option[]) => {
  const clone = JSON.parse(JSON.stringify(groupOption)) as GroupOption;
  for (const [key, value] of Object.entries(clone)) {
    clone[key] = value.filter((val) => !picked.find((p) => p.value === val.value));
  }
  return clone;
};

const isOptionsExist = (groupOption: GroupOption, targetOption: Option[]) => {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some((option) => targetOption.find((p) => p.value === option.value))) {
      return true;
    }
  }
  return false;
};

const debouncedSearchTerm = ref("");
let debounceTimer: number | null = null;
watch(
  () => inputValue.value,
  (val) => {
    if (debounceTimer) window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      debouncedSearchTerm.value = val;
    }, props.delay ?? 500);
  }
);

watch(
  () => props.modelValue,
  (val) => {
    if (val) selected.value = val;
  }
);

watch(
  () => props.options,
  (val) => {
    if (!val || props.onSearch) return;
    options.value = transToGroupOption(val, props.groupBy);
  },
  { deep: true }
);

watch(
  () => props.defaultOptions,
  (val) => {
    if (!props.options && !props.onSearch) {
      options.value = transToGroupOption(val ?? [], props.groupBy);
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => [debouncedSearchTerm.value, open.value, props.groupBy],
  async () => {
    if (!props.onSearchSync || !open.value) return;
    if (props.triggerSearchOnFocus || debouncedSearchTerm.value) {
      const res = props.onSearchSync?.(debouncedSearchTerm.value) ?? [];
      options.value = transToGroupOption(res, props.groupBy);
    }
  }
);

watch(
  () => [debouncedSearchTerm.value, open.value, props.groupBy],
  async () => {
    if (!props.onSearch || !open.value) return;
    if (props.triggerSearchOnFocus || debouncedSearchTerm.value) {
      isLoading.value = true;
      const res = (await props.onSearch?.(debouncedSearchTerm.value)) ?? [];
      options.value = transToGroupOption(res, props.groupBy);
      isLoading.value = false;
    }
  }
);

const selectables = computed(() => removePickedOption(options.value, selected.value));
const flatSelectables = computed(() =>
  Object.values(selectables.value).flat().filter((item) => !item.disable)
);

const handleUnselect = (option: Option) => {
  const next = selected.value.filter((s) => s.value !== option.value);
  selected.value = next;
  emit("update:modelValue", next);
  emit("change", next);
};

const getInputEl = () => inputRef.value?.inputEl ?? null;

const handleClickOutside = (event: MouseEvent | TouchEvent) => {
  const rootEl = dropdownRef.value?.rootEl ?? null;
  if (
    rootEl &&
    !rootEl.contains(event.target as Node) &&
    getInputEl() &&
    !getInputEl()?.contains(event.target as Node)
  ) {
    open.value = false;
    getInputEl()?.blur();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("touchend", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("touchend", handleClickOutside);
});

const creatableItem = computed(() => {
  if (!props.creatable) return undefined;
  if (
    isOptionsExist(options.value, [{ value: inputValue.value, label: inputValue.value }]) ||
    selected.value.find((s) => s.value === inputValue.value)
  ) {
    return undefined;
  }
  if (!props.onSearch && inputValue.value.length > 0) return inputValue.value;
  if (props.onSearch && debouncedSearchTerm.value.length > 0 && !isLoading.value) {
    return inputValue.value;
  }
  return undefined;
});

const emptyItem = computed(() => {
  if (!props.emptyIndicator) return undefined;
  if (props.onSearch && !props.creatable && Object.keys(options.value).length === 0) {
    return props.emptyIndicator;
  }
  return props.emptyIndicator;
});

const emptyIndicatorIsComponent = computed(() => {
  const value = emptyItem.value;
  return typeof value === "object" || typeof value === "function";
});

const onInputValueChange = (value: string) => {
  inputValue.value = value;
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Delete" || event.key === "Backspace") {
    if (inputValue.value === "" && selected.value.length > 0) {
      const last = selected.value[selected.value.length - 1];
      if (!last.fixed) handleUnselect(last);
    }
  }
  if (event.key === "Escape") {
    getInputEl()?.blur();
  }
};

const getCommandApi = () => dropdownRef.value?.api?.value ?? null;
const highlightFirst = () => {
  const api = getCommandApi();
  const first = flatSelectables.value[0];
  if (api && first) api.setHighlightValue(first.value);
};
const highlightLast = () => {
  const api = getCommandApi();
  const last = flatSelectables.value[flatSelectables.value.length - 1];
  if (api && last) api.setHighlightValue(last.value);
};

const onInputKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Home") {
    event.preventDefault();
    if (!open.value) {
      inputValue.value = "";
      return;
    }
    highlightFirst();
    return;
  }
  if (event.key === "End") {
    event.preventDefault();
    if (open.value) {
      highlightLast();
      return;
    }
    openDropdown();
    return;
  }
  if (event.key === "PageDown" || event.key === "PageUp") {
    openDropdown();
    if (event.key === "PageDown") highlightLast();
    else highlightFirst();
    return;
  }
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    openDropdown();
  }
  onKeyDown(event);
};

const setSelected = (next: Option[]) => {
  selected.value = next;
  emit("update:modelValue", next);
  emit("change", next);
};

const openDropdown = () => {
  if (props.disabled) return;
  open.value = true;
  getInputEl()?.focus();
  if (props.triggerSearchOnFocus) {
    props.onSearch?.(debouncedSearchTerm.value);
  }
};
</script>

<template>
  <Command
    ref="dropdownRef"
    class="h-auto overflow-visible bg-transparent"
    @keydown="onKeyDown"
  >
    <div
      :class="
        cn(
          'border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive relative min-h-[38px] rounded-md border text-sm transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
          {
            'p-1': selected.length !== 0,
            'cursor-text': !props.disabled && selected.length !== 0,
          },
          !props.hideClearAllButton && 'pe-9',
          props.class
        )
      "
      @focusin="openDropdown"
      @focusout="() => { if (!onScrollbar) open = false }"
      @click="openDropdown"
    >
      <div class="flex flex-wrap gap-1">
        <div
          v-for="option in selected"
          :key="option.value"
          :class="
            cn(
              'animate-fadeIn bg-background text-secondary-foreground hover:bg-background relative inline-flex h-7 cursor-default items-center rounded-md border ps-2 pe-7 pl-2 text-xs font-medium transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-fixed:pe-2',
              props.badgeClass
            )
          "
          :data-fixed="option.fixed"
          :data-disabled="props.disabled || undefined"
        >
          {{ option.label }}
          <button
            class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute -inset-y-px -end-px flex size-7 items-center justify-center rounded-e-md border border-transparent p-0 outline-hidden transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
            type="button"
            @mousedown.prevent.stop
            @click="handleUnselect(option)"
          >
            <XIcon :size="14" aria-hidden="true" />
          </button>
        </div>
        <CommandInput
          ref="inputRef"
          :on-value-change="onInputValueChange"
          :list-id="listId"
          :expanded="open"
          :placeholder="props.hidePlaceholderWhenSelected && selected.length !== 0 ? '' : props.placeholder"
          :class="
            cn(
              'placeholder:text-muted-foreground/70 flex-1 bg-transparent outline-hidden disabled:cursor-not-allowed',
              {
                'w-full': props.hidePlaceholderWhenSelected,
                'px-3 py-2': selected.length === 0,
                'ml-1': selected.length !== 0,
              }
            )
          "
          @focus="openDropdown"
          @blur="() => { if (!onScrollbar) open = false }"
          @keydown="onInputKeyDown"
        />
        <button
          type="button"
          :class="
            cn(
              'text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute end-0 top-0 flex size-9 items-center justify-center rounded-md border border-transparent transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
              (props.hideClearAllButton ||
                props.disabled ||
                selected.length < 1 ||
                selected.filter((s) => s.fixed).length === selected.length) &&
                'hidden'
            )
          "
          aria-label="Clear all"
          @click="
            () => {
              const next = selected.filter((s) => s.fixed);
              setSelected(next);
            }
          "
        >
          <XIcon :size="16" aria-hidden="true" />
        </button>
      </div>
    </div>
    <div class="relative">
      <div
        :class="
          cn(
            'border-input absolute top-2 z-10 w-full overflow-hidden rounded-md border',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            !open && 'hidden'
          )
        "
        :data-state="open ? 'open' : 'closed'"
      >
        <CommandList
          v-if="open"
          :id="listId"
          class="bg-popover text-popover-foreground shadow-lg outline-hidden"
          @mouseleave="onScrollbar = false"
          @mouseenter="onScrollbar = true"
          @mouseup="() => getInputEl()?.focus()"
        >
          <template v-if="isLoading">
            <component :is="props.loadingIndicator" />
          </template>
          <template v-else>
            <CommandEmpty v-if="props.emptyIndicator">
              <component v-if="emptyIndicatorIsComponent" :is="emptyItem" />
              <span v-else>{{ emptyItem }}</span>
            </CommandEmpty>
            <CommandItem
              v-if="creatableItem"
              :value="creatableItem"
              class="cursor-pointer"
              @mousedown.prevent.stop
              @click="
                () => {
                  if (selected.length >= maxSelected) {
                    props.onMaxSelected?.(selected.length);
                    return;
                  }
                  inputValue = '';
                  const next = [...selected, { value: creatableItem, label: creatableItem }];
                  setSelected(next);
                }
              "
            >
              Create "{{ creatableItem }}"
            </CommandItem>
            <CommandItem v-if="!selectFirstItem" value="-" class="hidden" />
            <CommandGroup
              v-for="(dropdowns, key) in selectables"
              :key="key"
              :heading="key"
              class="h-full overflow-auto"
            >
              <CommandItem
                v-for="option in dropdowns"
                :key="option.value"
                :value="option.value"
                :disabled="option.disable"
                class="cursor-pointer"
                @mousedown.prevent.stop
                @click="
                  () => {
                    if (selected.length >= maxSelected) {
                      props.onMaxSelected?.(selected.length);
                      return;
                    }
                    inputValue = '';
                    const next = [...selected, option];
                    setSelected(next);
                  }
                "
              >
                {{ option.label }}
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </div>
    </div>
  </Command>
</template>
