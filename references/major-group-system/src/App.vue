<template>
  <!-- ============ 首页：全屏独立 ============ -->
  <div v-if="currentPage === 'home'" class="page-home">
    <SystemMap @navigate="handleNavigate" />
  </div>

  <!-- ============ 二级页面：图标栏 + 子菜单 + 内容 ============ -->
  <div v-else class="page-major">
    <!-- 左侧图标导航栏 -->
    <nav class="icon-rail">
      <a
        class="icon-rail__item"
        @click="goHome"
      >
        <div class="icon-rail__icon"><Home :size="20" :stroke-width="1.6" /></div>
        <span class="icon-rail__label">首页</span>
      </a>
      <a
        v-for="nav in railItems"
        :key="nav.id"
        class="icon-rail__item"
        :class="{ 'icon-rail__item--active': activeRailId === nav.id }"
        @click="handleRailClick(nav)"
      >
        <div class="icon-rail__icon"><component :is="nav.icon" :size="20" :stroke-width="1.6" /></div>
        <span class="icon-rail__label">{{ nav.label }}</span>
      </a>
    </nav>

    <!-- 子菜单面板：专业管理 -->
    <aside v-if="currentPage === 'major-detail'" class="sub-menu">
      <div class="sub-menu__title">专业管理</div>

      <div class="sub-menu__section">我的专业</div>
      <a
        class="sub-menu__item"
        :class="{ 'sub-menu__item--active': selectedMajorId === MY_MAJOR_ID }"
        @click="selectedMajorId = MY_MAJOR_ID"
      >
        {{ myMajor?.name }}
      </a>

      <div class="sub-menu__section">专业群其他专业</div>
      <a
        v-for="major in otherMajors"
        :key="major.id"
        class="sub-menu__item"
        :class="{ 'sub-menu__item--active': selectedMajorId === major.id }"
        @click="selectedMajorId = major.id"
      >
        {{ major.name }}
      </a>
    </aside>

    <!-- 子菜单面板：数据概览 — 专业大类 -->
    <aside v-if="currentPage === 'data-stats'" class="sub-menu">
      <div class="sub-menu__title">专业大类</div>
      <div class="major-search">
        <Search :size="13" :stroke-width="2" class="major-search__icon" />
        <input
          v-model="statsSearchQuery"
          type="text"
          placeholder="搜索专业..."
          class="major-search__input"
        />
      </div>
      <a
        class="sub-menu__item"
        :class="{ 'sub-menu__item--active': selectedStatsMajorCode === '' }"
        @click="selectedStatsMajorCode = ''"
      >
        全部专业 (总览)
      </a>
      <div class="major-tree">
        <div
          v-for="cat in filteredMajorCategories"
          :key="cat.id"
          class="major-tree__group"
        >
          <div class="major-tree__college" @click="toggleStatsCategory(cat.id)">
            <ChevronRight
              :size="12"
              :stroke-width="2.5"
              class="major-tree__arrow"
              :class="{ 'major-tree__arrow--open': expandedStatsCategories.has(cat.id) }"
            />
            <span class="major-tree__college-name">{{ cat.name }}</span>
            <span class="major-tree__count">{{ cat.children.length }}</span>
          </div>
          <div v-if="expandedStatsCategories.has(cat.id)" class="major-tree__children">
            <a
              v-for="major in cat.children"
              :key="major.code"
              class="major-tree__major"
              :class="{ 'major-tree__major--active': selectedStatsMajorCode === major.code }"
              @click="selectedStatsMajorCode = major.code"
            >
              {{ major.name }}
            </a>
          </div>
        </div>
      </div>
    </aside>

    <!-- 子菜单面板：人培方案 — 专业目录 -->
    <aside v-if="currentPage === 'plan-mgmt'" class="sub-menu">
      <div class="sub-menu__title">专业目录</div>
      <div class="major-search">
        <Search :size="13" :stroke-width="2" class="major-search__icon" />
        <input
          v-model="majorSearchQuery"
          type="text"
          placeholder="搜索专业..."
          class="major-search__input"
        />
      </div>
      <div class="major-tree">
        <div
          v-for="college in filteredOrgData"
          :key="college.id"
          class="major-tree__group"
        >
          <div class="major-tree__college" @click="toggleCollege(college.id)">
            <ChevronRight
              :size="12"
              :stroke-width="2.5"
              class="major-tree__arrow"
              :class="{ 'major-tree__arrow--open': expandedColleges.has(college.id) }"
            />
            <span class="major-tree__college-name">{{ college.name }}</span>
          </div>
          <div v-if="expandedColleges.has(college.id)" class="major-tree__children">
            <a
              v-for="major in college.children"
              :key="major.code"
              class="major-tree__major"
              :class="{ 'major-tree__major--active': selectedPlanMajorCode === major.code }"
              @click="selectedPlanMajorCode = major.code"
            >
              {{ major.name }}
            </a>
          </div>
        </div>
      </div>
    </aside>

    <!-- 右侧主区域 -->
    <div class="main-area">
      <!-- 面包屑导航 -->
      <header class="breadcrumb-bar">
        <nav class="breadcrumb">
          <a class="breadcrumb__item breadcrumb__item--link" @click="goHome">系统首页</a>
          <ChevronRight :size="14" :stroke-width="2" class="breadcrumb__sep" />
          <span class="breadcrumb__item breadcrumb__item--link" @click="currentPage = 'major-detail'">专业建设中心</span>
          <ChevronRight :size="14" :stroke-width="2" class="breadcrumb__sep" />
          <span class="breadcrumb__item">{{ currentPageTitle }}</span>
        </nav>
        <div class="breadcrumb-bar__right">
          <div class="user-badge">
            <div class="user-badge__avatar">管</div>
            <span class="user-badge__name">管理员</span>
          </div>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="major-content" :class="{ 'major-content--full': currentPage === 'plan-research' }">
        <PlanResearch v-if="currentPage === 'plan-research'" />
        <div v-else class="major-content__inner">
          <MajorDetail v-if="currentPage === 'major-detail'" :major-id="selectedMajorId" />
          <PlanManagement v-else-if="currentPage === 'plan-mgmt'" :major-filter="selectedPlanMajorCode" />
          <DataOverview v-else-if="currentPage === 'data-stats'" :major-filter="selectedStatsMajorCode" :categories="majorCategories" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { Home, ChevronRight, Settings, FileText, PieChart, Search, ClipboardPenLine } from 'lucide-vue-next'
