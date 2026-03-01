<script lang="ts">
import { defineComponent, ref, type PropType, type VNodeChild } from "vue";
import type {
  AssertNoExtraKeys,
  CheckboxTreeNode,
  CheckboxTreeProps as CoreCheckboxTreeProps,
} from "@timui/core";

type CheckboxTreeProps = CoreCheckboxTreeProps<VNodeChild>;
type _CheckboxTreePropsGuard = AssertNoExtraKeys<
  CheckboxTreeProps,
  CoreCheckboxTreeProps<VNodeChild>
>;

export default defineComponent({
  name: "CheckboxTree",
  props: {
    tree: {
      type: Object as () => CheckboxTreeNode,
      required: true,
    },
    renderNode: {
      type: Function as PropType<
        (props: {
          node: CheckboxTreeNode;
          isChecked: boolean | "indeterminate";
          onCheckedChange: () => void;
          children: VNodeChild[] | undefined;
        }) => VNodeChild
      >,
      required: true,
    },
  },
  setup(props) {
    const checkedNodes = ref(new Set<string>());

    const initializeCheckedNodes = (node: CheckboxTreeNode) => {
      if (node.defaultChecked) checkedNodes.value.add(node.id);
      node.children?.forEach(initializeCheckedNodes);
    };

    initializeCheckedNodes(props.tree);

    const isChecked = (node: CheckboxTreeNode): boolean | "indeterminate" => {
      if (!node.children?.length) return checkedNodes.value.has(node.id);

      const childrenChecked = node.children.map((child) => isChecked(child));
      if (childrenChecked.every((status) => status === true)) return true;
      if (childrenChecked.some((status) => status === true || status === "indeterminate")) {
        return "indeterminate";
      }
      return false;
    };

    const handleCheck = (node: CheckboxTreeNode) => {
      const next = new Set(checkedNodes.value);

      const toggleNode = (current: CheckboxTreeNode, check: boolean) => {
        if (check) next.add(current.id);
        else next.delete(current.id);
        current.children?.forEach((child) => toggleNode(child, check));
      };

      const currentStatus = isChecked(node);
      const nextCheck = currentStatus !== true;
      toggleNode(node, nextCheck);

      checkedNodes.value = next;
    };

    const renderTreeNode = (node: CheckboxTreeNode): VNodeChild => {
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
