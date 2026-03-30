<template>
  <div v-if="majorInfo" class="major-detail">
    <!-- 页面标题区 -->
    <div class="page-header anim-item" style="--i:0">
      <div class="page-header__main">
        <h1 class="page-header__title">{{ majorInfo.name }}</h1>
        <div class="page-header__tags-inline">
          <span class="tag-inline" v-for="item in infoTags" :key="item.label">{{ item.label }}: {{ item.value }}</span>
        </div>
      </div>
      <div class="page-header__actions">
        <div class="page-header__tags">
          <el-tag v-for="tag in majorInfo.tags" :key="tag" size="small">
            {{ tag }}
          </el-tag>
        </div>
        <div class="page-header__links">
          <a
            v-if="majorInfo.trainingPlanUrl"
            :href="majorInfo.trainingPlanUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="header-link"
          >
            <ExternalLink :size="14" :stroke-width="2" />
            查看人才培养方案
          </a>
        </div>
      </div>
    </div>

    <!-- 基本信息卡片 -->
    <div class="anim-item" style="--i:1">
      <MajorBasicInfo :info="majorInfo" @action="handleAction" />
    </div>

    <!-- 岗位匹配清单 -->
    <div class="section anim-item" style="--i:2">
      <SectionTitle title="岗位匹配清单" :icon="Briefcase" :count="jobs.length" />
      <JobList :jobs="jobs" :major-id="majorId" @add-job="addJob" @remove-job="removeJob" />
    </div>

    <!-- 岗位能力图谱 -->
    <div class="section anim-item" style="--i:3">
      <div class="section-header">
        <SectionTitle title="专业岗位关联图谱" :icon="Radar" />
        <div class="section-header__actions">
          <button class="atlas-entry-btn" @click="chordVisible = true">
            <CircleDot :size="14" :stroke-width="2" />
            课-岗关联
          </button>
          <button class="atlas-entry-btn" @click="goToAtlas">
            <Network :size="14" :stroke-width="2" />
            岗位图谱
            <ChevronRight :size="14" :stroke-width="2" />
          </button>
        </div>
      </div>
      <CompetencyRadar :jobs="jobs" :major-name="majorInfo.name" />
    </div>

    <!-- 课-岗关联图谱弹窗 -->
    <el-dialog
      v-model="chordVisible"
      title=""
      width="960px"
      :show-close="false"
      align-center
      destroy-on-close
      append-to-body
    >
      <template #header>
        <div class="chord-dialog-header">
          <div class="chord-dialog-header__left">
            <CircleDot :size="20" :stroke-width="2" class="chord-dialog-header__icon" />
            <span class="chord-dialog-header__title">课-岗关联图谱</span>
          </div>
          <button class="close-btn" @click="chordVisible = false">
            <X :size="18" :stroke-width="2" />
          </button>
        </div>
      </template>
      <CourseJobChord :jobs="jobs" :courses="courses" />
    </el-dialog>

    <!-- 课程地图 -->
    <div class="section anim-item" style="--i:5">
      <SectionTitle title="专业课程地图" :icon="Map" />
      <CourseMap :courses="courses" @update-course="updateCourse" />
    </div>
  </div>

  <div v-else class="empty-state">
    <div class="empty-card">
      <div class="empty-card__icon-plate">
        <FileSearch :size="36" :stroke-width="1.5" />
      </div>
      <h2 class="empty-card__title">{{ majorName }} — 暂无专业数据</h2>
      <p class="empty-card__desc">
        请上传人才培养方案后重试，系统将自动解析并生成岗位匹配、课程地图等内容。
      </p>
    </div>
  </div>

  <!-- 专业岗位图谱全屏视图 -->
  <MajorAtlasView
    v-if="atlasVisible && majorInfo"
    v-model="atlasVisible"
    :major-name="majorInfo.name"
    :major-id="majorId"
    :jobs="jobs"
    :courses="courses"
    :major-info="{ code: majorInfo.code, college: majorInfo.college, location: majorInfo.location }"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Briefcase,
  Radar,
  Map,
  FileSearch,
  ExternalLink,
  Network,
  ChevronRight,
  CircleDot,
  X,
} from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import { majorInfoMap, jobMatchMap, courseMap, colleges } from '../data/majors'
import type { JobMatch, Course } from '../data/majors'
import MajorBasicInfo from './MajorBasicInfo.vue'
import JobList from './JobList.vue'
import CompetencyRadar from './CompetencyRadar.vue'
import CourseJobChord from './CourseJobChord.vue'
import CourseMap from './CourseMap.vue'
import SectionTitle from './SectionTitle.vue'
import MajorAtlasView from './MajorAtlasView.vue'

