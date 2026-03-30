<template>
  <div class="search-hero">
    <!-- 标题 -->
    <div class="search-hero__header">
      <ScanSearch :size="24" :stroke-width="2" />
      <h2 class="search-hero__title">岗位匹配引擎</h2>
    </div>
    <p class="search-hero__subtitle">
      输入岗位名称、技能关键词或产业链环节，快速获取岗位画像与能力分析
    </p>

    <!-- 搜索栏 -->
    <div class="search-hero__bar">
      <div class="search-input">
        <Search :size="18" :stroke-width="2" class="search-input__icon" />
        <input
          type="text"
          class="search-input__field"
          placeholder="搜索岗位名称、技能、工具..."
          v-model="searchText"
        />
      </div>
      <button class="search-btn">
        <Search :size="16" :stroke-width="2" />
        搜索
      </button>
    </div>

    <!-- 筛选行 -->
    <div class="search-hero__filters">
      <div class="filter-item">
        <span class="filter-item__label">产业链环节：</span>
        <el-select v-model="chainLevel" size="small" style="width: 130px" class="dark-select">
          <el-option label="全部环节" value="全部环节" />
          <el-option label="研发设计" value="研发设计" />
          <el-option label="生产制造" value="生产制造" />
          <el-option label="系统集成" value="系统集成" />
        </el-select>
      </div>
      <div class="filter-item">
        <span class="filter-item__label">岗位层级：</span>
        <el-select v-model="jobLevel" size="small" style="width: 100px" class="dark-select">
          <el-option label="全部" value="全部" />
          <el-option label="初级" value="初级" />
          <el-option label="中级" value="中级" />
          <el-option label="高级" value="高级" />
        </el-select>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="search-hero__categories">
      <span class="category-label">选择产业：</span>
      <button
        v-for="cat in categories"
        :key="cat"
        class="category-pill"
        :class="{ 'category-pill--active': activeCategory === cat }"
        @click="activeCategory = cat"
      >
        <component :is="getCategoryIcon(cat)" :size="14" :stroke-width="2" />
        {{ cat }}
      </button>
    </div>

    <!-- 热门岗位 -->
    <div class="search-hero__hot">
      <span class="hot-label">
        <Flame :size="14" :stroke-width="2" class="hot-label__icon" />
        热门岗位搜索
      </span>
      <div class="hot-tags">
        <a
          v-for="job in hotJobs"
          :key="job.name"
          class="hot-tag"
          @click="searchText = job.name"
        >
          <Search :size="14" :stroke-width="2" />
          <span class="hot-tag__name">{{ job.name }}</span>
          <span class="hot-tag__salary">{{ job.salaryRange }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ScanSearch,
  Search,
  Flame,
  Globe,
  Cpu,
  Cloud,
  Code,
  Shield,
  Wifi,
  MonitorSmartphone,
} from 'lucide-vue-next'
import type { JobMatch } from '../data/majors'
import { jobCategories } from '../data/majors'

const props = defineProps<{ jobs: JobMatch[] }>()

const searchText = ref('')
const chainLevel = ref('全部环节')
const jobLevel = ref('全部')
const activeCategory = ref('全部岗位')

const categories = jobCategories

const hotJobs = computed(() =>
  props.jobs
    .sort((a, b) => b.matchRate - a.matchRate)
    .slice(0, 8)
)

function getCategoryIcon(cat: string) {
  const map: Record<string, any> = {
    '全部岗位': Globe,
    '技术开发类': Cpu,
    '硬件设计类': MonitorSmartphone,
    '系统集成类': Cloud,
    '质量检测类': Shield,
    '运维服务类': Wifi,
    '人工智能类': Code,
  }
  return map[cat] || Globe
}
</script>

<style scoped lang="scss">
.search-hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  border-radius: var(--iflyv-radius-largemodule);
  padding: var(--iflyv-spacing-7) var(--iflyv-spacing-7) var(--iflyv-spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-4);
}

.search-hero__header {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-3);
  color: var(--iflyv-gray-0);
}

.search-hero__title {
  font: var(--iflyv-font-title-superior);
  color: var(--iflyv-gray-0);
}

.search-hero__subtitle {
  font: var(--iflyv-font-body-sub);
  color: rgba(255, 255, 255, 0.55);
  margin-top: calc(var(--iflyv-spacing-1) * -1);
}

/* ====== 搜索栏 ====== */
.search-hero__bar {
  display: flex;
  gap: var(--iflyv-spacing-3);
  margin-top: var(--iflyv-spacing-2);
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-3);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--iflyv-radius-smallmodule);
  padding: 0 var(--iflyv-spacing-4);
  height: 44px;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.3);
  }

  &__icon {
    color: rgba(255, 255, 255, 0.4);
    flex-shrink: 0;
  }

  &__field {
    flex: 1;
    border: none;
    background: none;
    outline: none;
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-gray-0);
    height: 100%;

    &::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }
  }
}

.search-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);
  padding: 0 var(--iflyv-spacing-6);
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--iflyv-radius-smallmodule);
  background: rgba(255, 255, 255, 0.06);
  color: var(--iflyv-gray-0);
  font: var(--iflyv-font-body-sub);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

/* ====== 筛选 ====== */
.search-hero__filters {
  display: flex;
  gap: var(--iflyv-spacing-6);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);

  &__label {
    font: var(--iflyv-font-body-sub);
    color: rgba(255, 255, 255, 0.55);
    white-space: nowrap;
  }
}

:deep(.dark-select) {
  .el-input__wrapper {
    background: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.12) !important;
    box-shadow: none !important;
  }
  .el-input__inner {
    color: rgba(255, 255, 255, 0.85) !important;
  }
  .el-input__suffix {
    color: rgba(255, 255, 255, 0.4) !important;
  }
}

/* ====== 分类标签 ====== */
.search-hero__categories {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);
  flex-wrap: wrap;
}

.category-label {
  font: var(--iflyv-font-body-sub);
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
  margin-right: var(--iflyv-spacing-1);
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--iflyv-spacing-1);
  padding: 6px var(--iflyv-spacing-4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--iflyv-radius-full);
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font: var(--iflyv-font-body-sub);
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    color: var(--iflyv-gray-0);
  }

  &--active {
    background: var(--iflyv-brand-primary);
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-gray-0);

    &:hover {
      background: var(--iflyv-brand-hover);
      border-color: var(--iflyv-brand-hover);
    }
  }
}

/* ====== 热门岗位 ====== */
.search-hero__hot {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-3);
  margin-top: var(--iflyv-spacing-1);
}

.hot-label {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-1);
  font: var(--iflyv-font-body-sub);
  color: rgba(255, 255, 255, 0.55);

  &__icon {
    color: var(--iflyv-warning-primary);
  }
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--iflyv-spacing-2);
}

.hot-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);
  padding: var(--iflyv-spacing-2) var(--iflyv-spacing-4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--iflyv-radius-smallmodule);
  color: rgba(255, 255, 255, 0.7);
  font: var(--iflyv-font-body-sub);
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;

  &:hover {
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.05);
  }

  &__name {
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
  }

  &__salary {
    color: rgba(255, 255, 255, 0.4);
    font: var(--iflyv-font-label-primary);
  }
}
</style>