import { colleges } from './data/majors'
import MajorDetail from './components/MajorDetail.vue'
import SystemMap from './components/SystemMap.vue'
import PlanManagement from './components/PlanManagement.vue'
import DataOverview from './components/DataOverview.vue'
import PlanResearch from './components/PlanResearch.vue'

type PageType = 'home' | 'major-detail' | 'plan-mgmt' | 'data-stats' | 'plan-research'

const MY_MAJOR_ID = 'm1'
const MY_COLLEGE_ID = 'c1'

const currentPage = ref<PageType>('home')
const selectedMajorId = ref(MY_MAJOR_ID)

const myCollege = computed(() => colleges.find(c => c.id === MY_COLLEGE_ID))
const myMajor = computed(() => myCollege.value?.majors.find(m => m.id === MY_MAJOR_ID))
const otherMajors = computed(() =>
  myCollege.value?.majors.filter(m => m.id !== MY_MAJOR_ID) || []
)

// 人培方案 — 专业目录树
interface OrgMajor { code: string; name: string }
interface OrgCollege { id: string; name: string; children: OrgMajor[] }

const orgData: OrgCollege[] = [
  {
    id: 'org-1', name: '人工智能学院', children: [
      { code: '610205', name: '软件技术' },
      { code: '510205', name: '大数据技术' },
      { code: '510206', name: '云计算技术应用' },
      { code: '510209', name: '人工智能技术应用' },
    ],
  },
  {
    id: 'org-2', name: '电子与通信工程学院', children: [
      { code: '510101', name: '电子信息工程技术' },
      { code: '510301', name: '现代通信技术' },
      { code: '510103', name: '应用电子技术' },
    ],
  },
  {
    id: 'org-3', name: '数字媒体学院', children: [
      { code: '510204', name: '数字媒体技术' },
      { code: '550102', name: '视觉传达设计' },
    ],
  },
]

// 数据概览 — 19 专业大类
const selectedStatsMajorCode = ref('')
const statsSearchQuery = ref('')
const expandedStatsCategories = ref(new Set(['cat-11'])) // 默认展开电子与信息大类

interface MajorCategoryItem { code: string; name: string }
interface MajorCategory { id: string; name: string; children: MajorCategoryItem[] }

