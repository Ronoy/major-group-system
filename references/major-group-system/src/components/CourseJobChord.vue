<template>
  <div class="chord-wrap">
    <!-- 图例 -->
    <div class="chord-legend">
      <span class="chord-legend__item">
        <span class="chord-legend__dot" style="background: #3658FF" />
        岗位
      </span>
      <span class="chord-legend__item">
        <span class="chord-legend__dot" style="background: #22C55E" />
        专业核心课
      </span>
      <span class="chord-legend__item">
        <span class="chord-legend__dot" style="background: #F5A623" />
        AI实训课
      </span>
      <span class="chord-legend__item">
        <span class="chord-legend__dot" style="background: #8B8FA3" />
        专业基础课
      </span>
      <span class="chord-legend__item">
        <span class="chord-legend__dot" style="background: #A855F7" />
        专业拓展课
      </span>
      <span class="chord-legend__sep" />
      <span class="chord-legend__hint">线条粗细 = 关联强度（覆盖度）</span>
    </div>

    <!-- 图表区域 -->
    <v-chart :option="chartOption" autoresize class="chord-chart" />

    <!-- 统计面板 -->
    <div class="stats-panel">
      <!-- 概览指标 -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-card__value">{{ stats.totalJobs }}</div>
          <div class="stat-card__label">关联岗位数</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">{{ stats.totalCourses }}</div>
          <div class="stat-card__label">关联课程数</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">{{ stats.totalLinks }}</div>
          <div class="stat-card__label">课-岗关联数</div>
        </div>
        <div class="stat-card stat-card--accent">
          <div class="stat-card__value">{{ stats.avgCoverage }}<span class="stat-card__unit">%</span></div>
          <div class="stat-card__label">平均覆盖度 <CircleAlert :size="13" :stroke-width="2" class="coverage-info-icon" @click="coverageRuleVisible = true" /></div>
        </div>
      </div>

      <!-- 详细统计 -->
      <div class="stats-detail">
        <!-- 岗位覆盖率 -->
        <div class="stats-section">
          <div class="stats-section__header">
            <span class="stats-section__title">岗位课程覆盖率 <CircleAlert :size="13" :stroke-width="2" class="coverage-info-icon" @click="coverageRuleVisible = true" /></span>
            <span class="stats-section__sub">每个岗位被课程覆盖的程度</span>
          </div>
          <div class="coverage-bars">
            <div v-for="item in stats.jobCoverage" :key="item.name" class="coverage-row">
              <span class="coverage-row__name">{{ item.name }}</span>
              <div class="coverage-row__bar-wrap">
                <div
                  class="coverage-row__bar"
                  :style="{ width: item.avgCoverage + '%' }"
                  :class="coverageLevel(item.avgCoverage)"
                />
              </div>
              <span class="coverage-row__val" :class="coverageLevel(item.avgCoverage)">{{ item.avgCoverage }}%</span>
              <span class="coverage-row__count">{{ item.courseCount }}门课</span>
            </div>
          </div>
        </div>

        <!-- 课程关联度 -->
        <div class="stats-section">
          <div class="stats-section__header">
            <span class="stats-section__title">课程岗位关联度 <CircleAlert :size="13" :stroke-width="2" class="coverage-info-icon" @click="coverageRuleVisible = true" /></span>
            <span class="stats-section__sub">每门课程关联的岗位数与平均覆盖度</span>
          </div>
          <div class="coverage-bars">
            <div v-for="item in stats.courseAssociation" :key="item.name" class="coverage-row">
              <span class="coverage-row__name">{{ item.name }}</span>
              <div class="coverage-row__bar-wrap">
                <div
                  class="coverage-row__bar"
                  :style="{ width: item.avgCoverage + '%' }"
                  :class="coverageLevel(item.avgCoverage)"
                />
              </div>
              <span class="coverage-row__val" :class="coverageLevel(item.avgCoverage)">{{ item.avgCoverage }}%</span>
              <span class="coverage-row__count">{{ item.jobCount }}个岗位</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 覆盖度分布 -->
      <div class="stats-distribution">
        <span class="stats-distribution__title">覆盖度分布</span>
        <div class="stats-distribution__bars">
          <div class="dist-bar">
            <div class="dist-bar__fill dist-bar__fill--high" :style="{ width: stats.highPct + '%' }" />
            <span class="dist-bar__label">高（≥70%）<b>{{ stats.highCount }}</b></span>
          </div>
          <div class="dist-bar">
            <div class="dist-bar__fill dist-bar__fill--mid" :style="{ width: stats.midPct + '%' }" />
            <span class="dist-bar__label">中（40-69%）<b>{{ stats.midCount }}</b></span>
          </div>
          <div class="dist-bar">
            <div class="dist-bar__fill dist-bar__fill--low" :style="{ width: stats.lowPct + '%' }" />
            <span class="dist-bar__label">低（＜40%）<b>{{ stats.lowCount }}</b></span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 覆盖度计算规则弹窗 -->
  <el-dialog
    v-model="coverageRuleVisible"
    title="岗位能力覆盖度计算规则"
    width="560px"
    append-to-body
    destroy-on-close
    align-center
  >
    <div class="rule-dialog">
      <div class="rule-section">
        <h4 class="rule-section__title">计算公式</h4>
        <div class="rule-formula">
          覆盖度 = （课程覆盖的岗位技能点数 ÷ 岗位要求总技能点数）× 100%
        </div>
      </div>
      <div class="rule-section">
        <h4 class="rule-section__title">指标说明</h4>
        <div class="rule-items">
          <div class="rule-item">
            <span class="rule-item__dot" style="background: #3658FF" />
            <span class="rule-item__label">岗位课程覆盖率</span>
            <span class="rule-item__desc">衡量每个岗位所需技能被现有课程体系覆盖的比例，反映课程设置对岗位需求的满足程度</span>
          </div>
          <div class="rule-item">
            <span class="rule-item__dot" style="background: #F5A623" />
            <span class="rule-item__label">课程岗位关联度</span>
            <span class="rule-item__desc">衡量每门课程关联的岗位数量及平均覆盖深度，反映课程的岗位支撑广度</span>
          </div>
          <div class="rule-item">
            <span class="rule-item__dot" style="background: #22C55E" />
            <span class="rule-item__label">平均覆盖度</span>
            <span class="rule-item__desc">所有课-岗关联覆盖度的加权平均值，综合反映专业对目标岗位群的整体支撑水平</span>
          </div>
        </div>
      </div>
      <div class="rule-section">
        <h4 class="rule-section__title">覆盖度等级</h4>
        <div class="rule-levels">
          <div class="rule-level">
            <span class="rule-level__bar" style="background: #22C55E; width: 100%" />
            <span class="rule-level__text">≥ 70%　高覆盖 — 课程与岗位高度契合</span>
          </div>
          <div class="rule-level">
            <span class="rule-level__bar" style="background: #F5A623; width: 60%" />
            <span class="rule-level__text">40%-69%　中覆盖 — 有一定支撑，建议补充</span>
          </div>
          <div class="rule-level">
            <span class="rule-level__bar" style="background: #9CA3AF; width: 30%" />
            <span class="rule-level__text">＜ 40%　低覆盖 — 需重点加强课程建设</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { CircleAlert } from 'lucide-vue-next'
