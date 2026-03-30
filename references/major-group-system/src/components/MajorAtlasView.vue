<template>
  <Teleport to="body">
    <Transition name="atlas-fade">
      <div v-if="visible" class="atlas-overlay" tabindex="-1" @keydown.esc="visible = false" ref="overlayRef">
        <!-- Header -->
        <div class="atlas-header">
          <button class="atlas-back-btn" @click="visible = false">
            <ChevronLeft :size="16" :stroke-width="2" />
            返回
          </button>
          <div class="atlas-header__title">
            <span class="atlas-header__name">{{ majorName }}</span>
            — 专业岗位图谱
          </div>
          <div class="atlas-header__hint">
            <MousePointerClick :size="14" :stroke-width="2" />
            双击节点展开/收起下级 · 滚轮缩放 · 拖拽画布
          </div>
        </div>

        <!-- Body -->
        <div class="atlas-body">
          <!-- Chart -->
          <div class="atlas-chart-wrap">
            <v-chart
              ref="chartRef"
              :option="chartOption"
              autoresize
              class="atlas-chart"
              @click="onNodeClick"
              @dblclick="onNodeDblClick"
            />
            <!-- Floating Legend -->
            <div class="floating-legend">
              <span v-for="cat in legendItems" :key="cat.label" class="floating-legend__item">
                <span
                  class="floating-legend__dot"
                  :class="{ 'floating-legend__dot--bridge': (cat as any).isBridge }"
                  :style="{ background: cat.color }"
                />
                {{ cat.label }}
                <span v-if="(cat as any).isBridge && graphData.bridgeCount" class="floating-legend__bridge-count">
                  {{ graphData.bridgeCount }}
                </span>
              </span>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="atlas-sidebar">
            <!-- Stats -->
            <div class="atlas-sidebar__section">
              <div class="atlas-sidebar__title">
                <BarChart3 :size="14" :stroke-width="2" />
                图谱概览
              </div>
              <div class="stats-grid">
                <div class="stats-item">
                  <span class="stats-value">{{ graphData.nodes.length }}</span>
                  <span class="stats-label">节点</span>
                </div>
                <div class="stats-item">
                  <span class="stats-value">{{ graphData.links.length }}</span>
                  <span class="stats-label">关联</span>
                </div>
                <div class="stats-item">
                  <span class="stats-value">{{ expandedJobs.size }}</span>
                  <span class="stats-label">已展开岗位</span>
                </div>
                <div class="stats-item" :class="{ 'stats-item--bridge': graphData.bridgeCount > 0 }">
                  <span class="stats-value" :style="graphData.bridgeCount > 0 ? { color: '#D97706' } : {}">{{ graphData.bridgeCount }}</span>
                  <span class="stats-label">岗课共享</span>
                </div>
              </div>
            </div>

            <!-- Node detail -->
            <Transition name="detail-slide" mode="out-in">
              <div v-if="nodeDetail" class="atlas-sidebar__section atlas-sidebar__section--detail" :key="nodeDetail.id">
                <div class="atlas-sidebar__title">
                  <Info :size="14" :stroke-width="2" />
                  节点详情
                </div>
                <div class="detail-card">
                  <span class="detail-type-badge" :style="{ background: nodeDetail.color + '18', color: nodeDetail.color }">
                    {{ nodeDetail.typeLabel }}
                  </span>
                  <div class="detail-name">{{ nodeDetail.name }}</div>

                  <!-- Major -->
                  <template v-if="nodeDetail.type === 'major'">
                    <div class="detail-row"><span class="detail-label">专业代码</span><span>{{ majorInfo?.code }}</span></div>
                    <div class="detail-row"><span class="detail-label">所属学院</span><span>{{ majorInfo?.college }}</span></div>
                    <div class="detail-row"><span class="detail-label">所在地</span><span>{{ majorInfo?.location }}</span></div>
                  </template>

                  <!-- Job -->
                  <template v-if="nodeDetail.type === 'job' && nodeDetail.job">
                    <div class="detail-row"><span class="detail-label">薪资范围</span><span class="detail-salary">{{ nodeDetail.job.salaryRange }}</span></div>
                    <div class="detail-row"><span class="detail-label">匹配度</span><span>{{ nodeDetail.job.matchRate }}%</span></div>
                    <div class="detail-row"><span class="detail-label">学历要求</span><span>{{ nodeDetail.job.profile.education }}</span></div>
                    <div class="detail-row"><span class="detail-label">需求量</span><span>{{ nodeDetail.job.profile.demandCount.toLocaleString() }}</span></div>
                    <div class="detail-hint" v-if="!expandedJobs.has(nodeDetail.job.id)">双击展开任务与课程</div>
                    <div class="detail-hint detail-hint--expanded" v-else>已展开 · 双击收起</div>
                  </template>

                  <!-- Task -->
                  <template v-if="nodeDetail.type === 'task'">
                    <div class="detail-row"><span class="detail-label">所属岗位</span><span>{{ nodeDetail.parentJobName }}</span></div>
                    <div class="detail-text">{{ nodeDetail.fullText }}</div>
                    <div class="detail-hint" v-if="nodeDetail.expandable && !expandedTasks.has(nodeDetail.id)">双击展开能力项</div>
                    <div class="detail-hint detail-hint--expanded" v-else-if="expandedTasks.has(nodeDetail.id)">已展开 · 双击收起</div>
                  </template>

                  <!-- Course -->
                  <template v-if="nodeDetail.type === 'course' && nodeDetail.course">
                    <div class="detail-row"><span class="detail-label">课程类别</span><span>{{ nodeDetail.course.category }}</span></div>
                    <div class="detail-row"><span class="detail-label">学分/学时</span><span>{{ nodeDetail.course.credits }}学分 · {{ nodeDetail.course.hours }}学时</span></div>
                    <div class="detail-row"><span class="detail-label">开设学期</span><span>{{ nodeDetail.course.semester }}</span></div>
                    <div class="detail-text">{{ nodeDetail.course.description }}</div>
                    <div class="detail-hint" v-if="!expandedCourses.has(nodeDetail.course.id)">双击展开学习任务</div>
                    <div class="detail-hint detail-hint--expanded" v-else>已展开 · 双击收起</div>
                  </template>

                  <!-- Learning Task -->
                  <template v-if="nodeDetail.type === 'learningTask'">
                    <div class="detail-row"><span class="detail-label">所属课程</span><span>{{ nodeDetail.parentCourseName }}</span></div>
                    <div v-if="nodeDetail.ltKnowledge?.length" class="detail-tags">
                      <span class="detail-tags__label">知识点</span>
                      <span v-for="k in nodeDetail.ltKnowledge" :key="k" class="detail-tag" style="--tag-color: #3658FF">{{ k }}</span>
                    </div>
                    <div v-if="nodeDetail.ltProfessionalSkills?.length" class="detail-tags">
                      <span class="detail-tags__label">专业技能</span>
                      <span v-for="s in nodeDetail.ltProfessionalSkills" :key="s" class="detail-tag" style="--tag-color: #A855F7">{{ s }}</span>
                    </div>
                    <div v-if="nodeDetail.ltGeneralSkills?.length" class="detail-tags">
                      <span class="detail-tags__label">通用技能</span>
                      <span v-for="s in nodeDetail.ltGeneralSkills" :key="s" class="detail-tag" style="--tag-color: #36CFC9">{{ s }}</span>
                    </div>
                    <div v-if="nodeDetail.ltQualities?.length" class="detail-tags">
                      <span class="detail-tags__label">素养</span>
                      <span v-for="q in nodeDetail.ltQualities" :key="q" class="detail-tag" style="--tag-color: #FF7A45">{{ q }}</span>
                    </div>
                    <div class="detail-hint" v-if="!expandedLearningTasks.has(nodeDetail.id)">双击展开关联能力项</div>
                    <div class="detail-hint detail-hint--expanded" v-else>已展开 · 双击收起</div>
                  </template>

                  <!-- Ability -->
                  <template v-if="nodeDetail.type === 'ability'">
                    <div class="detail-text">{{ nodeDetail.definition }}</div>
                  </template>
                </div>
              </div>
            </Transition>

            <!-- Actions -->
            <div class="atlas-sidebar__section atlas-sidebar__section--actions">
              <button class="action-btn" @click="resetGraph">
                <RotateCcw :size="14" :stroke-width="2" />
                重置图谱
              </button>
              <button class="action-btn" @click="expandAllJobs">
                <Expand :size="14" :stroke-width="2" />
                展开全部岗位
              </button>
            </div>
          </aside>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import {
  ChevronLeft, MousePointerClick, BarChart3, Info,
  RotateCcw, Expand,
} from 'lucide-vue-next'
import { use } from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { JobMatch, Course, LearningTask } from '../data/majors'
import { courseJobLinkMap, learningTaskMap } from '../data/majors'

