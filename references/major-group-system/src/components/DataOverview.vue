<template>
  <div class="data-overview">
    <!-- ====== 默认总览视图 ====== -->
    <template v-if="!majorFilter">
      <h2 class="data-overview__title">数据总览</h2>
      <p class="data-overview__desc">全国高职专业大类数据一览，覆盖 19 个专业大类</p>

      <!-- 汇总统计 -->
      <div class="summary-cards">
        <div v-for="s in summaryStats" :key="s.label" class="summary-card" :style="{ '--sc': s.color, '--sbg': s.bg }">
          <div class="summary-card__icon">
            <component :is="s.icon" :size="20" :stroke-width="1.8" />
          </div>
          <div class="summary-card__info">
            <div class="summary-card__number">{{ s.number }}</div>
            <div class="summary-card__label">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- 专业大类卡片网格 -->
      <div class="category-section">
        <h3 class="category-section__title">
          <Layers :size="16" :stroke-width="2" />
          专业大类概览
          <span class="category-section__count">{{ categories.length }} 个大类</span>
        </h3>
        <div class="category-grid">
          <div
            v-for="cat in categoryCards"
            :key="cat.id"
            class="category-card"
            :style="{ '--cc': cat.color }"
            @click="selectFirstMajor(cat)"
          >
            <div class="category-card__header">
              <span class="category-card__dot" />
              <span class="category-card__name">{{ cat.name }}</span>
              <span class="category-card__badge">{{ cat.majorCount }} 个专业</span>
            </div>
            <div class="category-card__stats">
              <div class="category-card__stat">
                <span class="category-card__stat-num">{{ cat.policyCount }}</span>
                <span class="category-card__stat-label">相关政策</span>
              </div>
              <div class="category-card__stat">
                <span class="category-card__stat-num">{{ cat.standardCount }}</span>
                <span class="category-card__stat-label">教学标准</span>
              </div>
              <div class="category-card__stat">
                <span class="category-card__stat-num">{{ cat.planCount }}</span>
                <span class="category-card__stat-label">方案收录</span>
              </div>
            </div>
            <div class="category-card__majors">
              <span v-for="m in cat.topMajors" :key="m" class="category-card__major-tag">{{ m }}</span>
              <span v-if="cat.majorCount > 3" class="category-card__more">+{{ cat.majorCount - 3 }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ====== 专业详情视图 ====== -->
    <template v-else>
      <div class="detail-header">
        <button class="detail-header__back" @click="$emit('clear-filter')">
          <ChevronLeft :size="16" :stroke-width="2" />
        </button>
        <div>
          <h2 class="data-overview__title">{{ selectedMajorName }}</h2>
          <p class="data-overview__desc">专业代码 {{ majorFilter }} · {{ selectedCategoryName }}</p>
        </div>
      </div>

      <!-- 专业统计卡片 -->
      <div class="stat-cards">
        <div v-for="stat in majorStats" :key="stat.label" class="stat-card" :style="{ '--sc': stat.color, '--sbg': stat.bg }">
          <div class="stat-card__icon">
            <component :is="stat.icon" :size="20" :stroke-width="1.8" />
          </div>
          <div class="stat-card__info">
            <div class="stat-card__number">{{ stat.number }}</div>
            <div class="stat-card__label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- 数据分类 -->
      <div class="data-sections">
        <div v-for="section in majorSections" :key="section.title" class="data-section">
          <div class="data-section__header" @click="section.expanded = !section.expanded">
            <component :is="section.icon" :size="16" :stroke-width="2" :style="{ color: section.color }" />
            <span class="data-section__title">{{ section.title }}</span>
            <span class="data-section__count">{{ section.items.length }} 项</span>
            <ChevronRight :size="14" :stroke-width="2" class="data-section__arrow" :class="{ 'data-section__arrow--open': section.expanded }" />
          </div>
          <div v-if="section.expanded" class="data-section__body">
            <div v-for="item in section.items" :key="item.name" class="data-item">
              <FileText :size="14" :stroke-width="1.8" class="data-item__icon" />
              <span class="data-item__name">{{ item.name }}</span>
              <div class="data-item__tags">
                <span v-for="tag in item.tags" :key="tag" class="data-item__tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, markRaw } from 'vue'
import {
  FileText, ChevronRight, ChevronLeft, ClipboardList, Landmark, BookOpen,
  BarChart3, Layers, GraduationCap, Award, Users, Briefcase
} from 'lucide-vue-next'

interface MajorCategoryItem { code: string; name: string }
interface MajorCategory { id: string; name: string; children: MajorCategoryItem[] }

const props = defineProps<{
  majorFilter?: string
  categories: MajorCategory[]
}>()

defineEmits<{
  'clear-filter': []
}>()

// ====== 总览视图数据 ======

const summaryStats = [
  { icon: markRaw(Layers), number: 19, label: '专业大类', color: '#6366F1', bg: '#EEF2FF' },
  { icon: markRaw(GraduationCap), number: 744, label: '高职专业', color: '#3B82F6', bg: '#EFF6FF' },
  { icon: markRaw(ClipboardList), number: 86, label: '相关政策', color: '#059669', bg: '#ECFDF5' },
  { icon: markRaw(BookOpen), number: 758, label: '教学标准', color: '#E67E22', bg: '#FEF6EC' },
  { icon: markRaw(Award), number: 132, label: '1+X 证书', color: '#EC4899', bg: '#FDF2F8' },
  { icon: markRaw(Users), number: 1572, label: '院校开设', color: '#8B5CF6', bg: '#F5F3FF' },
]

// 为每个大类生成模拟统计数据
const categoryColorMap: Record<string, string> = {
  'cat-01': '#16A34A', 'cat-02': '#7C3AED', 'cat-03': '#EA580C', 'cat-04': '#2563EB',
  'cat-05': '#0891B2', 'cat-06': '#DC2626', 'cat-07': '#059669', 'cat-08': '#D946EF',
  'cat-09': '#CA8A04', 'cat-10': '#4F46E5', 'cat-11': '#3658FF', 'cat-12': '#E11D48',
  'cat-13': '#0D9488', 'cat-14': '#F59E0B', 'cat-15': '#9333EA', 'cat-16': '#06B6D4',
  'cat-17': '#10B981', 'cat-18': '#64748B', 'cat-19': '#6366F1',
}

// 模拟统计数据种子
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const categoryCards = computed(() =>
  props.categories.map((cat, i) => ({
    id: cat.id,
    name: cat.name.replace('大类', ''),
    color: categoryColorMap[cat.id] || '#6366F1',
    majorCount: cat.children.length,
    policyCount: Math.floor(seededRandom(i * 7 + 1) * 8) + 2,
    standardCount: cat.children.length * 3,
    planCount: Math.floor(seededRandom(i * 7 + 3) * 20) + 5,
    topMajors: cat.children.slice(0, 3).map(m => m.name),
  }))
)

function selectFirstMajor(cat: { id: string }) {
  const category = props.categories.find(c => c.id === cat.id)
  if (category && category.children.length > 0) {
    // Nothing to do here — user selects from sidebar
  }
}

// ====== 专业详情视图数据 ======

const selectedMajorName = computed(() => {
  for (const cat of props.categories) {
    const m = cat.children.find(c => c.code === props.majorFilter)
    if (m) return m.name
  }
  return props.majorFilter || ''
})

const selectedCategoryName = computed(() => {
  for (const cat of props.categories) {
    if (cat.children.some(c => c.code === props.majorFilter)) {
      return cat.name
    }
  }
  return ''
})

// 根据专业代码生成模拟统计
const majorStats = computed(() => {
  const code = props.majorFilter || ''
  const seed = code.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return [
    { icon: markRaw(Landmark), number: Math.floor(seededRandom(seed + 1) * 3) + 1, label: '教学标准', color: '#3B82F6', bg: '#EFF6FF' },
    { icon: markRaw(ClipboardList), number: Math.floor(seededRandom(seed + 2) * 6) + 3, label: '相关政策', color: '#6366F1', bg: '#EEF2FF' },
    { icon: markRaw(BookOpen), number: Math.floor(seededRandom(seed + 3) * 15) + 5, label: '人培方案', color: '#059669', bg: '#ECFDF5' },
    { icon: markRaw(Briefcase), number: Math.floor(seededRandom(seed + 4) * 12) + 4, label: '对口岗位', color: '#E67E22', bg: '#FEF6EC' },
    { icon: markRaw(Award), number: Math.floor(seededRandom(seed + 5) * 8) + 2, label: '职业证书', color: '#EC4899', bg: '#FDF2F8' },
    { icon: markRaw(Users), number: Math.floor(seededRandom(seed + 6) * 200) + 50, label: '开设院校', color: '#8B5CF6', bg: '#F5F3FF' },
  ]
})

// 根据专业名生成模拟文档列表
const majorSections = computed(() => {
  const name = selectedMajorName.value
  return reactive([
    {
      title: '教学标准',
      icon: markRaw(Landmark),
      color: '#3B82F6',
      expanded: true,
      items: [
        { name: `${name}专业教学标准（高等职业教育专科）`, tags: ['教学标准', '2025-02'] },
        { name: `${name}专业实训教学条件建设标准`, tags: ['实训标准', '2025-02'] },
        { name: `${name}专业顶岗实习标准`, tags: ['实习标准', '2025-02'] },
      ],
    },
    {
      title: '相关政策',
      icon: markRaw(ClipboardList),
      color: '#6366F1',
      expanded: false,
      items: [
        { name: '教育部关于做好2026年职业教育拟招生专业设置管理工作的通知', tags: ['政策文件', '2026-01'] },
        { name: '教育部关于印发《职业教育教科研三年行动计划（2025-2027年）》的通知', tags: ['政策文件', '2025-06'] },
        { name: '教育部关于公布2025年高等职业教育专科专业设置备案和审批结果的通知', tags: ['政策文件', '2025-03'] },
        { name: '教育部关于印发758项新修（制）订职业教育专业教学标准的通知', tags: ['政策文件', '2025-02'] },
        { name: '教育部 财政部关于实施中国特色高水平高职学校和专业建设计划的通知', tags: ['政策文件', '2025-01'] },
      ],
    },
    {
      title: '人才培养方案',
      icon: markRaw(BookOpen),
      color: '#059669',
      expanded: false,
      items: [
        { name: `${name} — 深圳信息职业技术学院`, tags: ['2025级', '广东省'] },
        { name: `${name} — 杭州职业技术学院`, tags: ['2025级', '浙江省'] },
        { name: `${name} — 南京信息职业技术学院`, tags: ['2025级', '江苏省'] },
        { name: `${name} — 成都职业技术学院`, tags: ['2025级', '四川省'] },
        { name: `${name} — 北京电子科技职业学院`, tags: ['2024级', '北京市'] },
      ],
    },
    {
      title: '岗课证赛',
      icon: markRaw(BarChart3),
      color: '#E67E22',
      expanded: false,
      items: [
        { name: `${name}相关职业技能等级证书（1+X）`, tags: ['证书', '中级/高级'] },
        { name: `全国职业院校技能大赛·${name}赛项`, tags: ['竞赛', '国赛'] },
        { name: `${name}方向典型岗位群`, tags: ['岗位', '高需求'] },
      ],
    },
  ])
})
</script>

<style scoped lang="scss">
.data-overview {
  &__title {
    font-size: 20px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    margin: 0 0 4px;
  }

  &__desc {
    font-size: 14px;
    color: var(--iflyv-text-3);
    margin: 0 0 var(--iflyv-spacing-5);
  }
}

// ====== 总览统计卡片 ======
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--iflyv-spacing-3);
  margin-bottom: var(--iflyv-spacing-6);
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: var(--iflyv-bg-panel);
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-page);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: var(--iflyv-radius-smallmodule);
    background: var(--sbg);
    color: var(--sc);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__number {
    font-size: 22px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    line-height: 1.2;
  }

  &__label {
    font-size: 12px;
    color: var(--iflyv-text-3);
  }
}

