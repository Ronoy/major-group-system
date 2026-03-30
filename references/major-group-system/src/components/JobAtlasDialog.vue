<template>
  <Teleport to="body">
    <Transition name="cm-fade">
      <div v-if="visible" class="cm-overlay" @keydown.esc="visible = false" tabindex="-1" ref="overlayRef">
        <!-- Header -->
        <div class="cm-header">
          <button class="cm-back-btn" @click="visible = false">
            <ChevronLeft :size="16" :stroke-width="2" />
            返回
          </button>
          <div class="cm-header-title">
            <span class="cm-header-title__name">{{ job.name }}</span>
            — 岗位能力图谱
          </div>
        </div>

        <!-- Body -->
        <div class="cm-body">
          <!-- Graph area -->
          <div class="cm-graph" ref="graphRef" @click="onGraphClick" @scroll="requestDraw">
            <div class="cm-graph-inner" ref="graphInnerRef">
              <!-- SVG connection lines -->
              <svg class="cm-svg" ref="svgRef"></svg>

              <!-- Layer 1: Job card -->
              <div class="cm-layer cm-layer-1">
                <div class="cm-job-card" ref="jobCardRef">
                  <div class="cm-job-card__name">{{ job.name }}</div>
                  <div class="cm-job-card__salary">{{ job.salaryRange }}</div>
                  <div class="cm-job-card__meta">
                    <span><GraduationCap :size="14" :stroke-width="2" /> {{ job.profile.education }}</span>
                    <span><Clock :size="14" :stroke-width="2" /> {{ job.profile.experience }}</span>
                    <span><TrendingUp :size="14" :stroke-width="2" /> {{ shortCareer }}</span>
                  </div>
                  <div class="cm-job-card__tags">
                    <el-tag type="primary" size="small">{{ job.category }}</el-tag>
                    <el-tag class="tag--level" size="small">{{ job.profile.level }}</el-tag>
                    <el-tag class="tag--demand" size="small">需求量 {{ job.profile.demandCount.toLocaleString() }}</el-tag>
                  </div>
                </div>
              </div>

              <!-- Layer 2: Task cards -->
              <div class="cm-layer cm-layer-2" ref="layer2Ref">
                <div
                  v-for="(task, i) in taskNodes"
                  :key="task.id"
                  class="cm-task-card"
                  :class="{
                    active: activeTaskId === task.id,
                    dimmed: (activeTaskId && activeTaskId !== task.id) || (activeAbilityId && !isTaskRelated(task.id)),
                  }"
                  :data-task-id="task.id"
                  @click.stop="onTaskClick(task.id)"
                >
                  <div class="cm-task-card__index">任务 {{ i + 1 }}</div>
                  <div class="cm-task-card__text">{{ truncate(task.text, 18) }}</div>
                </div>
              </div>

              <!-- Layer 3: Ability nodes -->
              <div class="cm-layer cm-layer-3" ref="layer3Ref">
                <div
                  v-for="ab in abilityNodes"
                  :key="ab.id"
                  class="cm-ability-node"
                  :class="{
                    active: activeAbilityId === ab.id,
                    dimmed: (activeTaskId && ab.taskId !== activeTaskId) || (activeAbilityId && activeAbilityId !== ab.id),
                    hidden: !activeFilters.has(ab.catKey),
                  }"
                  :data-ability-id="ab.id"
                  :data-task-id="ab.taskId"
                  :data-category="ab.catKey"
                  @click.stop="onAbilityClick(ab.id)"
                >
                  <div class="cm-shape" :class="`cm-shape--${ab.shape}`">
                    <component :is="ab.icon" :size="18" :stroke-width="2" />
                  </div>
                  <div class="cm-ability-name">{{ ab.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="cm-sidebar">
            <!-- Stats -->
            <div class="cm-sidebar-section">
              <div class="cm-sidebar-title">
                <BarChart3 :size="16" :stroke-width="2" />
                统计概览
              </div>
              <div class="cm-stat-grid">
                <div class="cm-stat-item">
                  <span class="cm-stat-value">{{ taskNodes.length }}</span>
                  <span class="cm-stat-label">典型工作任务</span>
                </div>
                <div class="cm-stat-item">
                  <span class="cm-stat-value">{{ abilityNodes.length }}</span>
                  <span class="cm-stat-label">能力项总数</span>
                </div>
                <div class="cm-stat-item cm-stat-item--wide">
                  <div class="cm-stat-breakdown">
                    <span v-for="cat in categories" :key="cat.key" class="cm-stat-breakdown-item">
                      <span class="cm-stat-breakdown-dot" :style="{ background: cat.color }" />
                      {{ cat.label }} {{ cat.items.length }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detail panel -->
            <Transition name="cm-slide">
              <div v-if="detailContent" class="cm-detail-panel" :key="detailContent.type + detailContent.id">
                <div class="cm-detail-header">
                  <span class="cm-detail-title">{{ detailContent.type === 'task' ? '任务详情' : '能力详情' }}</span>
                  <button class="cm-detail-close" @click="clearHighlights">
                    <X :size="16" :stroke-width="2" />
                  </button>
                </div>

                <!-- Task detail -->
                <template v-if="detailContent.type === 'task'">
                  <div class="cm-detail-section">
                    <div class="cm-detail-label">任务描述</div>
                    <div class="cm-detail-text">{{ detailContent.task!.text }}</div>
                  </div>
                  <div class="cm-detail-section">
                    <div class="cm-detail-label">关联能力项（{{ detailContent.task!.abilities.length }}）</div>
                    <div class="cm-detail-ability-list">
                      <div
                        v-for="a in detailContent.task!.abilities"
                        :key="a.id"
                        class="cm-detail-ability-item"
                        @click="onAbilityClick(a.id)"
                      >
                        <span class="cm-detail-ability-dot" :style="{ background: a.color }" />
                        <span>{{ a.name }}</span>
                        <span class="cm-detail-ability-tag" :style="{ background: a.color + '18', color: a.color }">{{ a.catLabel }}</span>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Ability detail -->
                <template v-else-if="detailContent.type === 'ability'">
                  <div class="cm-detail-section">
                    <div class="cm-detail-label">能力名称</div>
                    <div class="cm-detail-text" style="font-weight:600">{{ detailContent.ability!.name }}</div>
                  </div>
                  <div class="cm-detail-section">
                    <div class="cm-detail-label">能力类型</div>
                    <span class="cm-detail-ability-tag" :style="{ background: detailContent.ability!.color + '18', color: detailContent.ability!.color, padding: '3px 10px' }">
                      {{ detailContent.ability!.catLabel }}
                    </span>
                  </div>
                  <div class="cm-detail-section">
                    <div class="cm-detail-label">能力定义</div>
                    <div class="cm-detail-text">{{ detailContent.ability!.definition }}</div>
                  </div>
                </template>
              </div>
            </Transition>
          </aside>
        </div>

        <!-- Footer filter bar -->
        <div class="cm-footer">
          <span class="cm-footer-label">显示筛选</span>
          <button
            v-for="cat in categories"
            :key="cat.key"
            class="cm-filter-toggle"
            :class="{ active: activeFilters.has(cat.key) }"
            :style="activeFilters.has(cat.key) ? { color: cat.color, borderColor: cat.color, background: cat.color + '0F' } : {}"
            @click="toggleFilter(cat.key)"
          >
            <span class="cm-filter-dot" :style="{ background: activeFilters.has(cat.key) ? cat.color : undefined }" />
            {{ cat.label }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import {
  ChevronLeft, GraduationCap, Clock, TrendingUp,
  BarChart3, Wrench, Zap, Lightbulb, X,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import type { JobMatch } from '../data/majors'

const props = defineProps<{ job: JobMatch }>()
const visible = defineModel<boolean>({ required: true })

// Refs
const overlayRef = ref<HTMLElement>()
const graphRef = ref<HTMLElement>()
const graphInnerRef = ref<HTMLElement>()
const svgRef = ref<SVGSVGElement>()
const jobCardRef = ref<HTMLElement>()
const layer2Ref = ref<HTMLElement>()
const layer3Ref = ref<HTMLElement>()

// Data
type CatKey = 'tools' | 'skills' | 'qualities'

interface AbilityNode {
  id: string
  name: string
  catKey: CatKey
  catLabel: string
  color: string
  shape: string
  icon: Component
  taskId: string
  definition: string
}

interface TaskNode {
  id: string
  text: string
  abilities: AbilityNode[]
}

const categories = [
  { key: 'tools' as CatKey, label: '工具', color: '#3658FF', shape: 'circle', icon: Wrench, items: props.job.profile.tools },
  { key: 'skills' as CatKey, label: '专业技能', color: '#A855F7', shape: 'rounded', icon: Zap, items: props.job.profile.skills },
  { key: 'qualities' as CatKey, label: '素养与态度', color: '#F5A623', shape: 'diamond', icon: Lightbulb, items: props.job.profile.qualities },
]

const taskNodes = computed<TaskNode[]>(() =>
  (props.job.profile.tasks || []).map((text, i) => ({
    id: `task-${i}`,
    text,
    abilities: [] as AbilityNode[],
  }))
)

const abilityNodes = computed<AbilityNode[]>(() => {
  const nodes: AbilityNode[] = []
  const tasks = taskNodes.value
  let idx = 0
  for (const cat of categories) {
    for (const name of cat.items) {
      const taskIdx = idx % tasks.length
      const ab: AbilityNode = {
        id: `ab-${idx}`,
        name,
        catKey: cat.key,
        catLabel: cat.label,
        color: cat.color,
        shape: cat.shape,
        icon: cat.icon,
        taskId: tasks[taskIdx].id,
        definition: `掌握${name}的核心概念、方法论与实践应用，能够在${cat.label}领域独立开展相关工作。`,
      }
      tasks[taskIdx].abilities.push(ab)
      nodes.push(ab)
      idx++
    }
  }
  return nodes
})

const shortCareer = computed(() => {
  const parts = props.job.profile.careerPath.split(' → ')
  if (parts.length <= 3) return props.job.profile.careerPath
  return `${parts[0]} → ... → ${parts[parts.length - 1]}`
})

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

// Interaction state
const activeTaskId = ref<string | null>(null)
const activeAbilityId = ref<string | null>(null)
const activeFilters = ref(new Set<CatKey>(['tools', 'skills', 'qualities']))

function toggleFilter(key: CatKey) {
  const s = activeFilters.value
  if (s.has(key)) {
    if (s.size > 1) s.delete(key)
  } else {
    s.add(key)
  }
  // Clear highlight if filtered out
  if (activeAbilityId.value) {
    const ab = abilityNodes.value.find(a => a.id === activeAbilityId.value)
    if (ab && !s.has(ab.catKey)) clearHighlights()
  }
  nextTick(drawLines)
}

function isTaskRelated(taskId: string) {
  if (!activeAbilityId.value) return false
  const ab = abilityNodes.value.find(a => a.id === activeAbilityId.value)
  return ab?.taskId === taskId
}

interface DetailContent {
  type: 'task' | 'ability'
  id: string
  task?: TaskNode
  ability?: AbilityNode
}

const detailContent = ref<DetailContent | null>(null)

function clearHighlights() {
  activeTaskId.value = null
  activeAbilityId.value = null
  detailContent.value = null
  drawLines()
}

function onTaskClick(taskId: string) {
  if (activeTaskId.value === taskId) {
    clearHighlights()
    return
  }
  activeTaskId.value = taskId
  activeAbilityId.value = null
  const task = taskNodes.value.find(t => t.id === taskId)
  if (task) {
    detailContent.value = { type: 'task', id: taskId, task }
  }
  drawLines()
}

function onAbilityClick(abilityId: string) {
  if (activeAbilityId.value === abilityId) {
    clearHighlights()
    return
  }
  activeAbilityId.value = abilityId
  activeTaskId.value = null
  const ab = abilityNodes.value.find(a => a.id === abilityId)
  if (ab) {
    detailContent.value = { type: 'ability', id: abilityId, ability: ab }
  }
  drawLines()
}

function onGraphClick(e: MouseEvent) {
  if (e.target === graphRef.value || e.target === graphInnerRef.value) {
    clearHighlights()
  }
}

// SVG line drawing
function drawLines() {
  const svg = svgRef.value
  const inner = graphInnerRef.value
  const jobCard = jobCardRef.value
  const l2 = layer2Ref.value
  const l3 = layer3Ref.value
  if (!svg || !inner || !jobCard || !l2 || !l3) return

  const rect = inner.getBoundingClientRect()
  const jRect = jobCard.getBoundingClientRect()
  const jCx = jRect.left + jRect.width / 2 - rect.left
  const jBy = jRect.bottom - rect.top

  let paths = ''

  // Job → Tasks
  l2.querySelectorAll<HTMLElement>('.cm-task-card').forEach(card => {
    const r = card.getBoundingClientRect()
    const cx = r.left + r.width / 2 - rect.left
    const ty = r.top - rect.top
    const midY = (jBy + ty) / 2
    const tid = card.dataset.taskId!
    const hl = activeTaskId.value === tid || (activeAbilityId.value && isTaskRelated(tid))
    const dim = (activeTaskId.value && activeTaskId.value !== tid && !hl) || (activeAbilityId.value && !hl)
    const cls = `cm-line cm-line--job-task${hl ? ' highlighted' : ''}${dim ? ' dimmed' : ''}`
    paths += `<path class="${cls}" d="M${jCx},${jBy} C${jCx},${midY} ${cx},${midY} ${cx},${ty}"/>`
  })

  // Tasks → Abilities
  l2.querySelectorAll<HTMLElement>('.cm-task-card').forEach(card => {
    const cr = card.getBoundingClientRect()
    const tcx = cr.left + cr.width / 2 - rect.left
    const tby = cr.bottom - rect.top
    const tid = card.dataset.taskId!

    l3.querySelectorAll<HTMLElement>(`.cm-ability-node[data-task-id="${tid}"]`).forEach(node => {
      if (node.classList.contains('hidden')) return
      const nr = node.getBoundingClientRect()
      const ncx = nr.left + nr.width / 2 - rect.left
      const nty = nr.top - rect.top
      const midY2 = (tby + nty) / 2
      const abId = node.dataset.abilityId!
      const hl2 = activeTaskId.value === tid || activeAbilityId.value === abId
      const dim2 = (activeTaskId.value && activeTaskId.value !== tid && !hl2) || (activeAbilityId.value && activeAbilityId.value !== abId && !hl2)
      const cls2 = `cm-line cm-line--task-ability${hl2 ? ' highlighted' : ''}${dim2 ? ' dimmed' : ''}`
      paths += `<path class="${cls2}" d="M${tcx},${tby} C${tcx},${midY2} ${ncx},${midY2} ${ncx},${nty}"/>`
    })
  })

  svg.innerHTML = paths
  svg.setAttribute('width', String(inner.scrollWidth))
  svg.setAttribute('height', String(inner.scrollHeight))
}

function requestDraw() {
  requestAnimationFrame(drawLines)
}

// Lifecycle
let resizeHandler: (() => void) | null = null

watch(visible, (v) => {
  if (v) {
    nextTick(() => {
      overlayRef.value?.focus()
      requestAnimationFrame(() => requestAnimationFrame(drawLines))
    })
    resizeHandler = drawLines
    window.addEventListener('resize', resizeHandler)
  } else {
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
      resizeHandler = null
    }
    clearHighlights()
  }
})

onBeforeUnmount(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped lang="scss">
/* ====== Overlay ====== */
.cm-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #f5f6f8;
  display: flex;
  flex-direction: column;
  outline: none;
}

.cm-fade-enter-active { animation: cmFadeIn 0.3s ease; }
.cm-fade-leave-active { animation: cmFadeIn 0.2s ease reverse; }
@keyframes cmFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ====== Header ====== */
.cm-header {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-3);
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid var(--iflyv-border-light);
  flex-shrink: 0;
  z-index: 2;
}

.cm-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-text-2);
  background: none;
  border: 1px solid var(--iflyv-border-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--iflyv-brand-primary);
    border-color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
  }
}