use([GraphChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  majorName: string
  majorId: string
  jobs: JobMatch[]
  courses: Course[]
  majorInfo: { code: string; college: string; location: string } | null
}>()
const visible = defineModel<boolean>({ required: true })

const overlayRef = ref<HTMLElement>()
const chartRef = ref<InstanceType<typeof VChart>>()

// ---- Colors & legend ----
const COLORS = {
  major: '#EF4444',
  job: '#3658FF',
  task: '#22C55E',
  course: '#F5A623',
  learningTask: '#06B6D4',
  knowledge: '#3658FF',
  generalSkill: '#36CFC9',
  professionalSkill: '#A855F7',
  quality: '#FF7A45',
}

const legendItems = [
  { label: '专业', color: COLORS.major },
  { label: '岗位', color: COLORS.job },
  { label: '典型工作任务', color: COLORS.task },
  { label: '课程', color: COLORS.course },
  { label: '学习任务', color: COLORS.learningTask },
  { label: '知识点', color: COLORS.knowledge },
  { label: '通用技能', color: COLORS.generalSkill },
  { label: '专业技能', color: COLORS.professionalSkill },
  { label: '素养', color: COLORS.quality },
  { label: '岗课共享', color: '#D97706', isBridge: true },
]

// ---- Expansion state ----
const expandedJobs = ref(new Set<string>())
const expandedTasks = ref(new Set<string>())
const expandedCourses = ref(new Set<string>())
const expandedLearningTasks = ref(new Set<string>())
const selectedNodeId = ref<string | null>(null)

function resetGraph() {
  expandedJobs.value = new Set()
  expandedTasks.value = new Set()
  expandedCourses.value = new Set()
  expandedLearningTasks.value = new Set()
  selectedNodeId.value = null
}

function expandAllJobs() {
  expandedJobs.value = new Set(props.jobs.map(j => j.id))
  expandedTasks.value = new Set()
  expandedCourses.value = new Set()
  expandedLearningTasks.value = new Set()
}

// ---- Ability mapping helper (for work tasks) ----
// Each task gets: all professional skills + qualities (shared with learning tasks for bridge formation)
// Tools only go to first 2 tasks to avoid clutter
function getAbilitiesForTask(job: JobMatch, taskIndex: number) {
  const totalTasks = job.profile.tasks.length
  const result: { name: string; catKey: string; color: string; label: string }[] = []

  // Professional skills: distribute evenly but ensure each task gets some
  for (let i = 0; i < job.profile.skills.length; i++) {
    if (i % totalTasks === taskIndex) {
      result.push({ name: job.profile.skills[i], catKey: 'skills', color: COLORS.professionalSkill, label: '专业技能' })
    }
  }
  // Qualities: distribute evenly
  for (let i = 0; i < job.profile.qualities.length; i++) {
    if (i % totalTasks === taskIndex) {
      result.push({ name: job.profile.qualities[i], catKey: 'qualities', color: COLORS.quality, label: '素养' })
    }
  }
  // Tools: only first 2 tasks to reduce noise
  if (taskIndex < 2) {
    for (let i = 0; i < job.profile.tools.length; i++) {
      if (i % 2 === taskIndex) {
        result.push({ name: job.profile.tools[i], catKey: 'tools', color: COLORS.generalSkill, label: '工具' })
      }
    }
  }
  return result
}

// ---- Course → Job reverse lookup ----
function getCoursesForJob(jobName: string): Course[] {
  const result: Course[] = []
  const seen = new Set<string>()
  for (const [courseId, links] of Object.entries(courseJobLinkMap)) {
    if (links.some(l => l.jobName === jobName)) {
      if (seen.has(courseId)) continue
      seen.add(courseId)
      const course = props.courses.find(c => c.id === courseId)
      if (course) result.push(course)
    }
  }
  return result
}

// ---- Build graph data ----
interface GNode {
  name: string
  displayName: string
  nodeType: string
  symbolSize: number
  category: number
  itemStyle: { color: string; borderColor: string; borderWidth: number; shadowBlur?: number; shadowColor?: string }
  label: { show: boolean; fontSize: number; color: string; fontWeight: number | string; position: string; formatter: () => string }
  jobId?: string
  taskIdx?: number
  courseId?: string
  learningTaskId?: string
  parentJobName?: string
  parentCourseName?: string
  fullText?: string
  abilityDef?: string
  abilityCatLabel?: string
  ltData?: LearningTask
}

interface GLink {
  source: string
  target: string
  lineStyle: { color: string; width: number; opacity: number; curveness: number; type?: string }
}

const graphData = computed(() => {
  const nodes: GNode[] = []
  const links: GLink[] = []
  const addedNodes = new Set<string>()
  const addedLinks = new Set<string>()
  // Track ability link count to grow shared nodes
  const abilityLinkCount = new Map<string, number>()
  // Track which side links to each ability: 'work' (from t:*) or 'learn' (from lt:*)
  const abilitySources = new Map<string, Set<'work' | 'learn'>>()

  function addNode(n: GNode) {
    if (addedNodes.has(n.name)) return
    addedNodes.add(n.name)
    nodes.push(n)
  }

  function addLink(l: GLink) {
    const key = `${l.source}→${l.target}`
    if (addedLinks.has(key)) return
    addedLinks.add(key)
    links.push(l)
  }

  // Shared ability node ID: based on category + name so same abilities merge
  function abilityId(catLabel: string, name: string) {
    return `ab:${catLabel}:${name}`
  }

  function addAbilityNode(name: string, catLabel: string, color: string, category: number, source: 'work' | 'learn') {
    const id = abilityId(catLabel, name)
    const count = (abilityLinkCount.get(id) || 0) + 1
    abilityLinkCount.set(id, count)
    // Track sources
    if (!abilitySources.has(id)) abilitySources.set(id, new Set())
    abilitySources.get(id)!.add(source)
    const isBridge = abilitySources.get(id)!.size > 1
    // Shared node grows with more connections; bridge nodes are larger
    const size = Math.min(30, (isBridge ? 20 : 14) + count * 2)
    if (addedNodes.has(id)) {
      // Update size + visual of existing node
      const existing = nodes.find(n => n.name === id)
      if (existing) {
        existing.symbolSize = size
        if (isBridge) {
          existing.itemStyle = {
            color: '#fff',
            borderColor: color,
            borderWidth: 3,
            shadowBlur: 12,
            shadowColor: 'rgba(245, 166, 35, 0.5)',
          }
          existing.label = {
            ...existing.label,
            fontSize: 10,
            fontWeight: 600,
            color: '#D97706',
          }
          existing.nodeType = 'bridge'
        }
      }
      return id
    }
    addNode({
      name: id,
      displayName: name,
      nodeType: isBridge ? 'bridge' : 'ability',
      abilityDef: name,
      abilityCatLabel: catLabel,
      symbolSize: size,
      category,
      itemStyle: isBridge
        ? { color: '#fff', borderColor: color, borderWidth: 3, shadowBlur: 12, shadowColor: 'rgba(245, 166, 35, 0.5)' }
        : { color, borderColor: '#fff', borderWidth: 1 },
      label: isBridge
        ? { show: true, fontSize: 10, color: '#D97706', fontWeight: 600, position: 'right', formatter: () => truncate(name, 6) }
        : { show: true, fontSize: 9, color: '#737373', fontWeight: 'normal', position: 'right', formatter: () => truncate(name, 6) },
    })
    return id
  }

  // 1. Major node (center)
  const majorId = `m:${props.majorId}`
  addNode({
    name: majorId,
    displayName: props.majorName,
    nodeType: 'major',
    symbolSize: 58,
    category: 0,
    itemStyle: { color: COLORS.major, borderColor: '#fff', borderWidth: 3, shadowBlur: 12, shadowColor: 'rgba(239,68,68,0.3)' },
    label: { show: true, fontSize: 13, color: '#fff', fontWeight: 700, position: 'inside', formatter: () => props.majorName.length > 6 ? props.majorName.slice(0, 6) + '…' : props.majorName },
  })

  // 2. Job nodes
  for (const job of props.jobs) {
    const jid = `j:${job.id}`
    const isExpanded = expandedJobs.value.has(job.id)
    addNode({
      name: jid,
      displayName: job.name,
      nodeType: 'job',
      jobId: job.id,
      symbolSize: 42,
      category: 1,
      itemStyle: {
        color: COLORS.job,
        borderColor: isExpanded ? '#fff' : COLORS.job,
        borderWidth: isExpanded ? 3 : 1,
        shadowBlur: isExpanded ? 10 : 0,
        shadowColor: isExpanded ? 'rgba(54,88,255,0.35)' : undefined,
      },
      label: { show: true, fontSize: 11, color: '#151515', fontWeight: 600, position: 'bottom', formatter: () => truncate(job.name, 8) },
    })
    addLink({
      source: majorId,
      target: jid,
      lineStyle: { color: COLORS.job, width: 2, opacity: 0.3, curveness: 0.1 },
    })

    // 3. Expanded job → tasks + courses
    if (isExpanded) {
      const jobTasks = job.profile.tasks || []
      for (let ti = 0; ti < jobTasks.length; ti++) {
        const tid = `t:${job.id}:${ti}`
        const isTaskExpanded = expandedTasks.value.has(tid)
        addNode({
          name: tid,
          displayName: jobTasks[ti],
          nodeType: 'task',
          jobId: job.id,
          taskIdx: ti,
          parentJobName: job.name,
          fullText: jobTasks[ti],
          symbolSize: 26,
          category: 2,
          itemStyle: {
            color: COLORS.task,
            borderColor: isTaskExpanded ? '#fff' : COLORS.task,
            borderWidth: isTaskExpanded ? 2 : 1,
            shadowBlur: isTaskExpanded ? 8 : 0,
            shadowColor: isTaskExpanded ? 'rgba(34,197,94,0.35)' : undefined,
          },
          label: { show: true, fontSize: 10, color: '#525252', fontWeight: 'normal', position: 'bottom', formatter: () => truncate(jobTasks[ti], 7) },
        })
        addLink({
          source: jid,
          target: tid,
          lineStyle: { color: COLORS.task, width: 1.5, opacity: 0.25, curveness: 0.15 },
        })

        // 4. Expanded task → shared ability nodes
        if (isTaskExpanded) {
          const abilities = getAbilitiesForTask(job, ti)
          for (const ab of abilities) {
            const catLabel = ab.catKey === 'tools' ? '通用技能' : ab.catKey === 'skills' ? '专业技能' : '素养'
            const cat = ab.catKey === 'tools' ? 5 : ab.catKey === 'skills' ? 6 : 7
            const aid = addAbilityNode(ab.name, catLabel, ab.color, cat, 'work')
            addLink({
              source: tid,
              target: aid,
              lineStyle: { color: ab.color, width: 1, opacity: 0.25, curveness: 0.2 },
            })
          }
        }
      }

      // Courses linked to this job
      const jobCourses = getCoursesForJob(job.name)
      for (const course of jobCourses) {
        const cid = `c:${course.id}`
        const isCourseExpanded = expandedCourses.value.has(course.id)
        addNode({
          name: cid,
          displayName: course.name,
          nodeType: 'course',
          courseId: course.id,
          symbolSize: 28,
          category: 3,
          itemStyle: {
            color: COLORS.course,
            borderColor: isCourseExpanded ? '#fff' : COLORS.course,
            borderWidth: isCourseExpanded ? 2 : 1,
            shadowBlur: isCourseExpanded ? 8 : 0,
            shadowColor: isCourseExpanded ? 'rgba(245,166,35,0.35)' : undefined,
          },
          label: { show: true, fontSize: 10, color: '#525252', fontWeight: 500, position: 'bottom', formatter: () => truncate(course.name, 7) },
        })
        const linkData = (courseJobLinkMap[course.id] || []).find(l => l.jobName === job.name)
        const cov = linkData?.coverage || 30
        const w = Math.max(1, Math.round(cov / 25))
        addLink({
          source: cid,
          target: jid,
          lineStyle: { color: COLORS.course, width: w, opacity: 0.2 + (cov / 100) * 0.3, curveness: 0.2, type: 'dashed' },
        })

        // 5. Expanded course → learning tasks
        if (isCourseExpanded) {
          const lTasks = learningTaskMap[course.id] || []
          for (const lt of lTasks) {
            const ltid = `lt:${lt.id}`
            const isLtExpanded = expandedLearningTasks.value.has(ltid)
            addNode({
              name: ltid,
              displayName: lt.name,
              nodeType: 'learningTask',
              learningTaskId: lt.id,
              courseId: course.id,
              parentCourseName: course.name,
              ltData: lt,
              symbolSize: 22,
              category: 4,
              itemStyle: {
                color: COLORS.learningTask,
                borderColor: isLtExpanded ? '#fff' : COLORS.learningTask,
                borderWidth: isLtExpanded ? 2 : 1,
                shadowBlur: isLtExpanded ? 6 : 0,
                shadowColor: isLtExpanded ? 'rgba(6,182,212,0.35)' : undefined,
              },
              label: { show: true, fontSize: 9, color: '#525252', fontWeight: 500, position: 'bottom', formatter: () => truncate(lt.name, 7) },
            })
            addLink({
              source: cid,
              target: ltid,
              lineStyle: { color: COLORS.learningTask, width: 1.5, opacity: 0.3, curveness: 0.15 },
            })

            // 6. Expanded learning task → shared ability nodes
            if (isLtExpanded) {
              for (const k of lt.knowledge) {
                const aid = addAbilityNode(k, '知识点', COLORS.knowledge, 5, 'learn')
                addLink({ source: ltid, target: aid, lineStyle: { color: COLORS.knowledge, width: 1, opacity: 0.25, curveness: 0.2 } })
              }
              for (const s of lt.professionalSkills) {
                const aid = addAbilityNode(s, '专业技能', COLORS.professionalSkill, 6, 'learn')
                addLink({ source: ltid, target: aid, lineStyle: { color: COLORS.professionalSkill, width: 1, opacity: 0.25, curveness: 0.2 } })
              }
              for (const g of lt.generalSkills) {
                const aid = addAbilityNode(g, '通用技能', COLORS.generalSkill, 5, 'learn')
                addLink({ source: ltid, target: aid, lineStyle: { color: COLORS.generalSkill, width: 1, opacity: 0.25, curveness: 0.2 } })
              }
              for (const q of lt.qualities) {
                const aid = addAbilityNode(q, '素养', COLORS.quality, 7, 'learn')
                addLink({ source: ltid, target: aid, lineStyle: { color: COLORS.quality, width: 1, opacity: 0.25, curveness: 0.2 } })
              }
            }
          }
        }
      }
    }
  }

  // Count bridge nodes
  const bridgeCount = Array.from(abilitySources.values()).filter(s => s.size > 1).length

  return { nodes, links, bridgeCount }
})

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

// ---- Chart option ----
const chartOption = computed(() => {
  const totalNodes = graphData.value.nodes.length
  const repulsion = Math.max(200, 80 + totalNodes * 12)
  const edgeLenMin = totalNodes > 30 ? 50 : 80
  const edgeLenMax = totalNodes > 30 ? 160 : 220

  return {
    tooltip: {
      trigger: 'item',
      formatter(params: any) {
        if (params.dataType === 'edge') return ''
        const d = params.data
        if (!d) return ''
        const typeMap: Record<string, string> = {
          major: '专业', job: '岗位', task: '典型工作任务', course: '课程',
          learningTask: '学习任务', ability: d.abilityCatLabel || '能力项',
          bridge: d.abilityCatLabel || '能力项',
        }
        const bridgeTag = d.nodeType === 'bridge' ? '<br/><span style="color:#D97706;font-weight:600">⬡ 岗课共享节点</span>' : ''
        return `<b>${d.displayName}</b><br/><span style="color:${d.itemStyle?.borderColor || d.itemStyle?.color || '#999'}">${typeMap[d.nodeType] || ''}</span>${bridgeTag}`
      },
    },
    series: [{
      type: 'graph',
      layout: 'force',
      roam: true,
      draggable: true,
      force: {
        repulsion,
        gravity: 0.06,
        edgeLength: [edgeLenMin, edgeLenMax],
        friction: 0.6,
        layoutAnimation: true,
      },
      categories: [
        { name: '专业' },
        { name: '岗位' },
        { name: '典型工作任务' },
        { name: '课程' },
        { name: '学习任务' },
        { name: '知识点/通用技能' },
        { name: '专业技能' },
        { name: '素养' },
      ],
      data: graphData.value.nodes.map(n => ({
        ...n,
        label: {
          ...n.label,
          formatter: n.label.formatter,
        },
      })),
      links: graphData.value.links,
      emphasis: {
        focus: 'adjacency',
        itemStyle: {
          shadowBlur: 15,
          shadowColor: 'rgba(0,0,0,0.2)',
        },
        lineStyle: {
          opacity: 0.7,
          width: 3,
        },
      },
      lineStyle: {
        curveness: 0.15,
      },
      animationDuration: 600,
      animationEasingUpdate: 'cubicInOut',
    }],
  }
})

// ---- Event handlers ----
function onNodeClick(params: any) {
  if (params.dataType !== 'node') {
    selectedNodeId.value = null
    return
  }
  selectedNodeId.value = params.data.name
}

function onNodeDblClick(params: any) {
  if (params.dataType !== 'node') return
  const d = params.data

  if (d.nodeType === 'job' && d.jobId) {
    const jobId = d.jobId
    const set = new Set(expandedJobs.value)
    if (set.has(jobId)) {
      set.delete(jobId)
      // Collapse all tasks of this job
      const taskPrefix = `t:${jobId}:`
      const newTasks = new Set(expandedTasks.value)
      for (const t of newTasks) {
        if (t.startsWith(taskPrefix)) newTasks.delete(t)
      }
      expandedTasks.value = newTasks
    } else {
      set.add(jobId)
    }
    expandedJobs.value = set
  } else if (d.nodeType === 'task') {
    const set = new Set(expandedTasks.value)
    if (set.has(d.name)) {
      set.delete(d.name)
    } else {
      set.add(d.name)
    }
    expandedTasks.value = set
  } else if (d.nodeType === 'course' && d.courseId) {
    const set = new Set(expandedCourses.value)
    if (set.has(d.courseId)) {
      set.delete(d.courseId)
      // Collapse all learning tasks of this course
      const ltPrefix = `lt:lt-${d.courseId}`
      const newLts = new Set(expandedLearningTasks.value)
      for (const lt of newLts) {
        if (lt.startsWith(ltPrefix)) newLts.delete(lt)
      }
      expandedLearningTasks.value = newLts
    } else {
      set.add(d.courseId)
    }
    expandedCourses.value = set
  } else if (d.nodeType === 'learningTask') {
    const set = new Set(expandedLearningTasks.value)
    if (set.has(d.name)) {
      set.delete(d.name)
    } else {
      set.add(d.name)
    }
    expandedLearningTasks.value = set
  }
}

// ---- Node detail for sidebar ----
interface NodeDetail {
  id: string
  type: string
  typeLabel: string
  name: string
  color: string
  job?: JobMatch
  course?: Course
  parentJobName?: string
  parentCourseName?: string
  fullText?: string
  definition?: string
  expandable: boolean
  ltKnowledge?: string[]
  ltProfessionalSkills?: string[]
  ltGeneralSkills?: string[]
  ltQualities?: string[]
}

const nodeDetail = computed<NodeDetail | null>(() => {
  const id = selectedNodeId.value
  if (!id) return null
  const node = graphData.value.nodes.find(n => n.name === id)
  if (!node) return null

  const base = {
    id,
    type: node.nodeType,
    name: node.displayName,
    color: node.itemStyle.color,
    expandable: false,
  }

  if (node.nodeType === 'major') {
    return { ...base, typeLabel: '专业' }
  }
  if (node.nodeType === 'job') {
    const job = props.jobs.find(j => j.id === node.jobId)
    return { ...base, typeLabel: '岗位', job: job || undefined, expandable: true }
  }
  if (node.nodeType === 'task') {
    return {
      ...base,
      typeLabel: '典型工作任务',
      parentJobName: node.parentJobName,
      fullText: node.fullText,
      expandable: true,
    }
  }
  if (node.nodeType === 'course') {
    const course = props.courses.find(c => c.id === node.courseId)
    return { ...base, typeLabel: '课程', course: course || undefined, expandable: true }
  }
  if (node.nodeType === 'learningTask' && node.ltData) {
    return {
      ...base,
      typeLabel: '学习任务',
      parentCourseName: node.parentCourseName,
      expandable: true,
      ltKnowledge: node.ltData.knowledge,
      ltProfessionalSkills: node.ltData.professionalSkills,
      ltGeneralSkills: node.ltData.generalSkills,
      ltQualities: node.ltData.qualities,
    }
  }
  if (node.nodeType === 'bridge') {
    return { ...base, typeLabel: '岗课共享 · ' + (node.abilityCatLabel || '能力项'), definition: node.abilityDef, color: '#D97706' }
  }
  if (node.nodeType === 'ability') {
    return { ...base, typeLabel: node.abilityCatLabel || '能力项', definition: node.abilityDef }
  }
  return null
})

// ---- Lifecycle ----
watch(visible, (v) => {
  if (v) {
    nextTick(() => overlayRef.value?.focus())
  } else {
    resetGraph()
  }
})

onBeforeUnmount(() => {
  resetGraph()
})
</script>

<style scoped lang="scss">
/* ====== Overlay ====== */
.atlas-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #f5f6f8;
  display: flex;
  flex-direction: column;
  outline: none;
}

