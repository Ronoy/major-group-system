<template>
  <div class="job-list-wrap">
    <!-- 分类筛选栏 -->
    <div class="category-bar">
      <button
        class="category-chip"
        :class="{ 'category-chip--active': !activeCategory }"
        @click="activeCategory = ''"
      >
        全部
        <span class="category-chip__count">{{ props.jobs.length }}</span>
      </button>
      <button
        v-for="cat in categories"
        :key="cat.name"
        class="category-chip"
        :class="{ 'category-chip--active': activeCategory === cat.name }"
        @click="activeCategory = activeCategory === cat.name ? '' : cat.name"
      >
        <span class="category-chip__dot" :style="{ background: categoryColor(cat.name) }" />
        {{ cat.name }}
        <span class="category-chip__count">{{ cat.count }}</span>
      </button>
      <button class="add-job-btn" @click="openPicker">
        <Plus :size="14" :stroke-width="2" />
        添加岗位
      </button>
    </div>

    <!-- 统一岗位网格 -->
    <div class="job-grid">
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        class="job-card"
        @click="openProfile(job)"
      >
        <button
          class="job-card__delete"
          title="移除岗位"
          @click.stop="emit('removeJob', job.id)"
        >
          <X :size="14" :stroke-width="2" />
        </button>
        <div class="job-card__top">
          <div class="job-card__info">
            <span class="job-card__cat-dot" :style="{ background: categoryColor(job.category) }" />
            <span class="job-card__name">{{ job.name }}</span>
          </div>
          <div class="job-card__match">
            <span class="job-card__match-value">{{ job.matchRate }}</span>
            <span class="job-card__match-unit">%</span>
            <CircleAlert :size="13" :stroke-width="2" class="job-card__match-info" @click.stop="ruleDialogVisible = true" />
          </div>
        </div>
        <div class="job-card__bar">
          <div class="job-card__bar-fill" :style="{ width: `${job.matchRate}%` }" :class="barColorClass(job.matchRate)" />
        </div>
        <div class="job-card__bottom">
          <span class="job-card__salary">{{ job.salaryRange }}</span>
          <div class="job-card__tags">
            <el-tag size="small" :type="demandType(job.demand)">需求{{ job.demand }}</el-tag>
            <span v-for="s in job.skills.slice(0, 2)" :key="s" class="skill-tag">{{ s }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 推荐岗位 -->
    <div v-if="aiJobs.length" class="ai-section">
      <div class="ai-section__header">
        <div class="ai-section__badge">
          <Sparkles :size="14" :stroke-width="2" />
          AI
        </div>
        <span class="ai-section__title">AI 推荐岗位</span>
        <span class="ai-section__sub">基于专业课程体系与产业趋势智能匹配</span>
      </div>
      <div class="ai-grid">
        <div
          v-for="aj in aiJobs"
          :key="aj.id"
          class="ai-card"
          :class="{ 'ai-card--added': isJobAdded(aj.id) }"
        >
          <div class="ai-card__top">
            <div class="ai-card__info">
              <span class="ai-card__name">{{ aj.name }}</span>
              <span class="ai-card__cat">{{ aj.category }}</span>
            </div>
            <div class="ai-card__match">
              <span class="ai-card__match-value">{{ aj.matchRate }}</span>
              <span class="ai-card__match-unit">%</span>
            </div>
          </div>
          <div class="ai-card__bar">
            <div class="ai-card__bar-fill" :style="{ width: `${aj.matchRate}%` }" />
          </div>
          <div class="ai-card__reason">
            <Sparkles :size="12" :stroke-width="2" class="ai-card__reason-icon" />
            {{ aj.reason }}
          </div>
          <div class="ai-card__bottom">
            <span class="ai-card__salary">{{ aj.salaryRange }}</span>
            <button
              v-if="!isJobAdded(aj.id)"
              class="ai-card__add-btn"
              @click="addAiJob(aj)"
            >
              <Plus :size="14" :stroke-width="2" />
              添加到专业
            </button>
            <span v-else class="ai-card__added-label">
              <Check :size="14" :stroke-width="2" />
              已添加
            </span>
          </div>
          <!-- 建议新增课程（岗位已添加后显示） -->
          <div v-if="isJobAdded(aj.id) && aj.suggestedCourses?.length" class="ai-card__courses-suggest">
            <div class="courses-suggest__header">
              <BookOpen :size="12" :stroke-width="2" />
              建议新增课程
            </div>
            <div
              v-for="sc in aj.suggestedCourses"
              :key="sc.name"
              class="courses-suggest__item"
            >
              <div class="courses-suggest__info">
                <span class="courses-suggest__name">{{ sc.name }}</span>
                <span class="courses-suggest__reason">{{ sc.reason }}</span>
              </div>
              <button
                v-if="!addedSuggestedCourses.has(sc.name)"
                class="courses-suggest__add"
                @click.stop="addSuggestedCourse(sc.name, sc.reason)"
              >
                <Plus :size="12" :stroke-width="2" />
                新建
              </button>
              <span v-else class="courses-suggest__done">
                <Check :size="12" :stroke-width="2" />
                已添加
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 岗位详情弹窗 -->
  <JobProfileDialog
    v-if="selectedJob"
    v-model="dialogVisible"
    :job="selectedJob"
  />

  <!-- 岗位选择弹窗 -->
  <el-dialog
    v-model="pickerVisible"
    title=""
    width="680px"
    append-to-body
    destroy-on-close
    :show-close="false"
    align-center
  >
    <template #header>
      <div class="picker-header">
        <div class="picker-header__left">
          <Briefcase :size="20" :stroke-width="2" class="picker-header__icon" />
          <span class="picker-header__title">选择岗位</span>
          <span class="picker-header__selected" v-if="pickerSelected.size">
            已选 {{ pickerSelected.size }} 个
          </span>
        </div>
        <button class="close-btn" @click="pickerVisible = false">
          <X :size="18" :stroke-width="2" />
        </button>
      </div>
    </template>

    <!-- 搜索 + 分类筛选 -->
    <div class="picker-filters">
      <el-input
        v-model="pickerSearch"
        placeholder="搜索岗位名称..."
        clearable
        :prefix-icon="Search"
        class="picker-search"
      />
      <div class="picker-cats">
        <button
          class="picker-cat-chip"
          :class="{ 'picker-cat-chip--active': !pickerCategory }"
          @click="pickerCategory = ''"
        >全部</button>
        <button
          v-for="cat in allCategories"
          :key="cat"
          class="picker-cat-chip"
          :class="{ 'picker-cat-chip--active': pickerCategory === cat }"
          @click="pickerCategory = pickerCategory === cat ? '' : cat"
        >
          <span class="picker-cat-chip__dot" :style="{ background: categoryColor(cat) }" />
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- 岗位列表 -->
    <div class="picker-list">
      <div
        v-for="job in availableJobs"
        :key="job.id"
        class="picker-item"
        :class="{
          'picker-item--selected': pickerSelected.has(job.id),
          'picker-item--disabled': existingIds.has(job.id),
        }"
        @click="togglePickerItem(job)"
      >
        <div class="picker-item__check">
          <div class="picker-item__checkbox" :class="{ 'is-checked': pickerSelected.has(job.id) || existingIds.has(job.id) }">
            <Check v-if="pickerSelected.has(job.id) || existingIds.has(job.id)" :size="12" :stroke-width="3" />
          </div>
        </div>
        <div class="picker-item__body">
          <div class="picker-item__top">
            <span class="picker-item__dot" :style="{ background: categoryColor(job.category) }" />
            <span class="picker-item__name">{{ job.name }}</span>
            <span class="picker-item__cat">{{ job.category }}</span>
            <span v-if="existingIds.has(job.id)" class="picker-item__badge">已添加</span>
          </div>
          <div class="picker-item__meta">
            <span>匹配度 {{ job.matchRate }}%</span>
            <span>{{ job.salaryRange }}</span>
            <span>需求{{ job.demand }}</span>
          </div>
        </div>
      </div>
      <div v-if="!availableJobs.length" class="picker-empty">
        暂无匹配的岗位
      </div>
    </div>

    <template #footer>
      <div class="picker-footer">
        <span class="picker-footer__hint">
          从岗位库中选择要添加到专业的岗位
        </span>
        <div class="picker-footer__actions">
          <el-button @click="pickerVisible = false">取消</el-button>
          <el-button type="primary" :disabled="!pickerSelected.size" @click="confirmPicker">
            确认添加（{{ pickerSelected.size }}）
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>

  <!-- 计算规则弹窗 -->
  <el-dialog
    v-model="ruleDialogVisible"
    title="岗位匹配率计算规则"
    width="560px"
    append-to-body
    destroy-on-close
    align-center
  >
    <div class="rule-dialog">
      <div class="rule-section">
        <h4 class="rule-section__title">计算公式</h4>
        <div class="rule-formula">
          岗位匹配率 = （已覆盖技能数 ÷ 岗位要求总技能数）× 100%
        </div>
      </div>
      <div class="rule-section">
        <h4 class="rule-section__title">评估维度</h4>
        <div class="rule-items">
          <div class="rule-item">
            <span class="rule-item__dot" style="background: #22C55E" />
            <span class="rule-item__label">专业技能覆盖</span>
            <span class="rule-item__desc">课程教学内容与岗位技能要求的匹配程度，权重 40%</span>
          </div>
          <div class="rule-item">
            <span class="rule-item__dot" style="background: #3658FF" />
            <span class="rule-item__label">知识体系匹配</span>
            <span class="rule-item__desc">专业知识结构与岗位知识需求的吻合度，权重 30%</span>
          </div>
          <div class="rule-item">
            <span class="rule-item__dot" style="background: #F5A623" />
            <span class="rule-item__label">素质能力对标</span>
            <span class="rule-item__desc">通用能力与职业素养培养的匹配情况，权重 20%</span>
          </div>
          <div class="rule-item">
            <span class="rule-item__dot" style="background: #8B5CF6" />
            <span class="rule-item__label">实践经验关联</span>
            <span class="rule-item__desc">实训实习环节与岗位实操要求的关联度，权重 10%</span>
          </div>
        </div>
      </div>
      <div class="rule-section">
        <h4 class="rule-section__title">等级标准</h4>
        <div class="rule-levels">
          <div class="rule-level">
            <span class="rule-level__bar" style="background: #22C55E; width: 100%" />
            <span class="rule-level__text">≥ 80%　高度匹配</span>
          </div>
          <div class="rule-level">
            <span class="rule-level__bar" style="background: #F5A623; width: 70%" />
            <span class="rule-level__text">60%-79%　中度匹配</span>
          </div>
          <div class="rule-level">
            <span class="rule-level__bar" style="background: #EF4444; width: 40%" />
            <span class="rule-level__text">＜ 60%　待提升</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Plus, X, Check, Briefcase, Search, BookOpen, CircleAlert } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import type { JobMatch, AiRecommendedJob, Course } from '../data/majors'
