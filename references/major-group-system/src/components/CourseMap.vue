<template>
  <div class="course-map">
    <!-- 图例 -->
    <div class="course-legend">
      <span v-for="cat in categoryList" :key="cat.key" class="legend-item">
        <span class="legend-dot" :class="`legend-dot--${cat.color}`" />
        {{ cat.label }}
      </span>
      <span class="legend-item">
        <span class="legend-line" />
        前后序关系
      </span>
      <span v-if="pendingCourses.length" class="legend-item">
        <span class="legend-dot legend-dot--pending" />
        AI 建议待定课程
      </span>
    </div>

    <!-- 学期时间轴 + SVG连线层 -->
    <div class="semester-wrap" ref="wrapRef">
      <!-- SVG 连线 -->
      <svg class="link-svg" :viewBox="`0 0 ${svgW} ${svgH}`" v-if="svgW > 0">
        <defs>
          <marker id="arrow" viewBox="0 0 6 6" refX="6" refY="3"
            markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--iflyv-text-4)" />
          </marker>
        </defs>
        <path
          v-for="link in links"
          :key="link.key"
          :d="link.d"
          class="link-path"
          :class="{ 'link-path--hover': hoveredCourse && (hoveredCourse === link.from || hoveredCourse === link.to) }"
          marker-end="url(#arrow)"
        />
      </svg>

      <div class="semester-grid">
        <div v-for="(sem, si) in semesters" :key="sem" class="semester-col">
          <div class="semester-col__header">
            <span class="semester-col__num">{{ si + 1 }}</span>
            {{ sem }}
          </div>
          <div class="semester-col__body">
            <div
              v-for="course in getCoursesBySemester(sem)"
              :key="course.id"
              :ref="(el) => setCourseRef(course.id, el as HTMLElement)"
              class="course-chip"
              :class="[
                `course-chip--${getCategoryColor(course.category)}`,
                { 'course-chip--highlighted': hoveredCourse && isRelated(course.id) },
                { 'course-chip--dimmed': hoveredCourse && !isRelated(course.id) && hoveredCourse !== course.id },
              ]"
              @mouseenter="hoveredCourse = course.id"
              @mouseleave="hoveredCourse = null"
              @click="openDetail(course)"
            >
              <span class="course-chip__name">{{ course.name }}</span>
              <span class="course-chip__meta">{{ course.credits }}学分 · {{ course.hours }}学时</span>
            </div>
            <div v-if="getCoursesBySemester(sem).length === 0" class="semester-col__empty">
              —
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 待定课程区域 -->
    <div v-if="pendingCourses.length" class="pending-section">
      <div class="pending-section__header">
        <Sparkles :size="14" :stroke-width="2" class="pending-section__icon" />
        <span class="pending-section__title">AI 建议新增课程</span>
        <span class="pending-section__count">{{ pendingCourses.length }} 门待定</span>
      </div>
      <div class="pending-grid">
        <div
          v-for="course in pendingCourses"
          :key="course.id"
          class="course-chip course-chip--pending"
          @click="openDetail(course)"
        >
          <div class="course-chip__pending-badge">
            <Clock :size="10" :stroke-width="2.5" />
            待定
          </div>
          <span class="course-chip__name">{{ course.name }}</span>
          <span class="course-chip__reason">{{ course.description }}</span>
        </div>
      </div>
    </div>

    <!-- 课程详情/编辑弹窗 -->
    <CourseDetailDialog
      v-if="selectedCourse"
      v-model="detailVisible"
      :course="selectedCourse"
      :all-courses="courses"
      @update-course="handleUpdateCourse"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Sparkles, Clock } from 'lucide-vue-next'
import type { Course } from '../data/majors'
import { pendingCourses } from '../data/majors'
import CourseDetailDialog from './CourseDetailDialog.vue'

const props = defineProps<{ courses: Course[] }>()
const emit = defineEmits<{ 'update-course': [course: Course] }>()

const selectedCourse = ref<Course | null>(null)
const detailVisible = ref(false)
const hoveredCourse = ref<string | null>(null)
const wrapRef = ref<HTMLElement | null>(null)
const courseEls = new Map<string, HTMLElement>()
const svgW = ref(0)
const svgH = ref(0)

interface LinkData { key: string; from: string; to: string; d: string }
const links = ref<LinkData[]>([])

function setCourseRef(id: string, el: HTMLElement | null) {
  if (el) courseEls.set(id, el)
  else courseEls.delete(id)
}

