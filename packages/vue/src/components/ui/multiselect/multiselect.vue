<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch, type Component, type VNodeChild } from "vue";
import {
  cn,
  multiselectClearButtonVariants,
  multiselectCommandVariants,
  multiselectContainerVariants,
  multiselectDropdownVariants,
  multiselectGroupVariants,
  multiselectInputVariants,
  multiselectListVariants,
  multiselectTagRemoveVariants,
  multiselectTagVariants,
} from "@timui/core";
import { XIcon } from "lucide-vue-next";
import Command from "../command/command.vue";
import CommandEmpty from "../command/command-empty.vue";
import CommandGroup from "../command/command-group.vue";
import CommandItem from "../command/command-item.vue";
import CommandList from "../command/command-list.vue";
import CommandInput from "../command/command-input.vue";
import type { AssertNoExtraKeys, MultiselectOption, MultiselectVueProps, ComboboxApi } from "@timui/core";

export type Option = MultiselectOption;

interface GroupOption {
  [key: string]: Option[];
}

type MultiselectProps = MultiselectVueProps & {
  class?: string;
  badgeClass?: string;
  loadingIndicator?: Component | VNodeChild;
  emptyIndicator?: Component | VNodeChild;
};
type _MultiselectPropsGuard = AssertNoExtraKeys<
  MultiselectProps,
  MultiselectVueProps & {
    class?: string;
    badgeClass?: string;
    loadingIndicator?: Component | VNodeChild;
    emptyIndicator?: Component | VNodeChild;
  }
>;

const props = defineProps<MultiselectProps>();

const emit = defineEmits(["update:modelValue", "change"]);

const inputRef = ref<{ inputEl?: HTMLInputElement | null } | null>(null);
const listId = `multiselect-list-${useId()}`;
type CommandExpose = { rootEl?: HTMLElement | null; api?: ComboboxApi };
const dropdownRef = ref<CommandExpose | null>(null);
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
  if (picked.length === 0) return groupOption;
  const pickedValues = new Set(picked.map((item) => item.value));
  const next: GroupOption = {};
  for (const [key, value] of Object.entries(groupOption)) {
    next[key] = value.filter((val) => !pickedValues.has(val.value));
  }
  return next;
};

const isOptionsExist = (groupOption: GroupOption, targetOption: Option[]) => {
  if (targetOption.length === 0) return false;
  const targetValues = new Set(targetOption.map((item) => item.value));
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some((option) => targetValues.has(option.value))) {
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
  }
);

watch(
  () => props.defaultOptions,
  (val) => {
    if (!props.options && !props.onSearch) {
      options.value = transToGroupOption(val ?? [], props.groupBy);
    }
  },
  { immediate: true }
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
const selectedValueSet = computed(() => new Set(selected.value.map((item) => item.value)));
const fixedSelected = computed(() => selected.value.filter((item) => item.fixed));
const isClearAllHidden = computed(
  () =>
    !!props.hideClearAllButton ||
    !!props.disabled ||
    selected.value.length < 1 ||
    fixedSelected.value.length === selected.value.length
);

const setSelected = (next: Option[]) => {
  selected.value = next;
  emit("update:modelValue", next);
  emit("change", next);
};

const handleUnselect = (option: Option) => {
  setSelected(selected.value.filter((s) => s.value !== option.value));
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

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);
    return;
  }

  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("touchend", handleClickOutside);
});

onBeforeUnmount(() => {
  if (debounceTimer) window.clearTimeout(debounceTimer);
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("touchend", handleClickOutside);
});

const creatableItem = computed(() => {
  if (!props.creatable) return undefined;
  if (
    isOptionsExist(options.value, [{ value: inputValue.value, label: inputValue.value }]) ||
    selectedValueSet.value.has(inputValue.value)
  ) {
    return undefined;
  }
  if (!props.onSearch && inputValue.value.length > 0) return inputValue.value;
  if (props.onSearch && debouncedSearchTerm.value.length > 0 && !isLoading.value) {
    return inputValue.value;
  }
  return undefined;
});

const emptyIndicatorIsComponent = computed(() => {
  const value = props.emptyIndicator;
  return typeof value === "object" || typeof value === "function";
});

const createOption = (value: string): Option => ({ value, label: value });
const addCreatableItem = () => {
  const value = creatableItem.value;
  if (!value) return;
  if (selected.value.length >= maxSelected.value) {
    props.onMaxSelected?.(selected.value.length);
    return;
  }
  inputValue.value = "";
  const next = [...selected.value, createOption(value)];
  setSelected(next);
};

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

const getCommandApi = () => dropdownRef.value?.api ?? null;
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
    :class="multiselectCommandVariants()"
    @keydown="onKeyDown"
  >
    <div
      :class="
        cn(
          multiselectContainerVariants(),
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
              multiselectTagVariants(),
              props.badgeClass
            )
          "
          :data-fixed="option.fixed"
          :data-disabled="props.disabled || undefined"
        >
          {{ option.label }}
          <button
            :class="multiselectTagRemoveVariants()"
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
              multiselectInputVariants(),
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
              multiselectClearButtonVariants(),
              isClearAllHidden && 'hidden'
            )
          "
          aria-label="Clear all"
          @click="
            () => {
              setSelected(fixedSelected);
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
            multiselectDropdownVariants(),
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            !open && 'hidden'
          )
        "
        :data-state="open ? 'open' : 'closed'"
      >
        <CommandList
          v-if="open"
          :id="listId"
          :class="multiselectListVariants()"
          @mouseleave="onScrollbar = false"
          @mouseenter="onScrollbar = true"
          @mouseup="() => getInputEl()?.focus()"
        >
          <template v-if="isLoading">
            <component :is="props.loadingIndicator" />
          </template>
          <template v-else>
            <CommandEmpty v-if="props.emptyIndicator">
              <component v-if="emptyIndicatorIsComponent" :is="props.emptyIndicator" />
              <span v-else>{{ props.emptyIndicator }}</span>
            </CommandEmpty>
            <CommandItem
              v-if="creatableItem"
              :value="creatableItem"
              class="cursor-pointer"
              @mousedown.prevent.stop
              @click="addCreatableItem"
            >
              Create "{{ creatableItem }}"
            </CommandItem>
            <CommandItem v-if="!selectFirstItem" value="-" class="hidden" />
            <CommandGroup
              v-for="(dropdowns, key) in selectables"
              :key="key"
              :heading="key"
              :class="multiselectGroupVariants()"
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