.atlas-fade-enter-active { animation: atlasFadeIn 0.3s ease; }
.atlas-fade-leave-active { animation: atlasFadeIn 0.2s ease reverse; }
@keyframes atlasFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ====== Header ====== */
.atlas-header {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-3);
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid var(--iflyv-border-light);
  flex-shrink: 0;
  z-index: 2;

  &__title {
    font: var(--iflyv-font-title-primary);
    color: var(--iflyv-text-2);
  }

  &__name {
    color: var(--iflyv-brand-primary);
    font-weight: 600;
  }

  &__hint {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-4);
  }
}

.atlas-back-btn {
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

/* ====== Body ====== */
.atlas-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.atlas-chart-wrap {
  flex: 1;
  position: relative;
}

.atlas-chart {
  width: 100%;
  height: 100%;
}

/* ====== Floating Legend ====== */
.floating-legend {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 14px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-full);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  z-index: 10;
  max-width: 90%;

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--iflyv-text-2);
    white-space: nowrap;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;

    &--bridge {
      width: 10px;
      height: 10px;
      border: 2px solid #D97706;
      background: #fff !important;
      box-shadow: 0 0 4px rgba(217, 119, 6, 0.4);
    }
  }

  &__bridge-count {
    font-size: 10px;
    font-weight: 600;
    color: #D97706;
    background: rgba(217, 119, 6, 0.1);
    padding: 0 5px;
    border-radius: 8px;
    line-height: 16px;
  }
}