import type { JobMatch, Course } from '../data/majors'
import { courseJobLinkMap } from '../data/majors'

use([GraphChart, TooltipComponent, CanvasRenderer])

const coverageRuleVisible = ref(false)

const props = defineProps<{
  jobs: JobMatch[]
  courses: Course[]
}>()

const jobColor = '#3658FF'

const courseColorMap: Record<string, string> = {
  '专业核心课': '#22C55E',
  'AI实训课': '#F5A623',
  '专业基础课': '#8B8FA3',
  '专业拓展课': '#A855F7',
}

// Compute statistics
const stats = computed(() => {
  const jobNameSet = new Set(props.jobs.map(j => j.name))
  const relevantCourses = props.courses.filter(c => {
    const cLinks = courseJobLinkMap[c.id] || []
    return cLinks.some(l => jobNameSet.has(l.jobName))
  })

  // Collect all links
  interface LinkInfo { courseName: string; jobName: string; coverage: number }
  const allLinks: LinkInfo[] = []
  for (const course of relevantCourses) {
    const cLinks = courseJobLinkMap[course.id] || []
    for (const link of cLinks) {
      if (!jobNameSet.has(link.jobName)) continue
      allLinks.push({ courseName: course.name, jobName: link.jobName, coverage: link.coverage })
    }
  }

  const totalLinks = allLinks.length
  const avgCoverage = totalLinks ? Math.round(allLinks.reduce((s, l) => s + l.coverage, 0) / totalLinks) : 0

  // Per-job coverage stats
  const jobMap = new Map<string, number[]>()
  for (const l of allLinks) {
    if (!jobMap.has(l.jobName)) jobMap.set(l.jobName, [])
    jobMap.get(l.jobName)!.push(l.coverage)
  }
  const jobCoverage = Array.from(jobMap.entries())
    .map(([name, coverages]) => ({
      name,
      avgCoverage: Math.round(coverages.reduce((s, v) => s + v, 0) / coverages.length),
      courseCount: coverages.length,
    }))
    .sort((a, b) => b.avgCoverage - a.avgCoverage)

  // Per-course association stats
  const courseMap = new Map<string, number[]>()
  for (const l of allLinks) {
    if (!courseMap.has(l.courseName)) courseMap.set(l.courseName, [])
    courseMap.get(l.courseName)!.push(l.coverage)
  }
  const courseAssociation = Array.from(courseMap.entries())
    .map(([name, coverages]) => ({
      name,
      avgCoverage: Math.round(coverages.reduce((s, v) => s + v, 0) / coverages.length),
      jobCount: coverages.length,
    }))
    .sort((a, b) => b.avgCoverage - a.avgCoverage)

  // Coverage distribution
  const highCount = allLinks.filter(l => l.coverage >= 70).length
  const midCount = allLinks.filter(l => l.coverage >= 40 && l.coverage < 70).length
  const lowCount = allLinks.filter(l => l.coverage < 40).length
  const highPct = totalLinks ? Math.round((highCount / totalLinks) * 100) : 0
  const midPct = totalLinks ? Math.round((midCount / totalLinks) * 100) : 0
  const lowPct = totalLinks ? Math.round((lowCount / totalLinks) * 100) : 0

  return {
    totalJobs: jobMap.size,
    totalCourses: courseMap.size,
    totalLinks,
    avgCoverage,
    jobCoverage,
    courseAssociation,
    highCount,
    midCount,
    lowCount,
    highPct,
    midPct,
    lowPct,
  }
})