const majorCategories: MajorCategory[] = [
  { id: 'cat-01', name: '农林牧渔大类', children: [
    { code: '410101', name: '作物生产与经营管理' }, { code: '410202', name: '园林技术' }, { code: '410303', name: '畜牧兽医' },
  ]},
  { id: 'cat-02', name: '资源环境与安全大类', children: [
    { code: '420301', name: '工程测量技术' }, { code: '420802', name: '环境监测技术' },
  ]},
  { id: 'cat-03', name: '能源动力与材料大类', children: [
    { code: '430105', name: '电力系统自动化技术' }, { code: '430301', name: '新能源装备技术' },
  ]},
  { id: 'cat-04', name: '土木建筑大类', children: [
    { code: '440301', name: '建筑工程技术' }, { code: '440501', name: '工程造价' }, { code: '440106', name: '建筑室内设计' },
  ]},
  { id: 'cat-05', name: '水利大类', children: [
    { code: '450201', name: '水利工程' }, { code: '450204', name: '水利水电建筑工程' },
  ]},
  { id: 'cat-06', name: '装备制造大类', children: [
    { code: '460103', name: '数控技术' }, { code: '460301', name: '机电一体化技术' },
    { code: '460305', name: '智能控制技术' }, { code: '460306', name: '工业机器人技术' },
    { code: '460303', name: '电气自动化技术' },
  ]},
  { id: 'cat-07', name: '生物与化工大类', children: [
    { code: '470104', name: '化工生物技术' }, { code: '470201', name: '应用化工技术' },
  ]},
  { id: 'cat-08', name: '轻工纺织大类', children: [
    { code: '480401', name: '现代纺织技术' }, { code: '480105', name: '化妆品技术' },
  ]},
  { id: 'cat-09', name: '食品药品与粮食大类', children: [
    { code: '490101', name: '食品智能加工技术' }, { code: '490301', name: '药品生产技术' },
  ]},
  { id: 'cat-10', name: '交通运输大类', children: [
    { code: '500113', name: '高速铁路客运服务' }, { code: '500211', name: '汽车检测与维修技术' },
    { code: '500606', name: '城市轨道交通运营管理' },
  ]},
  { id: 'cat-11', name: '电子与信息大类', children: [
    { code: '510101', name: '电子信息工程技术' }, { code: '510201', name: '计算机应用技术' },
    { code: '510203', name: '软件技术' }, { code: '510205', name: '大数据技术' },
    { code: '510206', name: '云计算技术应用' }, { code: '510207', name: '信息安全技术应用' },
    { code: '510209', name: '人工智能技术应用' }, { code: '510301', name: '现代通信技术' },
    { code: '510204', name: '数字媒体技术' }, { code: '510103', name: '应用电子技术' },
  ]},
  { id: 'cat-12', name: '医药卫生大类', children: [
    { code: '520201', name: '护理' }, { code: '520301', name: '药学' }, { code: '520601', name: '康复治疗技术' },
  ]},
  { id: 'cat-13', name: '财经商贸大类', children: [
    { code: '530302', name: '大数据与会计' }, { code: '530605', name: '市场营销' },
    { code: '530701', name: '电子商务' }, { code: '530802', name: '现代物流管理' },
  ]},
  { id: 'cat-14', name: '旅游大类', children: [
    { code: '540101', name: '旅游管理' }, { code: '540106', name: '酒店管理与数字化运营' },
  ]},
  { id: 'cat-15', name: '文化艺术大类', children: [
    { code: '550102', name: '视觉传达设计' }, { code: '550106', name: '环境艺术设计' },
    { code: '550113', name: '广告艺术设计' },
  ]},
  { id: 'cat-16', name: '新闻传播大类', children: [
    { code: '560204', name: '全媒体广告策划与营销' }, { code: '560213', name: '融媒体技术与运营' },
  ]},
  { id: 'cat-17', name: '教育与体育大类', children: [
    { code: '570102', name: '学前教育' }, { code: '570103', name: '小学教育' }, { code: '570110', name: '体育教育' },
  ]},
  { id: 'cat-18', name: '公安与司法大类', children: [
    { code: '580401', name: '法律事务' }, { code: '580101', name: '司法警务' },
  ]},
  { id: 'cat-19', name: '公共管理与服务大类', children: [
    { code: '590202', name: '人力资源管理' }, { code: '590302', name: '社区管理与服务' },
    { code: '590104', name: '社会工作' },
  ]},
]

function toggleStatsCategory(id: string) {
  if (expandedStatsCategories.value.has(id)) {
    expandedStatsCategories.value.delete(id)
  } else {
    expandedStatsCategories.value.add(id)
  }
}