import { aiRecommendedJobMap, jobCatalog, jobMatchMap, pendingCourses } from '../data/majors'
import JobProfileDialog from './JobProfileDialog.vue'

const props = defineProps<{
  jobs: JobMatch[]
  majorId?: string
}>()

const emit = defineEmits<{
  addJob: [job: JobMatch]
  removeJob: [jobId: string]
}>()

const ruleDialogVisible = ref(false)
const dialogVisible = ref(false)
const selectedJob = ref<JobMatch | null>(null)
const activeCategory = ref('')
const pickerVisible = ref(false)
const pickerSearch = ref('')
const pickerCategory = ref('')
const pickerSelected = ref(new Set<string>())
const addedSuggestedCourses = ref(new Set<string>())

const allCategories = ['技术开发', '硬件设计', '质量检测', '系统集成', '产品管理', '运维服务', '人工智能']

// Build full job catalog: merge jobMatchMap entries + extra catalog jobs, deduplicated
const fullCatalog = computed(() => {
  const map = new Map<string, JobMatch>()
  // Add all jobs from all majors
  for (const jobs of Object.values(jobMatchMap)) {
    for (const job of jobs) {
      map.set(job.id, job)
    }
  }
  // Add extra catalog jobs
  for (const job of jobCatalog) {
    if (!map.has(job.id)) map.set(job.id, job)
  }
  return Array.from(map.values())
})

