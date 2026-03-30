<template>
  <div class="sankey-wrap">
    <!-- 顶部分类标题栏 -->
    <div class="sankey-header">
      <span v-for="col in columns" :key="col.name" class="sankey-header__item" :style="{ color: col.color }">
        <span class="sankey-header__dot" :style="{ background: col.color }" />
        {{ col.name }}
      </span>
    </div>
    <v-chart :option="chartOption" autoresize class="sankey-chart" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { SankeyChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { JobMatch } from '../data/majors'

use([SankeyChart, TooltipComponent, CanvasRenderer])

const props = defineProps<{
  jobs: JobMatch[]
  majorName: string
}>()

const colColors: Record<string, string> = {
  '产业链': '#3658FF',
  '产业': '#A855F7',
  '岗位': '#22C55E',
  '课程': '#F5A623',
  '专业': '#EF4444',
}

const columns = [
  { name: '产业链', color: colColors['产业链'] },
  { name: '产业', color: colColors['产业'] },
  { name: '岗位', color: colColors['岗位'] },
  { name: '课程', color: colColors['课程'] },
  { name: '专业', color: colColors['专业'] },
]

// 岗位所属产业（按 category 归类）
const categoryToIndustry: Record<string, string> = {
  '技术开发': '智能终端制造',
  '硬件设计': 'PCB与电路板',
  '质量检测': '电子检测服务',
  '系统集成': '物联网应用',
  '产品管理': '智能终端制造',
  '运维服务': '系统集成服务',
  '人工智能': 'AI与边缘计算',
}

// 产业所属产业链
const industryToChain: Record<string, string> = {
  '智能终端制造': '电子信息制造',
  'PCB与电路板': '电子信息制造',
  '电子检测服务': '电子信息制造',
  '物联网应用': '信息技术服务',
  '系统集成服务': '信息技术服务',
  'AI与边缘计算': '信息技术服务',
}

// 岗位 → 核心课程
const jobCourseMap: Record<string, string[]> = {
  '嵌入式软件工程师': ['单片机原理与应用', '嵌入式系统开发', 'C语言程序设计'],
  'PCB设计工程师': ['PCB设计与制作', '模拟电子技术', '电路分析基础'],
  '电子产品测试工程师': ['传感器与检测技术', '电子产品生产工艺'],
  '物联网系统集成工程师': ['通信原理与应用', '物联网系统集成', '传感器与检测技术'],
  'FPGA开发工程师': ['数字电子技术', 'EDA技术与FPGA应用'],
  '智能终端产品经理': ['电子产品生产工艺', '创新创业实践'],
  '电子设备运维工程师': ['电路分析基础', '通信原理与应用'],
  'AI边缘计算工程师': ['AI边缘计算实训', 'Python与数据分析', '机器学习与智能算法'],
}

const chartOption = computed(() => {
  const nodes: { name: string; itemStyle: { color: string; borderColor: string } }[] = []
  const links: { source: string; target: string; value: number }[] = []
  const added = new Set<string>()

  function addNode(name: string, col: string) {
    if (added.has(name)) return
    added.add(name)
    nodes.push({
      name,
      itemStyle: { color: colColors[col], borderColor: 'transparent' },
    })
  }

  addNode(props.majorName, '专业')

  const usedChains = new Set<string>()
  const courseSet = new Set<string>()

  for (const job of props.jobs) {
    addNode(job.name, '岗位')

    const industry = categoryToIndustry[job.category] || job.category
    addNode(industry, '产业')
    links.push({ source: industry, target: job.name, value: 2 })

    const chain = industryToChain[industry] || '电子信息制造'
    if (!usedChains.has(`${chain}-${industry}`)) {
      addNode(chain, '产业链')
      links.push({ source: chain, target: industry, value: 2 })
      usedChains.add(`${chain}-${industry}`)
    }

    const courses = jobCourseMap[job.name] || job.skills.slice(0, 2)
    for (const course of courses) {
      addNode(course, '课程')
      courseSet.add(course)
      links.push({ source: job.name, target: course, value: 1 })
    }
  }

  for (const course of courseSet) {
    links.push({ source: course, target: props.majorName, value: 1 })
  }

  return {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter(params: any) {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}`
        }
        return `<b>${params.name}</b>`
      },
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        left: 40,
        right: 40,
        top: 10,
        bottom: 20,
        nodeWidth: 18,
        nodeGap: 14,
        layoutIterations: 0,
        orient: 'horizontal',
        draggable: false,
        label: {
          show: true,
          fontSize: 12,
          color: '#151515',
          fontWeight: 500,
          position: 'right',
        },
        lineStyle: {
          color: 'gradient',
          opacity: 0.25,
          curveness: 0.5,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { opacity: 0.6 },
        },
        data: nodes,
        links,
        levels: [
          { depth: 0, label: { position: 'right' } },
          { depth: 1, label: { position: 'right' } },
          { depth: 2, label: { position: 'right' } },
          { depth: 3, label: { position: 'left' } },
          { depth: 4, label: { position: 'left' } },
        ],
      },
    ],
  }
})
</script>

<style scoped lang="scss">
.sankey-wrap {
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  padding: var(--iflyv-spacing-3);
  display: flex;
  flex-direction: column;
  gap: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.sankey-header {
  display: flex;
  justify-content: space-between;
  padding: var(--iflyv-spacing-2) 40px;
  border-bottom: 1px solid var(--iflyv-border-light);
  margin-bottom: var(--iflyv-spacing-1);

  &__item {
    display: inline-flex;
    align-items: center;
    gap: var(--iflyv-spacing-1);
    font: var(--iflyv-font-body-sub);
    font-weight: 600;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: var(--iflyv-radius-full);
    flex-shrink: 0;
  }
}

.sankey-chart {
  width: 100%;
  height: 480px;
}
</style>
