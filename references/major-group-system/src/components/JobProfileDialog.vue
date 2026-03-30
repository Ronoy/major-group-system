<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    width="900px"
    class="job-profile-dialog"
    align-center
    destroy-on-close
    append-to-body
  >
    <template #header>
      <div class="dialog-header">
        <div class="dialog-header__left">
          <UserRound :size="20" :stroke-width="2" class="dialog-header__icon" />
          <span class="dialog-header__title">{{ job.name }}</span>
        </div>
        <div class="dialog-header__right">
          <button class="graph-btn" @click="openAtlas">
            <Share2 :size="16" :stroke-width="2" />
            岗位能力图谱
          </button>
          <button class="close-btn" @click="visible = false">
            <X :size="18" :stroke-width="2" />
          </button>
        </div>
      </div>
    </template>

    <div class="dialog-body">
      <!-- 薪资 + 基本信息行 -->
      <div class="profile-summary">
        <div class="salary">
          <span class="salary__value">{{ job.salaryRange }}</span>
        </div>
        <div class="summary-fields">
          <div class="summary-field">
            <span class="summary-field__label">学历要求</span>
            <span class="summary-field__value">{{ job.profile.education }}</span>
          </div>
          <div class="summary-field">
            <span class="summary-field__label">经验要求</span>
            <span class="summary-field__value">{{ job.profile.experience }}</span>
          </div>
          <div class="summary-field">
            <span class="summary-field__label">成长路径</span>
            <span class="summary-field__value">{{ job.profile.careerPath }}</span>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div class="profile-tags">
        <el-tag type="primary" size="default">{{ job.category }}</el-tag>
        <el-tag class="tag--level" size="default">{{ job.profile.level }}</el-tag>
        <el-tag class="tag--demand" size="default">需求量 {{ job.profile.demandCount.toLocaleString() }}</el-tag>
      </div>

      <!-- 三维能力分析 -->
      <div class="competency-section">
        <div class="competency-section__title">
          <span class="competency-section__bar" />
          三维能力分析
        </div>

        <div class="competency-grid">
          <!-- 工具 -->
          <div class="competency-column">
            <div class="competency-column__header">
              <div class="competency-icon competency-icon--tools">
                <Wrench :size="18" :stroke-width="2" />
              </div>
              <div>
                <div class="competency-column__name">工具</div>
                <div class="competency-column__count">{{ job.profile.tools.length }}项</div>
              </div>
            </div>
            <div class="competency-list">
              <div v-for="item in job.profile.tools" :key="item" class="competency-item">
                <Wrench :size="14" :stroke-width="2" class="competency-item__icon competency-item__icon--tools" />
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- 技能 -->
          <div class="competency-column">
            <div class="competency-column__header">
              <div class="competency-icon competency-icon--skills">
                <Zap :size="18" :stroke-width="2" />
              </div>
              <div>
                <div class="competency-column__name">技能</div>
                <div class="competency-column__count">{{ job.profile.skills.length }}项</div>
              </div>
            </div>
            <div class="competency-list">
              <div v-for="item in job.profile.skills" :key="item" class="competency-item">
                <Zap :size="14" :stroke-width="2" class="competency-item__icon competency-item__icon--skills" />
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- 素养 -->
          <div class="competency-column">
            <div class="competency-column__header">
              <div class="competency-icon competency-icon--qualities">
                <Lightbulb :size="18" :stroke-width="2" />
              </div>
              <div>
                <div class="competency-column__name">素养</div>
                <div class="competency-column__count">{{ job.profile.qualities.length }}项</div>
              </div>
            </div>
            <div class="competency-list">
              <div v-for="item in job.profile.qualities" :key="item" class="competency-item">
                <Lightbulb :size="14" :stroke-width="2" class="competency-item__icon competency-item__icon--qualities" />
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 雷达图 -->
      <div v-if="showRadar" class="radar-section">
        <v-chart :option="radarOption" autoresize class="radar-chart" />
      </div>
    </div>

  </el-dialog>

  <!-- 岗位能力图谱（独立于 el-dialog 外，避免 destroy-on-close 销毁） -->
  <JobAtlasDialog v-if="atlasVisible" v-model="atlasVisible" :job="job" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UserRound, Share2, X, Wrench, Zap, Lightbulb } from 'lucide-vue-next'
import { use } from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { JobMatch } from '../data/majors'
import JobAtlasDialog from './JobAtlasDialog.vue'

use([RadarChart, TooltipComponent, CanvasRenderer])

const props = defineProps<{ job: JobMatch }>()
const visible = defineModel<boolean>({ required: true })
const showRadar = ref(true)
const atlasVisible = ref(false)

function openAtlas() {
  visible.value = false
  atlasVisible.value = true
}

const radarIndicators = computed(() => {
  const allItems = [
    ...props.job.profile.tools.slice(0, 3),
    ...props.job.profile.skills.slice(0, 3),
    ...props.job.profile.qualities.slice(0, 2),
  ]
  return allItems.map((name) => ({ name, max: 100 }))
})

