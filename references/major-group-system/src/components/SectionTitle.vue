<template>
  <div class="section-title">
    <span class="section-title__bar" />
    <component :is="icon" :size="18" :stroke-width="2" class="section-title__icon" />
    <h2 class="section-title__text">{{ title }}</h2>
    <span v-if="count !== undefined" class="section-title__count">{{ count }} 个</span>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  icon: Component
  count?: number
}>()
</script>

<style scoped lang="scss">
.section-title {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);

  &__bar {
    width: 4px;
    height: 18px;
    border-radius: 2px;
    background: var(--iflyv-brand-primary);
    flex-shrink: 0;
  }

  &__icon {
    color: var(--iflyv-brand-primary);
    flex-shrink: 0;
  }

  &__text {
    font: var(--iflyv-font-title-primary);
    color: var(--iflyv-text-1);
    letter-spacing: -0.1px;
  }

  &__count {
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-3);
    background: var(--iflyv-bg-inset);
    padding: 1px var(--iflyv-spacing-2);
    border-radius: var(--iflyv-radius-full);
    font-weight: 500;
  }
}
</style>