/* ====== Sidebar ====== */
.atlas-sidebar {
  width: 280px;
  background: #fff;
  border-left: 1px solid var(--iflyv-border-light);
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  &__section {
    padding: 16px 20px;
    border-bottom: 1px solid var(--iflyv-border-light);

    &--detail {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }

    &--actions {
      border-bottom: none;
      display: flex;
      flex-direction: column;
      gap: var(--iflyv-spacing-2);
      margin-top: auto;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 6px;
    font: var(--iflyv-font-body-sub);
    font-weight: 600;
    color: var(--iflyv-text-1);
    margin-bottom: 12px;
  }
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stats-item {
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  padding: 10px;
  text-align: center;
}

.stats-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: var(--iflyv-brand-primary);
}

.stats-label {
  display: block;
  font: var(--iflyv-font-label-primary);
  color: var(--iflyv-text-3);
  margin-top: 2px;
}

/* Detail */
.detail-slide-enter-active { animation: detailIn 0.2s ease; }
.detail-slide-leave-active { animation: detailIn 0.15s ease reverse; }
@keyframes detailIn {
  from { opacity: 0; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}

.detail-card {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);
}

.detail-type-badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--iflyv-radius-full);
}

.detail-name {
  font: var(--iflyv-font-title-primary);
  color: var(--iflyv-text-1);
  line-height: 1.4;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-text-2);
  padding: 4px 0;
  border-bottom: 1px solid var(--iflyv-border-light);
}