function openDetail(course: Course) {
  selectedCourse.value = course
  detailVisible.value = true
}

function handleUpdateCourse(updated: Course) {
  emit('update-course', updated)
  // Also update selectedCourse to reflect changes
  selectedCourse.value = updated
  nextTick(calcLinks)
}

const semesters = ['第1学期', '第2学期', '第3学期', '第4学期', '第5学期', '第6学期']

const categoryList = [
  { key: '专业基础课', label: '专业基础课', color: 'info' },
  { key: '专业核心课', label: '专业核心课', color: 'success' },
  { key: 'AI实训课', label: 'AI实训课', color: 'warning' },
  { key: '专业拓展课', label: '专业拓展课', color: 'brand' },
]

function getCoursesBySemester(semester: string) {
  return props.courses.filter((c) => c.semester === semester)
}

function getCategoryColor(category: string) {
  const map: Record<string, string> = {
    '专业基础课': 'info',
    '专业核心课': 'success',
    'AI实训课': 'warning',
    '专业拓展课': 'brand',
  }
  return map[category] || 'brand'
}

// Build prerequisite edges
const edges = computed(() => {
  const result: { from: string; to: string }[] = []
  for (const c of props.courses) {
    if (c.prerequisites?.length) {
      for (const preId of c.prerequisites) {
        result.push({ from: preId, to: c.id })
      }
    }
  }
  return result
})

// Highlight related courses on hover
const relatedIds = computed(() => {
  if (!hoveredCourse.value) return new Set<string>()
  const ids = new Set<string>()
  for (const e of edges.value) {
    if (e.from === hoveredCourse.value || e.to === hoveredCourse.value) {
      ids.add(e.from)
      ids.add(e.to)
    }
  }
  return ids
})

function isRelated(courseId: string) {
  return relatedIds.value.has(courseId)
}

function calcLinks() {
  const wrap = wrapRef.value
  if (!wrap) return
  const wrapRect = wrap.getBoundingClientRect()
  svgW.value = wrap.scrollWidth
  svgH.value = wrap.scrollHeight

  const result: LinkData[] = []
  for (const edge of edges.value) {
    const fromEl = courseEls.get(edge.from)
    const toEl = courseEls.get(edge.to)
    if (!fromEl || !toEl) continue

    const fromRect = fromEl.getBoundingClientRect()
    const toRect = toEl.getBoundingClientRect()

    // Start from right-center of "from", end at left-center of "to"
    const x1 = fromRect.right - wrapRect.left
    const y1 = fromRect.top + fromRect.height / 2 - wrapRect.top
    const x2 = toRect.left - wrapRect.left
    const y2 = toRect.top + toRect.height / 2 - wrapRect.top

    const dx = x2 - x1
    const cp = Math.max(Math.abs(dx) * 0.4, 30)
    const d = `M${x1},${y1} C${x1 + cp},${y1} ${x2 - cp},${y2} ${x2},${y2}`
    result.push({ key: `${edge.from}-${edge.to}`, from: edge.from, to: edge.to, d })
  }
  links.value = result
}

let ro: ResizeObserver | null = null

onMounted(() => {
  nextTick(calcLinks)
  if (wrapRef.value) {
    ro = new ResizeObserver(() => calcLinks())
    ro.observe(wrapRef.value)
  }
})

onBeforeUnmount(() => {
  ro?.disconnect()
})

watch(() => props.courses, () => nextTick(calcLinks), { deep: true })
</script>

<style scoped lang="scss">
.course-map {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-3);
}

/* ====== 图例 ====== */
.course-legend {
  display: flex;
  gap: var(--iflyv-spacing-4);
  flex-wrap: wrap;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: var(--iflyv-spacing-1);
  font: var(--iflyv-font-label-primary);
  color: var(--iflyv-text-3);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--iflyv-radius-full);
  flex-shrink: 0;

  &--info { background: var(--iflyv-info-primary); }
  &--success { background: var(--iflyv-success-primary); }
  &--warning { background: var(--iflyv-warning-primary); }
  &--brand { background: var(--iflyv-brand-primary); }
}

.legend-line {
  width: 24px;
  height: 0;
  border-top: 1.5px dashed var(--iflyv-text-4);
  flex-shrink: 0;
}

/* ====== Semester wrap (SVG overlay) ====== */
.semester-wrap {
  position: relative;
}

