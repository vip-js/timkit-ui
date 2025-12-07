<script lang="ts">
  export let title = "Dialog title"
  export let description = "This is a static dialog preview. Wire it up with your dialog lib."
</script>

<div class="max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
  <h3 class="text-lg font-semibold text-zinc-900">{title}</h3>
  <p class="mt-2 text-sm text-zinc-600">{description}</p>
  <div class="mt-4 flex justify-end gap-2">
    <button class="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
      Cancel
    </button>
    <button class="rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-black/85">
      Confirm
    </button>
  </div>
</div>