function coverageLevel(val: number) {
  if (val >= 70) return 'level--high'
  if (val >= 40) return 'level--mid'
  return 'level--low'
}

const chartOption = computed(() => {
  const nodes: {
    name: string
    symbolSize: number
    category: number
    itemStyle: { color: string; borderColor: string; borderWidth: number }
    label: { show: boolean; fontSize: number; color: string; fontWeight: string | number }
    value: number
  }[] = []
  const links: {
    source: string
    target: string
    value: number
    lineStyle: { width: number; color: string; opacity: number; curveness: number }
  }[] = []
  const added = new Set<string>()

  for (const job of props.jobs) {
    if (added.has(job.name)) continue
    added.add(job.name)
    nodes.push({
      name: job.name,
      symbolSize: 42,
      category: 0,
      value: job.matchRate,
      itemStyle: { color: jobColor, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, fontSize: 11, color: '#151515', fontWeight: 600 },
    })
  }

  const jobNameSet = new Set(props.jobs.map(j => j.name))
  const relevantCourses = props.courses.filter(c => {
    const cLinks = courseJobLinkMap[c.id] || []
    return cLinks.some(l => jobNameSet.has(l.jobName))
  })

  for (const course of relevantCourses) {
    if (added.has(course.name)) continue
    added.add(course.name)
    const color = courseColorMap[course.category] || '#8B8FA3'
    const linkCount = (courseJobLinkMap[course.id] || []).filter(l => jobNameSet.has(l.jobName)).length
    nodes.push({
      name: course.name,
      symbolSize: 24 + linkCount * 6,
      category: 1,
      value: course.credits,
      itemStyle: { color, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, fontSize: 10, color: '#525252', fontWeight: 'normal' },
    })
  }

  for (const course of relevantCourses) {
    const cLinks = courseJobLinkMap[course.id] || []
    for (const link of cLinks) {
      if (!jobNameSet.has(link.jobName)) continue
      const width = Math.max(1, Math.round(link.coverage / 18))
      const opacity = 0.15 + (link.coverage / 100) * 0.45
      const color = link.coverage >= 70 ? '#22C55E' : link.coverage >= 40 ? '#F5A623' : '#C4C7CF'
      links.push({
        source: course.name,
        target: link.jobName,
        value: link.coverage,
        lineStyle: { width, color, opacity, curveness: 0.3 },
      })
    }
  }

  return {
    tooltip: {
      trigger: 'item',
      formatter(params: any) {
        if (params.dataType === 'edge') {
          return `<b>${params.data.source}</b> → <b>${params.data.target}</b><br/>覆盖度：<b style="color:${params.data.value >= 70 ? '#22C55E' : params.data.value >= 40 ? '#F5A623' : '#8B8FA3'}">${params.data.value}%</b>`
        }
        if (params.dataType === 'node') {
          const cat = params.data.category === 0 ? '岗位' : '课程'
          return `<b>${params.name}</b><br/>类型：${cat}`
        }
        return ''
      },
    },
    series: [
      {
        type: 'graph',
        layout: 'circular',
        circular: {
          rotateLabel: true,
        },
        roam: true,
        data: nodes,
        links,
        categories: [
          { name: '岗位' },
          { name: '课程' },
        ],
        label: {
          position: 'outside',
          formatter: '{b}',
        },
        lineStyle: {
          curveness: 0.3,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            opacity: 0.8,
            width: 4,
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.15)',
          },
        },
      },
    ],
  }
})
</script>

