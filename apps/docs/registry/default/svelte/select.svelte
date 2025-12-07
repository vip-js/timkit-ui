<script lang="ts">
  export let options: { label: string; value: string }[] = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
  ]
  export let value: string = options[0]?.value ?? ""
</script>

<select
  bind:value
  class="border-input block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/10"
>
  {#each options as option}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>

