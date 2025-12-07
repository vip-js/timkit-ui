<script lang="ts">
  export let value: string = ""
  export let placeholder: string = "Placeholder"
  export let type: string = "text"
  export let invalid: boolean = false

  const base =
    "border-input placeholder:text-muted-foreground block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
  $: classes = base + (invalid ? " border-red-500 ring-red-100" : "")
</script>

<input
  bind:value
  {placeholder}
  {type}
  class={classes}
  aria-invalid={invalid}
/>