const filteredMajorCategories = computed(() => {
  const q = statsSearchQuery.value.trim().toLowerCase()
  if (!q) return majorCategories
  return majorCategories
    .map(cat => ({
      ...cat,
      children: cat.children.filter(m =>
        m.name.toLowerCase().includes(q) || m.code.includes(q)
      ),
    }))
    .filter(cat => cat.children.length > 0 || cat.name.toLowerCase().includes(q))
})

const majorSearchQuery = ref('')
const expandedColleges = ref(new Set(['org-1']))
const selectedPlanMajorCode = ref('')

function toggleCollege(id: string) {
  if (expandedColleges.value.has(id)) {
    expandedColleges.value.delete(id)
  } else {
    expandedColleges.value.add(id)
  }
}

const filteredOrgData = computed(() => {
  const q = majorSearchQuery.value.trim().toLowerCase()
  if (!q) return orgData
  return orgData
    .map(college => ({
      ...college,
      children: college.children.filter(m =>
        m.name.toLowerCase().includes(q) || m.code.includes(q)
      ),
    }))
    .filter(college => college.children.length > 0)
})

// 图标栏
interface RailItem {
  id: string
  label: string
  icon: any
  page: PageType
}

const railItems: RailItem[] = [
  { id: 'major', label: '专业管理', icon: markRaw(Settings), page: 'major-detail' },
  { id: 'plan', label: '人培方案', icon: markRaw(FileText), page: 'plan-mgmt' },
  { id: 'research', label: '人培调研', icon: markRaw(ClipboardPenLine), page: 'plan-research' },
  { id: 'stats', label: '数据概览', icon: markRaw(PieChart), page: 'data-stats' },
]

const activeRailId = computed(() => {
  const found = railItems.find(r => r.page === currentPage.value)
  return found?.id || ''
})

function handleRailClick(nav: RailItem) {
  currentPage.value = nav.page
}

const pageTitleMap: Record<string, string> = {
  'major-detail': '专业管理',
  'plan-mgmt': '人培方案管理',
  'plan-research': '人培调研',
  'data-stats': '数据概览',
}

const currentPageTitle = computed(() => {
  if (currentPage.value === 'major-detail') {
    for (const college of colleges) {
      const major = college.majors.find(m => m.id === selectedMajorId.value)
      if (major) return `专业管理 / ${major.name}`
    }
  }
  return pageTitleMap[currentPage.value] || ''
})

function goHome() {
  currentPage.value = 'home'
}

function handleNavigate(page: string) {
  if (page === 'major-build') {
    currentPage.value = 'major-detail'
  } else if (page === 'research') {
    // 跳转到专业调研系统（demo-zj-mec 项目）
    window.open('http://localhost:5175/', '_blank')
  }
}
</script>

<style scoped lang="scss">
.page-home {
  min-height: 100vh;
  background: var(--iflyv-bg-page);
  overflow-y: auto;
}

.page-major {
  display: flex;
  height: 100vh;
  background: var(--iflyv-bg-page);
}

/* ====== 图标导航栏 ====== */
.icon-rail {
  width: 72px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 0;
  background: var(--iflyv-bg-panel);
  border-right: 1px solid var(--iflyv-border-light);

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 60px;
    padding: 10px 0 6px;
    border-radius: var(--iflyv-radius-smallmodule);
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
    position: relative;

    &:hover {
      background: var(--iflyv-bg-inset);
    }

    &--active {
      color: var(--iflyv-brand-primary);
      background: var(--iflyv-brand-bg);

      &::before {
        content: '';
        position: absolute;
        left: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        border-radius: 0 3px 3px 0;
        background: var(--iflyv-brand-primary);
      }

      &:hover {
        background: var(--iflyv-brand-bg);
      }
    }
  }

  &__icon {
    color: var(--iflyv-text-3);
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-rail__item--active & {
      color: var(--iflyv-brand-primary);
    }
  }

  &__label {
    font-size: 11px;
    color: var(--iflyv-text-3);
    font-weight: 500;
    line-height: 1;

    .icon-rail__item--active & {
      color: var(--iflyv-brand-primary);
      font-weight: 600;
    }
  }
}

