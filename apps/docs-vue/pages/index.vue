<template>
  <div class="docs-container page-block">
    <section class="hero">
      <div class="hero-badge">Design system for teams that ship fast</div>
      <h1 class="hero-title">TimUI for Vue</h1>
      <p class="hero-subtitle">
        A precise, composable component library powered by Zag.js.
        Built for clarity, speed, and linear‑grade polish.
      </p>
      <div class="hero-actions">
        <NuxtLink to="/docs/components/button" class="btn-primary">Browse Components</NuxtLink>
        <NuxtLink to="/docs/components/alert" class="btn-secondary">Start With Alert</NuxtLink>
      </div>
      <div class="hero-stats">
        <div class="stat-card">
          <div class="stat-value">70+</div>
          <div class="stat-label">Components</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">Zag.js</div>
          <div class="stat-label">State Machines</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">Vue 3</div>
          <div class="stat-label">First‑class</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Component Index</h2>
        <p class="section-subtitle">Jump into any category and start composing.</p>
      </div>

      <div class="nav-grid">
        <div v-for="group in navigation" :key="group.title" class="nav-group">
          <div class="nav-group-title">{{ group.title }}</div>
          <div class="nav-list">
            <NuxtLink
              v-for="item in group.items"
              :key="item.href"
              :to="item.href"
              class="nav-card"
            >
              <div class="nav-card-title">{{ item.title }}</div>
              <div class="nav-card-desc">View usage and examples</div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { navigation } from '@/config'
</script>
