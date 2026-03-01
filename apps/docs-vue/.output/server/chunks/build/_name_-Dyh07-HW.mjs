import { defineComponent, computed, ref, mergeProps, withCtx, unref, createVNode, watch, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrRenderVNode } from 'vue/server-renderer';
import { u as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ComponentPreview",
  __ssrInlineRender: true,
  props: {
    code: { default: "" }
  },
  setup(__props) {
    const activeTab = ref("preview");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "component-preview-wrapper" }, _attrs))}><div class="preview-header"><div class="preview-title">Component Preview</div><div class="tab-group"><button class="${ssrRenderClass(["tab-button", activeTab.value === "preview" ? "active" : ""])}"> Preview </button><button class="${ssrRenderClass(["tab-button", activeTab.value === "code" ? "active" : ""])}"> Code </button></div></div><div class="preview-frame">`);
      if (activeTab.value === "preview") {
        _push(`<div class="preview-surface"><div class="preview-grid" aria-hidden="true"></div><div class="preview-content">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div></div>`);
      } else {
        _push(`<div class="code-surface"><pre class="text-sm overflow-x-auto"><code>${ssrInterpolate(__props.code)}</code></pre></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ComponentPreview.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CodeBlock",
  __ssrInlineRender: true,
  props: {
    code: {},
    language: { default: "typescript" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "code-surface" }, _attrs))}><pre class="text-sm overflow-x-auto"><code class="${ssrRenderClass(`language-${__props.language}`)}">${ssrInterpolate(__props.code)}</code></pre></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CodeBlock.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const modules = /* @__PURE__ */ Object.assign({ "./default/components/button/button-01.vue": () => import('./button-01-BmRJNf8x.mjs') });
const vueComponentManifest = Object.fromEntries(
  Object.entries(modules).map(([path, loader]) => {
    const name = path.replace("./default/components/", "").replace(/\.vue$/, "").split("/").pop();
    return [name, loader];
  })
);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "VueComponentLoader",
  __ssrInlineRender: true,
  props: {
    componentName: {}
  },
  setup(__props) {
    const props = __props;
    const componentInstance = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const availableComponents = computed(() => Object.keys(vueComponentManifest));
    const errorMessage = computed(
      () => error.value ? error.value.message : `No preview available for ${props.componentName}`
    );
    let loadId = 0;
    const loadComponent = async (name) => {
      var _a;
      const currentId = ++loadId;
      loading.value = true;
      componentInstance.value = null;
      error.value = null;
      try {
        const loader = vueComponentManifest[name];
        if (!loader) {
          throw new Error(`No preview available for "${name}"`);
        }
        const module = await loader();
        if (currentId !== loadId) return;
        componentInstance.value = module.default;
      } catch (e) {
        if (currentId !== loadId) return;
        error.value = e;
        if (((_a = e.message) == null ? void 0 : _a.includes("No preview available")) === false) {
          console.error("Failed to load component:", e);
        }
      } finally {
        if (currentId === loadId) {
          loading.value = false;
        }
      }
    };
    watch(
      () => props.componentName,
      (name) => {
        if (!name) return;
        void loadComponent(name);
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (loading.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-muted-foreground" }, _attrs))}>Loading component...</div>`);
      } else if (componentInstance.value) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(componentInstance.value), _attrs, null), _parent);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-destructive" }, _attrs))}>${ssrInterpolate(errorMessage.value)} `);
        if (availableComponents.value.length) {
          _push(`<div class="text-muted-foreground mt-2 text-xs"> Available: ${ssrInterpolate(availableComponents.value.join(", "))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VueComponentLoader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[name]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const toPascalCase = (value) => value.split("-").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
    const componentName = computed(() => {
      const name = route.params.name;
      return name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    });
    const hasExample = computed(() => {
      const name = route.params.name;
      return Boolean(vueComponentManifest[`${name}-01`]);
    });
    const exampleCode = computed(() => {
      const name = route.params.name;
      const PascalName = toPascalCase(name);
      return `<template>
  <${PascalName}>Button</${PascalName}>
</template>

<script setup lang="ts">
import { ${PascalName} } from '@timui/vue'
<\/script>`;
    });
    const installCode = ref(`pnpm add @timui/vue`);
    const usageCode = computed(() => {
      const name = route.params.name;
      const CapitalizedName = toPascalCase(name);
      return `<template>
  <${CapitalizedName} variant="primary">
    Click me
  </${CapitalizedName}>
</template>

<script setup lang="ts">
import { ${CapitalizedName} } from '@timui/vue'
<\/script>`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ComponentPreview = _sfc_main$3;
      const _component_CodeBlock = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "component-page docs-container page-block" }, _attrs))}><div class="component-hero"><div class="hero-chip">Component</div><h1 class="hero-title">${ssrInterpolate(componentName.value)}</h1><p class="hero-subtitle">Usage, variants, and composable patterns.</p></div><div class="component-grid"><section class="section wide"><div class="section-header"><h2 class="section-title">Example</h2><p class="section-subtitle">Interact with the live preview.</p></div>`);
      if (hasExample.value) {
        _push(ssrRenderComponent(_component_ComponentPreview, { code: exampleCode.value }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_sfc_main$1, {
                "component-name": `${unref(route).params.name}-01`
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_sfc_main$1, {
                  "component-name": `${unref(route).params.name}-01`
                }, null, 8, ["component-name"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<div class="code-surface"><div class="text-muted-foreground text-sm"> Example preview not available yet. </div></div>`);
      }
      _push(`</section><section class="section"><div class="section-header"><h2 class="section-title">Install</h2><p class="section-subtitle">Get the package into your project.</p></div>`);
      _push(ssrRenderComponent(_component_CodeBlock, {
        code: installCode.value,
        language: "bash"
      }, null, _parent));
      _push(`</section><section class="section"><div class="section-header"><h2 class="section-title">Usage</h2><p class="section-subtitle">Minimal example to get started.</p></div>`);
      _push(ssrRenderComponent(_component_CodeBlock, {
        code: usageCode.value,
        language: "vue"
      }, null, _parent));
      _push(`</section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/docs/components/[name].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_name_-Dyh07-HW.mjs.map