const radarOption = computed(() => ({
  tooltip: { trigger: 'item' },
  radar: {
    indicator: radarIndicators.value,
    shape: 'polygon',
    radius: '60%',
    axisName: { color: '#525252', fontSize: 11 },
    splitArea: {
      areaStyle: { color: ['#F0F5FF', '#F5F5F5', '#F0F5FF', '#F5F5F5', '#F0F5FF'] },
    },
    splitLine: { lineStyle: { color: 'rgba(21,21,21,0.06)' } },
    axisLine: { lineStyle: { color: 'rgba(21,21,21,0.1)' } },
  },
  series: [{
    type: 'radar',
    data: [{
      value: radarIndicators.value.map(() => 55 + Math.round(Math.random() * 40)),
      name: '能力评估',
      areaStyle: { color: 'rgba(54,88,255,0.15)' },
      lineStyle: { color: '#3658FF', width: 2 },
      itemStyle: { color: '#3658FF' },
    }],
  }],
}))
</script>

<style scoped lang="scss">
/* ====== Dialog Header ====== */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &__left {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
  }

  &__icon {
    color: var(--iflyv-brand-primary);
  }

  &__title {
    font: var(--iflyv-font-title-primary);
    color: var(--iflyv-text-1);
  }

  &__right {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
  }
}

.graph-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--iflyv-spacing-1);
  padding: var(--iflyv-spacing-1) var(--iflyv-spacing-4);
  border: 1px solid var(--iflyv-border-primary);
  border-radius: var(--iflyv-radius-full);
  background: var(--iflyv-bg-panel);
  color: var(--iflyv-text-2);
  font: var(--iflyv-font-body-sub);
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
  }
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--iflyv-text-3);
  cursor: pointer;
  border-radius: var(--iflyv-radius-smallmodule);
  transition: all 0.15s;

  &:hover {
    background: var(--iflyv-bg-inset);
    color: var(--iflyv-text-1);
  }
}

/* ====== Body ====== */
.dialog-body {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-5);
}

/* ====== Summary ====== */
.profile-summary {
  display: flex;
  align-items: flex-end;
  gap: var(--iflyv-spacing-7);
}

.salary {
  flex-shrink: 0;

  &__value {
    font: var(--iflyv-font-title-emphasized);
    background: linear-gradient(135deg, #FC7819, #F53B3B);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.summary-fields {
  display: flex;
  gap: var(--iflyv-spacing-7);
  flex: 1;
}

.summary-field {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &__label {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
  }

  &__value {
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-1);
    font-weight: 500;
  }
}

/* ====== Tags ====== */
.profile-tags {
  display: flex;
  gap: var(--iflyv-spacing-2);
}

:deep(.tag--level) {
  --el-tag-bg-color: var(--iflyv-success-bg) !important;
  --el-tag-border-color: var(--iflyv-success-primary) !important;
  --el-tag-text-color: var(--iflyv-success-primary) !important;
}

:deep(.tag--demand) {
  --el-tag-bg-color: var(--iflyv-warning-bg) !important;
  --el-tag-border-color: var(--iflyv-warning-primary) !important;
  --el-tag-text-color: var(--iflyv-warning-primary) !important;
}

/* ====== Competency Section ====== */
.competency-section {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-4);

  &__title {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
    font: var(--iflyv-font-title-primary);
    color: var(--iflyv-text-1);
  }

  &__bar {
    width: 4px;
    height: 18px;
    border-radius: var(--iflyv-radius-min);
    background: var(--iflyv-brand-primary);
    flex-shrink: 0;
  }
}

.competency-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--iflyv-spacing-3);
}

.competency-column {
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-3);
    padding: var(--iflyv-spacing-4);
  }

  &__name {
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-1);
    font-weight: 600;
  }

  &__count {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
  }
}

.competency-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--iflyv-radius-smallmodule);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &--tools {
    background: var(--iflyv-icon-bg-brand);
    color: var(--iflyv-brand-primary);
  }

  &--skills {
    background: var(--iflyv-icon-bg-warning);
    color: var(--iflyv-warning-primary);
  }

  &--qualities {
    background: var(--iflyv-icon-bg-success);
    color: var(--iflyv-success-primary);
  }
}

.competency-list {
  display: flex;
  flex-direction: column;
}

.competency-item {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);
  padding: var(--iflyv-spacing-2) var(--iflyv-spacing-4);
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-text-2);
  border-top: 1px solid var(--iflyv-border-light);
  transition: background 0.15s;

  &:hover {
    background: var(--iflyv-bg-panel);
  }

  &__icon {
    flex-shrink: 0;

    &--tools {
      color: var(--iflyv-brand-primary);
    }
    &--skills {
      color: var(--iflyv-warning-primary);
    }
    &--qualities {
      color: var(--iflyv-success-primary);
    }
  }
}

/* ====== Radar ====== */
.radar-section {
  display: flex;
  justify-content: center;
}

.radar-chart {
  width: 100%;
  height: 300px;
}
</style>
