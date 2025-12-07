<script lang="ts">
  export let label: string = "Button"
  export let variant: "default" | "ghost" = "default"

  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  $: classes =
    base +
    (variant === "ghost"
      ? " text-zinc-900 hover:bg-zinc-100"
      : " bg-black text-white shadow-sm hover:bg-black/85 focus-visible:ring-black")
</script>

<button class={classes}>
  <slot>{label}</slot>
</button>