.cm-header-title {
  font: var(--iflyv-font-title-primary);
  color: var(--iflyv-text-2);

  &__name {
    color: var(--iflyv-brand-primary);
    font-weight: 600;
  }
}

/* ====== Body ====== */
.cm-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ====== Graph ====== */
.cm-graph {
  flex: 1;
  overflow: auto;
  position: relative;
  padding: 32px 40px 40px;
}

.cm-graph-inner {
  position: relative;
  min-width: 900px;
}

.cm-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

:deep(.cm-line) {
  fill: none;
  transition: opacity 0.3s ease, stroke 0.3s ease;
}

:deep(.cm-line--job-task) {
  stroke: rgba(54, 88, 255, 0.25);
  stroke-width: 2;
}

:deep(.cm-line--task-ability) {
  stroke: rgba(0, 0, 0, 0.08);
  stroke-width: 1.5;
}

:deep(.cm-line.highlighted) {
  opacity: 1 !important;
  stroke-width: 2.5;

  &.cm-line--job-task { stroke: rgba(54, 88, 255, 0.6); }
  &.cm-line--task-ability { stroke: rgba(54, 88, 255, 0.4); }
}

:deep(.cm-line.dimmed) {
  opacity: 0.06 !important;
}

/* ====== Layers ====== */
.cm-layer {
  position: relative;
  z-index: 1;
}