const props = defineProps<{ majorId: string }>()

const chordVisible = ref(false)
const atlasVisible = ref(false)
const majorInfo = computed(() => majorInfoMap[props.majorId])
const infoTags = computed(() => {
  const m = majorInfo.value
  if (!m) return []
  return [
    { label: '专业代码', value: m.code },
    { label: '培养层次', value: m.level },
    { label: '学制', value: m.duration },
    { label: '专业大类', value: m.group },
    { label: '招生规模', value: `${m.enrollment} 人/年` },
    { label: '开设年份', value: m.established },
  ]
})
const jobs = ref<JobMatch[]>([])
const courses = ref<Course[]>([])

// Initialize / reset jobs & courses when majorId changes
watch(() => props.majorId, (id) => {
  jobs.value = [...(jobMatchMap[id] || [])]
  courses.value = [...(courseMap[id] || [])]
}, { immediate: true })

function updateCourse(updated: Course) {
  const idx = courses.value.findIndex(c => c.id === updated.id)
  if (idx !== -1) {
    courses.value.splice(idx, 1, updated)
  }
}

function addJob(job: JobMatch) {
  if (jobs.value.some(j => j.id === job.id)) return
  jobs.value.push(job)
}

function removeJob(jobId: string) {
  jobs.value = jobs.value.filter(j => j.id !== jobId)
}

function goToAtlas() {
  atlasVisible.value = true
}

function handleAction(key: string) {
  const labels: Record<string, string> = {
    knowledge: '专业知识库',
    agent: '专业智能体',
    enterprise: '关联企业',
  }
  // TODO: replace with actual navigation
  ElMessage.info(`${labels[key] || key}链接待定`)
}

// ---- Empty state ----
const majorName = computed(() => {
  for (const col of colleges) {
    const found = col.majors.find(m => m.id === props.majorId)
    if (found) return found.name
  }
  return '未知专业'
})
</script>

<style scoped lang="scss">
.major-detail {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-6);
}

/* staggered entrance */
.anim-item {
  animation: fadeSlideUp 0.45s ease both;
  animation-delay: calc(var(--i, 0) * 0.07s);
}

/* ====== Page Header ====== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--iflyv-spacing-4);

  &__main {
    flex: 1;
  }

  &__title {
    font: var(--iflyv-font-title-emphasized);
    color: var(--iflyv-text-1);
    margin: 0 0 6px 0;
    letter-spacing: -0.2px;
  }

  &__tags-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 6px var(--iflyv-spacing-3);
    font-size: 13px;
    color: var(--iflyv-text-3);
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--iflyv-spacing-3);
    flex-shrink: 0;
  }

  &__tags {
    display: flex;
    gap: var(--iflyv-spacing-2);
    flex-wrap: wrap;
  }
}

.page-header__links {
  display: flex;
  gap: var(--iflyv-spacing-2);
  flex-wrap: wrap;
}

.header-link {
  display: inline-flex;
  align-items: center;
  gap: var(--iflyv-spacing-1);
  padding: 6px var(--iflyv-spacing-4);
  border: 1px solid var(--iflyv-border-primary);
  border-radius: var(--iflyv-radius-full);
  background: var(--iflyv-bg-panel);
  color: var(--iflyv-text-2);
  font: var(--iflyv-font-body-sub);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(54, 88, 255, 0.12);
  }

}

.tag-inline {
  color: var(--iflyv-text-3);
}

/* ====== Section ====== */
.section {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-3);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__actions {
    display: flex;
    gap: var(--iflyv-spacing-2);
  }
}

.atlas-entry-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--iflyv-spacing-1);
  padding: 6px var(--iflyv-spacing-4);
  border: 1px solid var(--iflyv-border-primary);
  border-radius: var(--iflyv-radius-full);
  background: var(--iflyv-bg-panel);
  color: var(--iflyv-text-2);
  font: var(--iflyv-font-body-sub);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(54, 88, 255, 0.12);
  }
}

/* ====== Chord dialog ====== */
.chord-dialog-header {
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

/* ====== Empty ====== */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  animation: fadeSlideUp 0.45s ease both;
}

.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 520px;
  width: 100%;
  gap: var(--iflyv-spacing-4);

  &__icon-plate {
    width: 72px;
    height: 72px;
    border-radius: var(--iflyv-radius-full);
    background: var(--iflyv-bg-inset);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--iflyv-text-4);
  }

  &__title {
    font: var(--iflyv-font-title-primary);
    color: var(--iflyv-text-1);
    margin: 0;
    text-align: center;
  }

  &__desc {
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-3);
    text-align: center;
    line-height: 1.6;
    margin: 0;
  }
}
</style>
