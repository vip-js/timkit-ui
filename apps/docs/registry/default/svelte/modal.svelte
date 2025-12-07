<script lang="ts">
  export let title = "Modal title"
  export let description = "这是一个静态模态框预览，可接入你的对话框逻辑。"
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
  <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-lg font-semibold text-zinc-900">{title}</h3>
      <button class="rounded-md p-1 text-zinc-500 hover:bg-zinc-100" aria-label="Close">
        ✕
      </button>
    </div>
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
</div>
