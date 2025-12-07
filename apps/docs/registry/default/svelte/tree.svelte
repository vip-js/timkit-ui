<script lang="ts">
  export let tree = [
    {
      label: "Projects",
      children: [
        { label: "Design", children: [{ label: "landing.sketch" }] },
        { label: "roadmap.md" },
      ],
    },
  ]

  const renderNodes = (nodes) =>
    nodes?.map((node) => (
      <li>
        <div class="flex items-center gap-2">
          <span>{node.children ? "📁" : "📄"}</span>
          <span>{node.label}</span>
        </div>
        {node.children && (
          <ul class="ms-6 mt-2 space-y-2">{renderNodes(node.children)}</ul>
        )}
      </li>
    ))
</script>

<ul class="rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-800">
  {@html renderNodes(tree).map(node => node.outerHTML).join("")}
</ul>