/* Layer 1: Job card */
.cm-layer-1 {
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
}

.cm-job-card {
  background: #fff;
  border-radius: var(--iflyv-radius-smallmodule);
  padding: 24px 36px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: center;
  max-width: 520px;
  width: 100%;

  &__name {
    font: var(--iflyv-font-title-emphasized);
    color: var(--iflyv-text-1);
    margin-bottom: 10px;
  }

  &__salary {
    font-size: 22px;
    font-weight: 700;
    background: linear-gradient(135deg, #FC7819, #F53B3B);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
  }

  &__meta {
    display: flex;
    justify-content: center;
    gap: var(--iflyv-spacing-4);
    flex-wrap: wrap;
    margin-bottom: 12px;

    > span {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: var(--iflyv-font-body-sub);
      color: var(--iflyv-text-3);
    }
  }

  &__tags {
    display: flex;
    justify-content: center;
    gap: 6px;
    flex-wrap: wrap;
  }
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

/* Layer 2: Task cards */
.cm-layer-2 {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.cm-task-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid transparent;
  width: 165px;
  text-align: center;
  position: relative;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.active {
    border-color: var(--iflyv-brand-primary);
    box-shadow: 0 0 0 3px rgba(54, 88, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  &.dimmed {
    opacity: 0.3;
  }

  &__index {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
    margin-bottom: 6px;
  }

  &__text {
    font: var(--iflyv-font-body-sub);
    font-weight: 500;
    color: var(--iflyv-text-1);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* Layer 3: Ability nodes */
.cm-layer-3 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  max-width: 1100px;
  margin: 0 auto;
}

.cm-ability-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--iflyv-spacing-2);
  padding: 14px 8px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 2px solid transparent;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.active {
    border-color: var(--iflyv-brand-primary);
    box-shadow: 0 0 0 3px rgba(54, 88, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  &.dimmed {
    opacity: 0.25;
  }

  &.hidden {
    display: none;
  }
}

.cm-shape {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;

  &--circle {
    border-radius: 50%;
    background: #3658FF;
  }

  &--rounded {
    border-radius: 8px;
    background: #A855F7;
  }

  &--diamond {
    border-radius: 6px;
    background: #F5A623;
    transform: rotate(45deg);
    width: 30px;
    height: 30px;

    :deep(svg) {
      transform: rotate(-45deg);
    }
  }
}

.cm-ability-name {
  font: var(--iflyv-font-label-primary);
  color: var(--iflyv-text-1);
  text-align: center;
  line-height: 1.4;
  word-break: break-all;
}

/* ====== Sidebar ====== */
.cm-sidebar {
  width: 300px;
  background: #fff;
  border-left: 1px solid var(--iflyv-border-light);
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.cm-sidebar-section {
  padding: 20px;
  border-bottom: 1px solid var(--iflyv-border-light);
}

.cm-sidebar-title {
  font: var(--iflyv-font-body-sub);
  font-weight: 600;
  color: var(--iflyv-text-1);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cm-stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.cm-stat-item {
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  padding: 12px;
  text-align: center;

  &--wide {
    grid-column: 1 / -1;
  }
}

.cm-stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--iflyv-brand-primary);
}

.cm-stat-label {
  font: var(--iflyv-font-label-primary);
  color: var(--iflyv-text-3);
  margin-top: 2px;
}

.cm-stat-breakdown {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: var(--iflyv-spacing-2);
}

.cm-stat-breakdown-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font: var(--iflyv-font-label-primary);
  color: var(--iflyv-text-2);
}

.cm-stat-breakdown-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ====== Detail panel ====== */
.cm-detail-panel {
  padding: 20px;
}

.cm-slide-enter-active { animation: cmSlideIn 0.2s ease; }
.cm-slide-leave-active { animation: cmSlideIn 0.15s ease reverse; }
@keyframes cmSlideIn {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}

.cm-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.cm-detail-title {
  font: var(--iflyv-font-title-primary);
  color: var(--iflyv-text-1);
}

.cm-detail-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--iflyv-text-3);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;

  &:hover {
    background: var(--iflyv-bg-inset);
    color: var(--iflyv-text-1);
  }
}

.cm-detail-section {
  margin-bottom: 16px;
}

.cm-detail-label {
  font: var(--iflyv-font-label-primary);
  color: var(--iflyv-text-3);
  margin-bottom: 6px;
  font-weight: 500;
}

.cm-detail-text {
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-text-2);
  line-height: 1.7;
}

.cm-detail-ability-list {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);
}

.cm-detail-ability-item {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);
  padding: var(--iflyv-spacing-2) var(--iflyv-spacing-3);
  background: var(--iflyv-bg-inset);
  border-radius: 6px;
  font: var(--iflyv-font-label-primary);
  color: var(--iflyv-text-1);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: var(--iflyv-border-light);
  }
}

.cm-detail-ability-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cm-detail-ability-tag {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 3px;
  margin-left: auto;
  flex-shrink: 0;
}

/* ====== Footer ====== */
.cm-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 24px;
  background: #fff;
  border-top: 1px solid var(--iflyv-border-light);
  flex-shrink: 0;
  z-index: 2;
}

.cm-footer-label {
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-text-3);
  margin-right: 4px;
}

.cm-filter-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font: var(--iflyv-font-body-sub);
  border-radius: var(--iflyv-radius-full);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--iflyv-border-primary);
  background: #fff;
  color: var(--iflyv-text-2);
  user-select: none;

  &.active {
    font-weight: 500;
  }
}

.cm-filter-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--iflyv-text-4);
}
</style>