// IDs already in the current major's job list
const existingIds = computed(() => new Set(props.jobs.map(j => j.id)))

// Filtered catalog for picker
const availableJobs = computed(() => {
  let list = fullCatalog.value
  if (pickerCategory.value) {
    list = list.filter(j => j.category === pickerCategory.value)
  }
  if (pickerSearch.value.trim()) {
    const q = pickerSearch.value.trim().toLowerCase()
    list = list.filter(j => j.name.toLowerCase().includes(q) || j.category.toLowerCase().includes(q))
  }
  return list.sort((a, b) => {
    // Already-added items go to bottom
    const aAdded = existingIds.value.has(a.id) ? 1 : 0
    const bAdded = existingIds.value.has(b.id) ? 1 : 0
    if (aAdded !== bAdded) return aAdded - bAdded
    return b.matchRate - a.matchRate
  })
})

function openPicker() {
  pickerSearch.value = ''
  pickerCategory.value = ''
  pickerSelected.value = new Set()
  pickerVisible.value = true
}

function togglePickerItem(job: JobMatch) {
  if (existingIds.value.has(job.id)) return // already added, skip
  const s = new Set(pickerSelected.value)
  if (s.has(job.id)) {
    s.delete(job.id)
  } else {
    s.add(job.id)
  }
  pickerSelected.value = s
}