/* ====== 子菜单面板 ====== */
.sub-menu {
  width: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 16px 10px;
  background: var(--iflyv-bg-panel);
  border-right: 1px solid var(--iflyv-border-light);
  overflow-y: auto;

  &__title {
    font-size: 15px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    padding: 4px 12px 12px;
    margin-bottom: 4px;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 9px 12px;
    border-radius: var(--iflyv-radius-smallmodule);
    font-size: 14px;
    color: var(--iflyv-text-2);
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;

    &:hover {
      background: var(--iflyv-bg-inset);
      color: var(--iflyv-text-1);
    }

    &--active {
      color: var(--iflyv-brand-primary);
      background: var(--iflyv-brand-bg);
      font-weight: 500;

      &:hover {
        background: var(--iflyv-brand-bg);
      }
    }
  }

  &__section {
    font-size: 11px;
    font-weight: 600;
    color: var(--iflyv-text-4);
    padding: 8px 12px 4px;
    letter-spacing: 0.3px;
    user-select: none;
  }
}

/* ====== 专业目录搜索 ====== */
.major-search {
  position: relative;
  margin: 0 4px 10px;

  &__icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--iflyv-text-4);
  }

  &__input {
    width: 100%;
    padding: 7px 10px 7px 30px;
    border: 1px solid var(--iflyv-border-light);
    border-radius: var(--iflyv-radius-smallmodule);
    font-size: 12px;
    outline: none;
    background: var(--iflyv-bg-page);
    color: var(--iflyv-text-1);
    transition: border-color 0.15s;
    box-sizing: border-box;

    &::placeholder { color: var(--iflyv-text-4); }

    &:focus {
      border-color: var(--iflyv-brand-primary);
    }
  }
}

/* ====== 专业目录树 ====== */
.major-tree {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &__group {
    margin-bottom: 2px;
  }

  &__college {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: var(--iflyv-radius-smallmodule);
    cursor: pointer;
    transition: background 0.15s;
    user-select: none;

    &:hover {
      background: var(--iflyv-bg-inset);
    }
  }

  &__arrow {
    color: var(--iflyv-text-4);
    transition: transform 0.2s;
    flex-shrink: 0;

    &--open {
      transform: rotate(90deg);
    }
  }

  &__college-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    line-height: 1.3;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__count {
    font-size: 11px;
    color: var(--iflyv-text-4);
    background: var(--iflyv-bg-inset);
    padding: 1px 6px;
    border-radius: 8px;
    flex-shrink: 0;
  }

  &__children {
    padding-left: 18px;
  }

  &__major {
    display: block;
    padding: 7px 10px;
    border-radius: var(--iflyv-radius-smallmodule);
    font-size: 13px;
    color: var(--iflyv-text-2);
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;

    &:hover {
      background: var(--iflyv-bg-inset);
      color: var(--iflyv-text-1);
    }

    &--active {
      color: var(--iflyv-brand-primary);
      background: var(--iflyv-brand-bg);
      font-weight: 500;

      &:hover {
        background: var(--iflyv-brand-bg);
      }
    }
  }
}

/* ====== 右侧主区域 ====== */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ====== 面包屑栏 ====== */
.breadcrumb-bar {
  flex-shrink: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--iflyv-spacing-5);
  background: var(--iflyv-bg-panel);
  border-bottom: 1px solid var(--iflyv-border-light);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;

  &__item {
    font-size: 14px;
    color: var(--iflyv-text-1);
    font-weight: 500;

    &--link {
      color: var(--iflyv-text-3);
      font-weight: 400;
      cursor: pointer;
      transition: color 0.15s;

      &:hover {
        color: var(--iflyv-brand-primary);
      }
    }
  }

  &__sep {
    color: var(--iflyv-text-4);
    flex-shrink: 0;
  }
}

.user-badge {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);
  padding: 4px 10px 4px 4px;
  border-radius: var(--iflyv-radius-full);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: var(--iflyv-bg-inset);
  }

  &__avatar {
    width: 28px;
    height: 28px;
    border-radius: var(--iflyv-radius-full);
    background: var(--iflyv-brand-bg);
    color: var(--iflyv-brand-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
  }

  &__name {
    font-size: 13px;
    color: var(--iflyv-text-2);
  }
}

/* ====== 内容区 ====== */
.major-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--iflyv-spacing-4);

  &--full {
    padding: 0;
    overflow: hidden;
  }

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--iflyv-bg-panel);
    border-radius: var(--iflyv-radius-page);
    padding: var(--iflyv-spacing-7) var(--iflyv-spacing-6);
    min-height: 100%;
  }
}

.embed-frame {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