<style scoped lang="scss">
.chord-wrap {
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  padding: var(--iflyv-spacing-3);
  display: flex;
  flex-direction: column;
  gap: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.chord-legend {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-3);
  padding: var(--iflyv-spacing-2) var(--iflyv-spacing-4);
  border-bottom: 1px solid var(--iflyv-border-light);
  margin-bottom: var(--iflyv-spacing-1);
  flex-wrap: wrap;

  &__item {
    display: inline-flex;
    align-items: center;
    gap: var(--iflyv-spacing-1);
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-2);
    font-weight: 500;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: var(--iflyv-radius-full);
    flex-shrink: 0;
  }

  &__sep {
    width: 1px;
    height: 14px;
    background: var(--iflyv-border-light);
  }

  &__hint {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-4);
  }
}

.chord-chart {
  width: 100%;
  height: 520px;
}

/* ====== Stats Panel ====== */
.stats-panel {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-4);
  padding: var(--iflyv-spacing-4);
  border-top: 1px solid var(--iflyv-border-light);
}

/* Overview cards */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--iflyv-spacing-3);
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--iflyv-spacing-3) var(--iflyv-spacing-2);
  background: var(--iflyv-bg-panel);
  border-radius: var(--iflyv-radius-smallmodule);
  border: 1px solid var(--iflyv-border-light);

  &__value {
    font-size: 24px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    line-height: 1.2;
  }

  &__unit {
    font-size: 14px;
    font-weight: 500;
    color: var(--iflyv-text-3);
  }

  &__label {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
  }

  &--accent {
    background: var(--iflyv-brand-bg);
    border-color: rgba(54, 88, 255, 0.12);

    .stat-card__value {
      color: var(--iflyv-brand-primary);
    }
  }
}

/* Detail sections */
.stats-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--iflyv-spacing-4);
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-3);

  &__header {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__title {
    font: var(--iflyv-font-body-sub);
    font-weight: 600;
    color: var(--iflyv-text-1);
  }

  &__sub {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-4);
  }
}

.coverage-bars {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);
}

.coverage-row {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);

  &__name {
    width: 110px;
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
    text-align: right;
  }

  &__bar-wrap {
    flex: 1;
    height: 6px;
    background: var(--iflyv-border-light);
    border-radius: 3px;
    overflow: hidden;
    min-width: 40px;
  }

  &__bar {
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);

    &.level--high { background: var(--iflyv-success-primary); }
    &.level--mid { background: var(--iflyv-warning-primary); }
    &.level--low { background: var(--iflyv-text-4); }
  }

  &__val {
    width: 36px;
    font: var(--iflyv-font-label-primary);
    font-weight: 700;
    text-align: right;
    flex-shrink: 0;

    &.level--high { color: var(--iflyv-success-primary); }
    &.level--mid { color: var(--iflyv-warning-primary); }
    &.level--low { color: var(--iflyv-text-4); }
  }

  &__count {
    width: 48px;
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-4);
    flex-shrink: 0;
  }
}

/* Distribution */
.stats-distribution {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);
  padding: var(--iflyv-spacing-3) var(--iflyv-spacing-4);
  background: var(--iflyv-bg-panel);
  border-radius: var(--iflyv-radius-smallmodule);
  border: 1px solid var(--iflyv-border-light);

  &__title {
    font: var(--iflyv-font-body-sub);
    font-weight: 600;
    color: var(--iflyv-text-1);
  }

  &__bars {
    display: flex;
    flex-direction: column;
    gap: var(--iflyv-spacing-2);
  }
}

.dist-bar {
  position: relative;
  height: 28px;
  background: var(--iflyv-bg-inset);
  border-radius: 4px;
  overflow: hidden;

  &__fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);

    &--high { background: rgba(34, 197, 94, 0.15); }
    &--mid { background: rgba(245, 166, 35, 0.15); }
    &--low { background: rgba(139, 143, 163, 0.15); }
  }

  &__label {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 0 var(--iflyv-spacing-3);
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-2);

    b {
      margin-left: auto;
      font-weight: 700;
      color: var(--iflyv-text-1);
    }
  }
}

.coverage-info-icon {
  color: var(--iflyv-text-4);
  cursor: pointer;
  vertical-align: middle;
  margin-left: 2px;
  transition: color 0.15s;

  &:hover {
    color: var(--iflyv-brand-primary);
  }
}

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