function confirmPicker() {
  for (const id of pickerSelected.value) {
    const job = fullCatalog.value.find(j => j.id === id)
    if (job) emit('addJob', job)
  }
  pickerVisible.value = false
}

function openProfile(job: JobMatch) {
  selectedJob.value = job
  dialogVisible.value = true
}

const sortedJobs = computed(() =>
  [...props.jobs].sort((a, b) => b.matchRate - a.matchRate)
)

const categories = computed(() => {
  const map = new Map<string, number>()
  for (const job of props.jobs) {
    map.set(job.category, (map.get(job.category) || 0) + 1)
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const filteredJobs = computed(() => {
  if (!activeCategory.value) return sortedJobs.value
  return sortedJobs.value.filter(j => j.category === activeCategory.value)
})

const aiJobs = computed(() => {
  if (!props.majorId) return []
  return aiRecommendedJobMap[props.majorId] || []
})

function isJobAdded(aiJobId: string) {
  return props.jobs.some(j => j.id === aiJobId)
}

function addAiJob(aj: AiRecommendedJob) {
  const job: JobMatch = {
    id: aj.id,
    name: aj.name,
    category: aj.category,
    matchRate: aj.matchRate,
    salaryRange: aj.salaryRange,
    demand: '中',
    skills: aj.relatedCourses.slice(0, 3),
    profile: {
      education: '大专及以上',
      experience: '1-3年',
      level: '初级',
      demandCount: 0,
      careerPath: '',
      tasks: [],
      tools: [],
      skills: [],
      qualities: [],
    },
  }
  emit('addJob', job)
}

function addSuggestedCourse(courseName: string, reason: string) {
  addedSuggestedCourses.value = new Set([...addedSuggestedCourses.value, courseName])
  // Create a pending course and add to shared state
  const pendingId = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const pendingCourse: Course = {
    id: pendingId,
    name: courseName,
    category: '专业拓展课',
    credits: 0,
    hours: 0,
    semester: '待定',
    description: reason,
  }
  pendingCourses.value = [...pendingCourses.value, pendingCourse]
  ElMessage.success(`建议课程「${courseName}」已添加到课程地图，可前往 AI 创建课程内容`)
}

const categoryColors: Record<string, string> = {
  '技术开发': '#3658FF',
  '硬件设计': '#A855F7',
  '质量检测': '#F5A623',
  '系统集成': '#22C55E',
  '产品管理': '#EC4899',
  '运维服务': '#36CFC9',
  '人工智能': '#EF4444',
}

function categoryColor(cat: string) {
  return categoryColors[cat] || '#8B8FA3'
}

function demandType(demand: string) {
  if (demand === '高') return 'danger'
  if (demand === '中') return '' as any
  return 'info' as any
}

function barColorClass(rate: number) {
  if (rate >= 85) return 'bar--high'
  if (rate >= 70) return 'bar--mid'
  return 'bar--low'
}
</script>

<style scoped lang="scss">
.job-list-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-4);
}

/* ====== Category filter bar ====== */
.category-bar {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);
  flex-wrap: wrap;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-full);
  background: var(--iflyv-bg-panel);
  color: var(--iflyv-text-3);
  font: var(--iflyv-font-label-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
  }

  &--active {
    background: var(--iflyv-brand-bg);
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
    font-weight: 500;
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__count {
    font-size: 10px;
    color: var(--iflyv-text-4);
    background: var(--iflyv-bg-inset);
    padding: 0 5px;
    border-radius: var(--iflyv-radius-full);
    line-height: 16px;
  }
}

