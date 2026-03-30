<template>
  <div class="placeholder-page">
    <div class="placeholder-page__icon">
      <component :is="icon" :size="48" :stroke-width="1.2" />
    </div>
    <h2 class="placeholder-page__title">{{ title }}</h2>
    <p class="placeholder-page__desc">{{ description }}</p>
    <div class="placeholder-page__tags">
      <span v-for="tag in tags" :key="tag" class="placeholder-page__tag">{{ tag }}</span>
    </div>
    <div class="placeholder-page__hint">
      <Construction :size="16" :stroke-width="2" />
      <span>功能建设中，敬请期待</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Construction } from 'lucide-vue-next'

defineProps<{
  title: string
  description: string
  icon: any
  tags: string[]
}>()
</script>

<style scoped lang="scss">
.placeholder-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: var(--iflyv-spacing-8);

  &__icon {
    width: 88px;
    height: 88px;
    border-radius: var(--iflyv-radius-page);
    background: var(--iflyv-brand-bg);
    color: var(--iflyv-brand-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--iflyv-spacing-5);
  }

  &__title {
    font-size: 22px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    margin: 0 0 var(--iflyv-spacing-2);
  }

  &__desc {
    font-size: 14px;
    color: var(--iflyv-text-3);
    margin: 0 0 var(--iflyv-spacing-4);
    max-width: 400px;
    line-height: 1.6;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: var(--iflyv-spacing-5);
  }

  &__tag {
    padding: 4px 12px;
    border-radius: var(--iflyv-radius-full);
    background: var(--iflyv-bg-inset);
    font-size: 12px;
    color: var(--iflyv-text-3);
  }

  &__hint {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: var(--iflyv-radius-smallmodule);
    background: var(--iflyv-warning-bg);
    color: var(--iflyv-warning-primary);
    font-size: 13px;
    font-weight: 500;
  }
}
</style>