// ====== 专业大类区域 ======
.category-section {
  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    margin: 0 0 var(--iflyv-spacing-4);
  }

  &__count {
    font-size: 12px;
    font-weight: 400;
    color: var(--iflyv-text-4);
    margin-left: auto;
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--iflyv-spacing-3);
}

.category-card {
  padding: 16px 18px;
  background: var(--iflyv-bg-panel);
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-page);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: color-mix(in srgb, var(--cc) 30%, transparent);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--cc);
    flex-shrink: 0;
  }

  &__name {
    font-size: 14px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    flex: 1;
  }

  &__badge {
    font-size: 11px;
    color: var(--cc);
    background: color-mix(in srgb, var(--cc) 10%, transparent);
    padding: 2px 8px;
    border-radius: 10px;
    flex-shrink: 0;
  }

  &__stats {
    display: flex;
    gap: var(--iflyv-spacing-4);
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--iflyv-border-light);
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__stat-num {
    font-size: 16px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    line-height: 1.2;
  }

  &__stat-label {
    font-size: 11px;
    color: var(--iflyv-text-4);
  }

  &__majors {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  &__major-tag {
    font-size: 11px;
    color: var(--iflyv-text-3);
    background: var(--iflyv-bg-inset);
    padding: 2px 8px;
    border-radius: 4px;
  }

  &__more {
    font-size: 11px;
    color: var(--iflyv-text-4);
    padding: 2px 6px;
  }
}

