<script lang="ts">
import { defineComponent, ref } from "vue";

interface TreeNode {
  id: string;
  label: string;
  defaultChecked?: boolean;
  children?: TreeNode[];
}

export default defineComponent({
  name: "CheckboxTree",
  props: {
    tree: {
      type: Object as () => TreeNode,
      required: true,
    },
    renderNode: {
      type: Function as unknown as () => (props: {
        node: TreeNode;
        isChecked: boolean | "indeterminate";
        onCheckedChange: () => void;
        children: any;
      }) => any,
      required: true,
    },
  },
  setup(props) {
    const checkedNodes = ref(new Set<string>());

    const initializeCheckedNodes = (node: TreeNode) => {
      if (node.defaultChecked) checkedNodes.value.add(node.id);
      node.children?.forEach(initializeCheckedNodes);
    };

    initializeCheckedNodes(props.tree);

    const isChecked = (node: TreeNode): boolean | "indeterminate" => {
      if (!node.children?.length) return checkedNodes.value.has(node.id);

      const childrenChecked = node.children.map((child) => isChecked(child));
      if (childrenChecked.every((status) => status === true)) return true;
      if (childrenChecked.some((status) => status === true || status === "indeterminate")) {
        return "indeterminate";
      }
      return false;
    };

    const handleCheck = (node: TreeNode) => {
      const next = new Set(checkedNodes.value);

      const toggleNode = (current: TreeNode, check: boolean) => {
        if (check) next.add(current.id);
        else next.delete(current.id);
        current.children?.forEach((child) => toggleNode(child, check));
      };

      const currentStatus = isChecked(node);
      const nextCheck = currentStatus !== true;
      toggleNode(node, nextCheck);

      checkedNodes.value = next;
    };

    const renderTreeNode = (node: TreeNode): any => {
      const children = node.children?.map(renderTreeNode);
      return props.renderNode({
        node,
        isChecked: isChecked(node),
        onCheckedChange: () => handleCheck(node),
        children,
      });
    };

    return () => renderTreeNode(props.tree);
  },
});
</script>
