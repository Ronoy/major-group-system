<template>
  <div class="ai-insights">
    <div class="ai-insights__header">
      <span class="ai-badge">
        <Sparkles :size="14" :stroke-width="2" />
        AI
      </span>
      <span class="ai-insights__title">岗位画像洞察</span>
    </div>
    <div class="ai-insights__grid">
      <div
        v-for="(item, idx) in insights"
        :key="idx"
        class="ai-insights__item"
      >
        <span class="ai-insights__bullet" />
        <span class="ai-insights__text" v-html="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
import { aiInsights } from '../data/majors'

const insights = aiInsights
</script>

<style scoped lang="scss">
.ai-insights {
  padding: var(--iflyv-spacing-5) var(--iflyv-spacing-6);
  background: linear-gradient(135deg, var(--iflyv-brand-bg) 0%, #F0F5FF 50%, #F5F0FF 100%);
  border-radius: var(--iflyv-radius-largemodule);
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-4);
}

.ai-insights__header {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: linear-gradient(135deg, var(--iflyv-brand-primary), #7c3aed);
  border-radius: var(--iflyv-radius-full);
  color: var(--iflyv-gray-0);
  font: var(--iflyv-font-label-primary);
  font-weight: 600;
}

.ai-insights__title {
  font: var(--iflyv-font-title-primary);
  color: var(--iflyv-brand-primary);
}

.ai-insights__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--iflyv-spacing-3) var(--iflyv-spacing-7);
}

.ai-insights__item {
  display: flex;
  align-items: flex-start;
  gap: var(--iflyv-spacing-2);
}

.ai-insights__bullet {
  width: 6px;
  height: 6px;
  border-radius: var(--iflyv-radius-full);
  background: var(--iflyv-text-1);
  flex-shrink: 0;
  margin-top: 7px;
}

.ai-insights__text {
  font: var(--iflyv-font-body-sub-multiline);
  color: var(--iflyv-text-2);

  :deep(strong) {
    color: var(--iflyv-brand-primary);
    font-weight: 600;
  }
}
</style>
