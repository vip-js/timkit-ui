<template>
  <div class="docs-shell">
    <header class="docs-header">
      <div class="docs-container header-inner">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true"></div>
          <div class="brand-text">
            <div class="brand-title">TimUI</div>
            <div class="brand-subtitle">Vue Documentation</div>
          </div>
        </div>
        <nav class="header-actions">
          <NuxtLink to="/" class="header-link">Overview</NuxtLink>
          <NuxtLink to="/docs/components/button" class="header-link">Components</NuxtLink>
          <a class="header-link" href="https://github.com" rel="noreferrer" target="_blank">GitHub</a>
        </nav>
      </div>
    </header>

    <main class="docs-main">
      <NuxtPage />
    </main>
  </div>
</template>