// ====== 专业详情头部 ======
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: var(--iflyv-spacing-2);

  &__back {
    width: 32px;
    height: 32px;
    border-radius: var(--iflyv-radius-smallmodule);
    border: 1px solid var(--iflyv-border-light);
    background: var(--iflyv-bg-panel);
    color: var(--iflyv-text-2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;

    &:hover {
      background: var(--iflyv-bg-inset);
      color: var(--iflyv-brand-primary);
      border-color: var(--iflyv-brand-primary);
    }
  }
}

// ====== 专业统计卡片 ======
.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--iflyv-spacing-3);
  margin-bottom: var(--iflyv-spacing-5);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--iflyv-bg-panel);
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-page);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &__icon {
    width: 38px;
    height: 38px;
    border-radius: var(--iflyv-radius-smallmodule);
    background: var(--sbg);
    color: var(--sc);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__number {
    font-size: 20px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    line-height: 1.2;
  }

  &__label {
    font-size: 12px;
    color: var(--iflyv-text-3);
  }
}

// ====== 数据分类 ======
.data-sections {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-3);
}

.data-section {
  background: var(--iflyv-bg-panel);
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-page);
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    cursor: pointer;
    transition: background 0.15s;

    &:hover { background: var(--iflyv-bg-inset); }
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    flex: 1;
  }

  &__count {
    font-size: 12px;
    color: var(--iflyv-text-4);
    background: var(--iflyv-bg-inset);
    padding: 2px 8px;
    border-radius: 10px;
  }

  &__arrow {
    color: var(--iflyv-text-4);
    transition: transform 0.2s;

    &--open { transform: rotate(90deg); }
  }

  &__body {
    border-top: 1px solid var(--iflyv-border-light);
    padding: 8px 0;
  }
}

.data-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  transition: background 0.15s;
  cursor: pointer;

  &:hover { background: var(--iflyv-bg-inset); }

  &__icon { color: var(--iflyv-text-4); flex-shrink: 0; }

  &__name {
    flex: 1;
    font-size: 13px;
    color: var(--iflyv-text-2);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__tags {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  &__tag {
    padding: 2px 8px;
    background: var(--iflyv-bg-inset);
    border-radius: 4px;
    font-size: 11px;
    color: var(--iflyv-text-4);
  }
}
</style>
