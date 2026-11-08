<script lang="ts">
import { defineComponent, getCurrentInstance, h, ref, watch, type PropType, type VNodeChild } from "vue";
import {
  checkboxTreeChecked,
  initialCheckboxTreeChecked,
  toggleCheckboxTree,
  type AssertNoExtraKeys,
  type CheckboxTreeNode,
  type CheckboxTreeProps as CoreCheckboxTreeProps,
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
    checkedKeys: {
      type: Array as PropType<string[] | null | undefined>,
      default: undefined,
    },
  },
  emits: ["checkedKeysChange"],
  setup(props, { emit }) {
    const instance = getCurrentInstance();
    const readKeys = () => {
      const fromProps = props.checkedKeys;
      const raw = instance?.vnode.props ?? {};
      const passed =
        Object.prototype.hasOwnProperty.call(raw, "checkedKeys") ||
        Object.prototype.hasOwnProperty.call(raw, "checked-keys");
      const explicit = (raw.checkedKeys ?? raw["checked-keys"]) as string[] | null | undefined;
      if (passed && explicit == null) return [];
      return fromProps === undefined ? undefined : fromProps;
    };
    const checkedNodes = ref(
      readKeys() === undefined ? initialCheckboxTreeChecked(props.tree) : new Set(readKeys())
    );
    watch(readKeys, (keys) => {
      if (keys === undefined) return;
      checkedNodes.value = new Set(keys);
    });

    const isChecked = (node: CheckboxTreeNode): boolean | "indeterminate" =>
      checkboxTreeChecked(node, checkedNodes.value);

    const handleCheck = (node: CheckboxTreeNode) => {
      if (node.disabled === true) return;
      const keys = readKeys();
      const source = keys === undefined ? checkedNodes.value : new Set(keys);
      const next = toggleCheckboxTree(node, source);
      if (keys === undefined) checkedNodes.value = next;
      emit("checkedKeysChange", [...next]);
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

    return () => {
      const count = checkedNodes.value.size;
      const checkStatus = count > 1 ? `${count} checked` : count === 1 ? "1 checked" : "";
      return h("div", { "data-slot": "checkbox-tree" }, [
        checkStatus ? h("p", { role: "status" }, checkStatus) : null,
        renderTreeNode(props.tree),
      ]);
    };
  },
});
</script>