.add-job-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px dashed var(--iflyv-border-dark);
  border-radius: var(--iflyv-radius-full);
  background: transparent;
  color: var(--iflyv-text-3);
  font: var(--iflyv-font-label-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
  }
}

/* ====== Unified grid ====== */
.job-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--iflyv-spacing-3);
}

/* ====== Job card ====== */
.job-card {
  position: relative;
  padding: var(--iflyv-spacing-3) var(--iflyv-spacing-4);
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.15s;
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
    background: var(--iflyv-bg-panel);

    .job-card__delete {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &__delete {
    position: absolute;
    top: 6px;
    right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: none;
    border-radius: var(--iflyv-radius-full);
    background: var(--iflyv-bg-inset);
    color: var(--iflyv-text-4);
    cursor: pointer;
    opacity: 0;
    transition: all 0.15s ease;
    z-index: 1;

    &:hover {
      background: var(--iflyv-danger-bg, #FEF2F2);
      color: var(--iflyv-danger-primary, #EF4444);
    }
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
    min-width: 0;
  }

  &__cat-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__name {
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-1);
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__match {
    display: flex;
    align-items: baseline;
    gap: 2px;
    flex-shrink: 0;
  }

  &__match-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--iflyv-brand-primary);
  }

  &__match-unit {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
  }

  &__bar {
    height: 4px;
    background: var(--iflyv-border-primary);
    border-radius: var(--iflyv-radius-full);
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    border-radius: var(--iflyv-radius-full);
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);

    &.bar--high { background: var(--iflyv-success-primary); }
    &.bar--mid { background: var(--iflyv-brand-primary); }
    &.bar--low { background: var(--iflyv-warning-primary); }
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--iflyv-spacing-2);
  }

  &__salary {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-warning-primary);
    font-weight: 500;
    flex-shrink: 0;
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
  }
}

.skill-tag {
  display: inline-block;
  padding: 1px 6px;
  background: var(--iflyv-bg-panel);
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-full);
  font-size: 10px;
  color: var(--iflyv-text-3);
  white-space: nowrap;
}