.link-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.link-path {
  fill: none;
  stroke: var(--iflyv-text-4);
  stroke-width: 1.2;
  stroke-dasharray: 4 3;
  opacity: 0.45;
  transition: opacity 0.2s, stroke 0.2s, stroke-width 0.2s;

  &--hover {
    opacity: 1;
    stroke: var(--iflyv-brand-primary);
    stroke-width: 1.8;
    stroke-dasharray: none;
  }
}

/* ====== 学期网格 ====== */
.semester-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0;
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.semester-col {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--iflyv-border-light);

  &:last-child {
    border-right: none;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--iflyv-spacing-1);
    padding: var(--iflyv-spacing-3);
    text-align: center;
    font: var(--iflyv-font-body-sub);
    font-weight: 600;
    color: var(--iflyv-text-1);
    background: var(--iflyv-bg-panel);
    border-bottom: 2px solid var(--iflyv-brand-primary);
  }

  &__num {
    width: 20px;
    height: 20px;
    border-radius: var(--iflyv-radius-full);
    background: var(--iflyv-brand-primary);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--iflyv-spacing-2);
    padding: var(--iflyv-spacing-2);
    min-height: 180px;
  }

  &__empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--iflyv-text-4);
    font: var(--iflyv-font-label-primary);
  }
}

/* ====== 课程卡片 ====== */
.course-chip {
  padding: var(--iflyv-spacing-2) var(--iflyv-spacing-3);
  border-radius: var(--iflyv-radius-min);
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.2s ease;
  position: relative;
  background: var(--iflyv-bg-panel);

  &:hover {
    transform: translateX(2px);
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);
  }

  &--highlighted {
    box-shadow: 0 0 0 1.5px var(--iflyv-brand-primary), 0 2px 8px rgba(54, 88, 255, 0.12);
  }

  &--dimmed {
    opacity: 0.35;
  }

  &--info {
    background: var(--iflyv-info-bg);
    border-left-color: var(--iflyv-info-primary);
  }
  &--success {
    background: var(--iflyv-success-bg);
    border-left-color: var(--iflyv-success-primary);
  }
  &--warning {
    background: var(--iflyv-warning-bg);
    border-left-color: var(--iflyv-warning-primary);
  }
  &--brand {
    background: var(--iflyv-brand-bg);
    border-left-color: var(--iflyv-brand-primary);
  }

  &__name {
    display: block;
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-1);
    font-weight: 500;
    line-height: 1.4;
  }

  &__meta {
    display: block;
    font-size: 10px;
    color: var(--iflyv-text-4);
    margin-top: 2px;
  }

  &--pending {
    background: rgba(124, 58, 237, 0.04);
    border: 1px dashed rgba(124, 58, 237, 0.3);
    border-left: 3px dashed #7c3aed;
    position: relative;

    &:hover {
      background: rgba(124, 58, 237, 0.08);
      border-color: rgba(124, 58, 237, 0.5);
      box-shadow: 0 2px 10px rgba(124, 58, 237, 0.1);
    }
  }

  &__pending-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 1px 6px;
    background: linear-gradient(135deg, #7c3aed, var(--iflyv-brand-primary));
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    border-radius: var(--iflyv-radius-full);
    align-self: flex-start;
  }

  &__reason {
    display: block;
    font-size: 10px;
    color: var(--iflyv-text-4);
    margin-top: 2px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* ====== Pending section ====== */
.pending-section {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-3);
  padding: var(--iflyv-spacing-4);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.03) 0%, rgba(54, 88, 255, 0.03) 100%);
  border: 1px dashed rgba(124, 58, 237, 0.2);
  border-radius: var(--iflyv-radius-smallmodule);

  &__header {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
  }

  &__icon {
    color: #7c3aed;
  }

  &__title {
    font: var(--iflyv-font-body-sub);
    font-weight: 600;
    color: var(--iflyv-text-1);
  }

  &__count {
    font: var(--iflyv-font-label-primary);
    color: #7c3aed;
    background: rgba(124, 58, 237, 0.08);
    padding: 1px 8px;
    border-radius: var(--iflyv-radius-full);
    margin-left: auto;
  }
}

.pending-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--iflyv-spacing-2);
}

/* ====== Pending legend dot ====== */
.legend-dot--pending {
  background: linear-gradient(135deg, #7c3aed, var(--iflyv-brand-primary));
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: 1px dashed #7c3aed;
    border-radius: 50%;
  }
}
</style>
