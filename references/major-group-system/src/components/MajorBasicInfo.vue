<template>
  <div class="basic-info">
    <!-- 专业简介 -->
    <div class="info-description">
      <p class="info-description__text">{{ info.description }}</p>
    </div>

    <!-- 数据入口卡片 -->
    <div class="action-grid">
      <div
        v-for="item in actionItems"
        :key="item.key"
        class="action-card"
        @click="emit('action', item.key)"
      >
        <div class="action-card__icon-wrap" :class="`action-card__icon-wrap--${item.color}`">
          <component :is="item.icon" :size="20" :stroke-width="1.8" />
        </div>
        <div class="action-card__body">
          <div class="action-card__label">{{ item.label }}</div>
          <div class="action-card__value">{{ item.value }}</div>
        </div>
        <div class="action-card__link">
          查看详情
          <ChevronRight :size="14" :stroke-width="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BookOpen,
  Bot,
  Building,
  ChevronRight,
} from 'lucide-vue-next'
import type { MajorInfo } from '../data/majors'

defineProps<{ info: MajorInfo }>()
const emit = defineEmits<{ action: [key: string] }>()

const actionItems = [
  { key: 'knowledge', label: '专业知识库', value: '128 篇', icon: BookOpen, color: 'brand' },
  { key: 'agent', label: '专业智能体', value: '3 个', icon: Bot, color: 'success' },
  { key: 'enterprise', label: '关联企业', value: '26 家', icon: Building, color: 'warning' },
]
</script>

<style scoped lang="scss">
.basic-info {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-4);
}

.info-description {
  padding: var(--iflyv-spacing-4) var(--iflyv-spacing-5);
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  border-left: 3px solid var(--iflyv-brand-primary);

  &__text {
    font: var(--iflyv-font-body-sub-multiline);
    color: var(--iflyv-text-2);
    line-height: 1.7;
    margin: 0;
  }
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--iflyv-spacing-3);
}

.action-card {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-3);
  padding: var(--iflyv-spacing-4);
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--iflyv-border-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

    .action-card__link {
      color: var(--iflyv-brand-primary);
    }

    .action-card__icon-wrap {
      transform: scale(1.08);
    }
  }

  &__icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: var(--iflyv-radius-smallmodule);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s ease;

    &--brand {
      background: var(--iflyv-icon-bg-brand);
      color: var(--iflyv-brand-primary);
    }
    &--success {
      background: var(--iflyv-icon-bg-success);
      color: var(--iflyv-success-primary);
    }
    &--warning {
      background: var(--iflyv-icon-bg-warning);
      color: var(--iflyv-warning-primary);
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__label {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
    margin-bottom: 2px;
  }

  &__value {
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-1);
    font-weight: 600;
    font-size: 16px;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-4);
    flex-shrink: 0;
    transition: color 0.15s;
  }
}
</style>