.detail-label {
  color: var(--iflyv-text-3);
  flex-shrink: 0;
}

.detail-salary {
  font-weight: 600;
  background: linear-gradient(135deg, #FC7819, #F53B3B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.detail-text {
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-text-2);
  line-height: 1.6;
  margin-top: 4px;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  margin-top: 2px;

  &__label {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
    margin-right: 2px;
    flex-shrink: 0;
  }
}

.detail-tag {
  display: inline-block;
  padding: 1px 6px;
  font-size: 10px;
  border-radius: var(--iflyv-radius-full);
  background: color-mix(in srgb, var(--tag-color, #3658FF) 10%, transparent);
  color: var(--tag-color, #3658FF);
  font-weight: 500;
  white-space: nowrap;
}

.detail-hint {
  font: var(--iflyv-font-label-primary);
  color: var(--iflyv-brand-primary);
  background: var(--iflyv-brand-bg);
  padding: 4px 10px;
  border-radius: var(--iflyv-radius-full);
  text-align: center;
  margin-top: 4px;

  &--expanded {
    color: var(--iflyv-success-primary);
    background: var(--iflyv-success-bg);
  }
}

/* Action buttons */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--iflyv-border-primary);
  border-radius: var(--iflyv-radius-smallmodule);
  background: var(--iflyv-bg-panel);
  color: var(--iflyv-text-2);
  font: var(--iflyv-font-body-sub);
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
  }
}
</style>