/* ====== AI Section ====== */
.ai-section {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-3);
  padding: var(--iflyv-spacing-4);
  background: linear-gradient(135deg, var(--iflyv-brand-bg) 0%, #F0F5FF 50%, #F5F0FF 100%);
  border-radius: var(--iflyv-radius-smallmodule);
  border: 1px solid rgba(54, 88, 255, 0.08);

  &__header {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: linear-gradient(135deg, var(--iflyv-brand-primary), #7c3aed);
    border-radius: var(--iflyv-radius-full);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
  }

  &__title {
    font: var(--iflyv-font-body-sub);
    font-weight: 600;
    color: var(--iflyv-text-1);
  }

  &__sub {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-4);
    margin-left: auto;
  }
}

.ai-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--iflyv-spacing-3);
}

/* ====== AI Card ====== */
.ai-card {
  padding: var(--iflyv-spacing-3) var(--iflyv-spacing-4);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  border-radius: var(--iflyv-radius-smallmodule);
  border: 1px solid rgba(54, 88, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(54, 88, 255, 0.1);
  }

  &--added {
    border-color: var(--iflyv-success-primary);
    background: rgba(255, 255, 255, 0.95);
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
    min-width: 0;
  }

  &__name {
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-1);
    font-weight: 600;
  }

  &__cat {
    font-size: 10px;
    color: var(--iflyv-text-4);
    padding: 1px 6px;
    background: var(--iflyv-bg-inset);
    border-radius: var(--iflyv-radius-full);
  }

  &__match {
    display: flex;
    align-items: baseline;
    gap: 2px;
    flex-shrink: 0;
  }

  &__match-value {
    font-size: 16px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--iflyv-brand-primary), #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__match-unit {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
  }

  &__bar {
    height: 3px;
    background: rgba(54, 88, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--iflyv-brand-primary), #7c3aed);
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &__reason {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-2);
    line-height: 1.5;
    padding: var(--iflyv-spacing-2);
    background: rgba(54, 88, 255, 0.04);
    border-radius: var(--iflyv-radius-min);
  }

  &__reason-icon {
    color: var(--iflyv-brand-primary);
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--iflyv-spacing-2);
  }

  &__salary {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-warning-primary);
    font-weight: 500;
    flex-shrink: 0;
  }

  &__add-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border: 1px solid var(--iflyv-brand-primary);
    border-radius: var(--iflyv-radius-full);
    background: var(--iflyv-brand-bg);
    color: var(--iflyv-brand-primary);
    font: var(--iflyv-font-label-primary);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background: var(--iflyv-brand-primary);
      color: #fff;
      box-shadow: 0 2px 8px rgba(54, 88, 255, 0.25);
    }
  }

  &__added-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: var(--iflyv-radius-full);
    background: rgba(34, 197, 94, 0.08);
    color: var(--iflyv-success-primary);
    font: var(--iflyv-font-label-primary);
    font-weight: 500;
    white-space: nowrap;
  }
}

/* ====== Suggested courses ====== */
.ai-card__courses-suggest {
  padding-top: var(--iflyv-spacing-2);
  border-top: 1px dashed rgba(54, 88, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);
}

.courses-suggest {
  &__header {
    display: flex;
    align-items: center;
    gap: 4px;
    font: var(--iflyv-font-label-primary);
    font-weight: 600;
    color: var(--iflyv-brand-primary);
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: var(--iflyv-spacing-2);
    padding: var(--iflyv-spacing-2);
    background: rgba(54, 88, 255, 0.04);
    border-radius: var(--iflyv-radius-min);
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font: var(--iflyv-font-label-primary);
    font-weight: 600;
    color: var(--iflyv-text-1);
  }

  &__reason {
    font-size: 10px;
    color: var(--iflyv-text-4);
    line-height: 1.4;
  }

  &__add {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 8px;
    border: 1px solid var(--iflyv-brand-primary);
    border-radius: var(--iflyv-radius-full);
    background: transparent;
    color: var(--iflyv-brand-primary);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.15s ease;

    &:hover {
      background: var(--iflyv-brand-primary);
      color: #fff;
    }
  }

  &__done {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 8px;
    border-radius: var(--iflyv-radius-full);
    background: rgba(34, 197, 94, 0.08);
    color: var(--iflyv-success-primary);
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    flex-shrink: 0;
  }
}

