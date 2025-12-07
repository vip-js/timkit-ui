<script lang="ts">
  export let rows = [
    { name: "Alice", role: "Designer", status: "Active" },
    { name: "Bob", role: "Engineer", status: "Pending" },
  ]
</script>

<div class="overflow-hidden rounded-xl border border-zinc-200 shadow-sm">
  <table class="min-w-full divide-y divide-zinc-200">
    <thead class="bg-zinc-50 text-left text-sm font-semibold text-zinc-600">
      <tr>
        <th class="px-4 py-3">Name</th>
        <th class="px-4 py-3">Role</th>
        <th class="px-4 py-3 text-right">Status</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-zinc-200 bg-white text-sm text-zinc-800">
      {#each rows as row}
        <tr>
          <td class="px-4 py-3 font-medium">{row.name}</td>
          <td class="px-4 py-3">{row.role}</td>
          <td class="px-4 py-3 text-right">
            <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
              {row.status}
            </span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

