<script setup lang="ts">
import { ref } from "vue";
import { fieldDateBound, fieldMaxLength, fieldPattern, fieldRequired, fieldTimeBound, firstInvalidField, formErrorSummary, type FieldSpec } from "@timui/core";
import { useForm } from "./use-form";

type RichField = FieldSpec & {
  control?: "text" | "textarea" | "select" | "switch" | "number" | "check" | "radio" | "password" | "date" | "time";
  options?: Array<{ label?: string; value: string }>;
};

const props = withDefaults(
  defineProps<{
    fields: FieldSpec[];
    disabled?: boolean;
    submitLabel?: string;
  }>(),
  { submitLabel: "Submit", disabled: false }
);

const emit = defineEmits<{ submit: [values: Record<string, string>] }>();

const form = useForm(props.fields, {
  get disabled() {
    return props.disabled;
  },
});

const requiredOf = (field: FieldSpec) => fieldRequired(field.rules);

const emailOf = (field: RichField) => (field.rules ?? []).some((rule) => rule.kind === "email");

const patternOf = (field: FieldSpec) => fieldPattern(field.rules);

const limitOf = (field: RichField) => {
  const control = controlOf(field);
  return control === "textarea" || control === "text" || control === "password" ? fieldMaxLength(field.rules) : undefined;
};

const shownSecrets = ref<Record<string, boolean>>({});
const revealSecret = (name: string) => {
  if (props.disabled) return;
  shownSecrets.value = { ...shownSecrets.value, [name]: !shownSecrets.value[name] };
  document.getElementById(name)?.focus();
};

const boundOf = (field: RichField, edge: "min" | "max") =>
  controlOf(field) === "date"
    ? fieldDateBound(field.rules, edge)
    : controlOf(field) === "time"
      ? fieldTimeBound(field.rules, edge)
      : undefined;

const described = (field: RichField) => {
  const base = form.field(field.name)["aria-describedby"];
  const limit = limitOf(field);
  const ids = [base, limit !== undefined ? `${field.name}-count` : ""].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
};

const controlOf = (field: RichField) => {
  if (field.control) return field.control;
  if ((field.rules ?? []).some((rule) => rule.kind === "checked")) return "check" as const;
  return "text" as const;
};

const onSubmit = (event: Event) => {
  event.preventDefault();
  if (props.disabled) return;
  const result = form.submit();
  if (result.ok) {
    emit("submit", result.values);
    return;
  }
  const name = firstInvalidField(props.fields, result.snapshot.errors);
  const node = name ? document.getElementById(name) : null;
  if (node instanceof HTMLElement) node.focus();
};
</script>

<template>
  <form data-slot="form" @submit="onSubmit">
    <p v-if="formErrorSummary(props.fields, form.snapshot.value.errors, form.snapshot.value.submitCount)" role="alert">
      {{ formErrorSummary(props.fields, form.snapshot.value.errors, form.snapshot.value.submitCount) }}
    </p>
    <div v-for="spec in props.fields" :key="spec.name" data-slot="form-field">
      <label v-if="controlOf(spec) !== 'radio'" :for="spec.name">{{ spec.label }}</label>
      <span v-else :id="`${spec.name}-label`">{{ spec.label }}</span>
      <textarea
        v-if="controlOf(spec) === 'textarea'"
        :id="spec.name"
        :name="spec.name"
        :value="form.field(spec.name).value"
        :disabled="props.disabled"
        :required="requiredOf(spec)"
        :aria-required="requiredOf(spec) ? 'true' : undefined"
        :aria-invalid="form.field(spec.name)['aria-invalid']"
        :aria-describedby="described(spec)"
        :maxlength="limitOf(spec)"
        @input="form.assign(spec.name, $event)"
      />
      <select
        v-else-if="controlOf(spec) === 'select'"
        :id="spec.name"
        :name="spec.name"
        :value="form.field(spec.name).value"
        :disabled="props.disabled"
        :required="requiredOf(spec)"
        :aria-required="requiredOf(spec) ? 'true' : undefined"
        :aria-invalid="form.field(spec.name)['aria-invalid']"
        :aria-describedby="described(spec)"
        @change="form.assign(spec.name, $event)"
      >
        <option value="">Choose</option>
        <option v-for="option in (spec as RichField).options ?? []" :key="option.value" :value="option.value">
          {{ option.label || option.value }}
        </option>
      </select>
      <div
        v-else-if="controlOf(spec) === 'radio'"
        :id="spec.name"
        role="radiogroup"
        :aria-labelledby="`${spec.name}-label`"
        :aria-invalid="form.field(spec.name)['aria-invalid']"
        :aria-describedby="described(spec)"
        :aria-required="requiredOf(spec) ? 'true' : undefined"
        tabindex="-1"
      >
        <label v-for="option in (spec as RichField).options ?? []" :key="option.value">
          <input
            type="radio"
            :name="spec.name"
            :value="option.value"
            :checked="form.field(spec.name).value === option.value"
            :disabled="props.disabled"
            @change="form.assign(spec.name, $event)"
          />
          {{ option.label || option.value }}
        </label>
      </div>
      <input
        v-else-if="controlOf(spec) === 'switch' || controlOf(spec) === 'check'"
        :id="spec.name"
        :name="spec.name"
        type="checkbox"
        :role="controlOf(spec) === 'switch' ? 'switch' : undefined"
        :checked="form.field(spec.name).value === 'true'"
        :disabled="props.disabled"
        :required="requiredOf(spec)"
        :aria-required="requiredOf(spec) ? 'true' : undefined"
        :aria-invalid="form.field(spec.name)['aria-invalid']"
        :aria-describedby="described(spec)"
        @change="form.assign(spec.name, $event)"
      />
      <input
        v-else
        :id="spec.name"
        :name="spec.name"
        :type="
          controlOf(spec) === 'number'
            ? 'number'
            : controlOf(spec) === 'password'
              ? shownSecrets[spec.name]
                ? 'text'
                : 'password'
              : controlOf(spec) === 'date'
                ? 'date'
                : controlOf(spec) === 'time'
                  ? 'time'
              : emailOf(spec)
                ? 'email'
                : 'text'
        "
        :value="form.field(spec.name).value"
        :pattern="patternOf(spec)"
        :maxlength="limitOf(spec)"
        :min="boundOf(spec, 'min')"
        :max="boundOf(spec, 'max')"
        :disabled="props.disabled"
        :required="requiredOf(spec)"
        :aria-required="requiredOf(spec) ? 'true' : undefined"
        :aria-invalid="form.field(spec.name)['aria-invalid']"
        :aria-describedby="described(spec)"
        @input="form.assign(spec.name, $event)"
      />
      <button
        v-if="controlOf(spec) === 'password' && !props.disabled"
        type="button"
        :aria-label="shownSecrets[spec.name] ? 'Hide password' : 'Show password'"
        @click="revealSecret(spec.name)"
      >
        {{ shownSecrets[spec.name] ? 'Hide password' : 'Show password' }}
      </button>
      <p v-if="limitOf(spec) !== undefined" :id="`${spec.name}-count`" role="status">{{ `${form.field(spec.name).value.length} of ${limitOf(spec)}` }}</p>
      <p v-if="spec.hint?.trim()" :id="`${spec.name}-hint`">{{ spec.hint }}</p>
      <p v-if="form.snapshot.value.errors[spec.name]" :id="`${spec.name}-error`" role="alert">
        {{ form.snapshot.value.errors[spec.name] }}
      </p>
    </div>
    <button type="submit" data-slot="form-submit" :disabled="props.disabled">{{ props.submitLabel }}</button>
  </form>
</template>