/* ====== Picker dialog ====== */
.picker-header {
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

  &__selected {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
    padding: 2px 8px;
    border-radius: var(--iflyv-radius-full);
    font-weight: 500;
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

.picker-filters {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-3);
  margin-bottom: var(--iflyv-spacing-3);
}

.picker-search {
  :deep(.el-input__wrapper) {
    border-radius: var(--iflyv-radius-smallmodule);
  }
}

.picker-cats {
  display: flex;
  gap: var(--iflyv-spacing-2);
  flex-wrap: wrap;
}

.picker-cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-full);
  background: transparent;
  color: var(--iflyv-text-3);
  font: var(--iflyv-font-label-primary);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
  }

  &--active {
    background: var(--iflyv-brand-bg);
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
    font-weight: 500;
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
}

.picker-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 380px;
  overflow-y: auto;
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-smallmodule);
  padding: var(--iflyv-spacing-1);
}

.picker-item {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-3);
  padding: var(--iflyv-spacing-3) var(--iflyv-spacing-4);
  border-radius: var(--iflyv-radius-min);
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: var(--iflyv-bg-inset);
  }

  &--selected {
    background: var(--iflyv-brand-bg);

    &:hover {
      background: var(--iflyv-brand-bg);
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: default;

    &:hover {
      background: transparent;
    }
  }

  &__check {
    flex-shrink: 0;
  }

  &__checkbox {
    width: 18px;
    height: 18px;
    border: 2px solid var(--iflyv-border-dark);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    color: #fff;

    &.is-checked {
      background: var(--iflyv-brand-primary);
      border-color: var(--iflyv-brand-primary);
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__top {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__name {
    font: var(--iflyv-font-body-sub);
    font-weight: 600;
    color: var(--iflyv-text-1);
  }

  &__cat {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-4);
  }

  &__badge {
    font-size: 10px;
    color: var(--iflyv-success-primary);
    background: rgba(34, 197, 94, 0.08);
    padding: 1px 6px;
    border-radius: var(--iflyv-radius-full);
    margin-left: auto;
  }

  &__meta {
    display: flex;
    gap: var(--iflyv-spacing-3);
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-4);
    padding-left: 14px;
  }
}

.picker-empty {
  padding: var(--iflyv-spacing-6);
  text-align: center;
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-text-4);
}

.picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &__hint {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-4);
  }

  &__actions {
    display: flex;
    gap: var(--iflyv-spacing-2);
  }
}

/* ====== 匹配率感叹号 ====== */
.job-card__match-info {
  color: var(--iflyv-text-4);
  cursor: pointer;
  margin-left: 2px;
  transition: color 0.15s;
  flex-shrink: 0;

  &:hover {
    color: var(--iflyv-brand-primary);
  }
}

/* ====== 计算规则弹窗 ====== */
.rule-dialog {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-5);
}

.rule-section {
  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    margin: 0 0 var(--iflyv-spacing-3);
  }
}

.rule-formula {
  padding: 14px 18px;
  background: var(--iflyv-brand-bg);
  border-radius: var(--iflyv-radius-smallmodule);
  font-size: 14px;
  font-weight: 500;
  color: var(--iflyv-brand-primary);
  text-align: center;
  letter-spacing: 0.5px;
}

.rule-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 5px;
  }

  &__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    white-space: nowrap;
  }

  &__desc {
    font-size: 13px;
    color: var(--iflyv-text-3);
  }
}

.rule-levels {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rule-level {
  display: flex;
  align-items: center;
  gap: 12px;

  &__bar {
    height: 6px;
    border-radius: 3px;
    flex-shrink: 0;
    max-width: 120px;
  }

  &__text {
    font-size: 13px;
    color: var(--iflyv-text-2);
  }
}
</style>
