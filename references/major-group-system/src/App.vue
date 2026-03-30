<template>
  <!-- ============ 首页：全屏无侧边栏 ============ -->
  <div v-if="currentPage === 'home'" class="page-home">
    <SystemMap @enter-major="handleEnterMajor" />
  </div>

  <!-- ============ 专业详情页：顶栏 + 侧栏 + 内容 ============ -->
  <div v-else class="page-major">
    <!-- 顶部导航栏 -->
    <header class="topbar">
      <div class="topbar__left">
        <button class="topbar__back" @click="goHome">
          <ArrowLeft :size="18" :stroke-width="2" />
        </button>
        <div class="topbar__divider" />
        <div class="topbar__brand" @click="goHome">
          <BarChart3 :size="16" :stroke-width="2" />
          <span>专业群建设</span>
        </div>
        <div class="topbar__divider" />
        <span class="topbar__major-name">{{ currentMajorName }}</span>
      </div>
      <div class="topbar__right">
        <div class="topbar__user">
          <div class="topbar__avatar">管</div>
          <span class="topbar__username">管理员</span>
        </div>
      </div>
    </header>

    <div class="page-body">
      <!-- 左侧导航 -->
      <aside class="sidebar">
        <!-- 我的专业 -->
        <div class="nav-section">
          <div class="nav-section__label">
            <Star :size="14" :stroke-width="2" />
            <span>我的专业</span>
          </div>
          <a
            class="nav-major"
            :class="{ 'nav-major--active': selectedMajorId === MY_MAJOR_ID }"
            @click="selectedMajorId = MY_MAJOR_ID"
          >
            {{ myMajor?.name }}
          </a>
        </div>

        <!-- 专业群其他专业 -->
        <div class="nav-section">
          <div class="nav-section__label">
            <Layers :size="14" :stroke-width="2" />
            <span>专业群其他专业</span>
          </div>
          <a
            v-for="major in otherMajors"
            :key="major.id"
            class="nav-major"
            :class="{ 'nav-major--active': selectedMajorId === major.id }"
            @click="selectedMajorId = major.id"
          >
            {{ major.name }}
          </a>
        </div>
      </aside>

      <!-- 内容区 -->
      <main class="major-content">
        <div class="major-content__inner">
          <MajorDetail :major-id="selectedMajorId" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, BarChart3, Star, Layers } from 'lucide-vue-next'
import { colleges } from './data/majors'
import MajorDetail from './components/MajorDetail.vue'
import SystemMap from './components/SystemMap.vue'

const MY_MAJOR_ID = 'm1'
const MY_COLLEGE_ID = 'c1'

const currentPage = ref<'home' | 'major'>('home')
const selectedMajorId = ref(MY_MAJOR_ID)

const myCollege = computed(() => colleges.find(c => c.id === MY_COLLEGE_ID))
const myMajor = computed(() => myCollege.value?.majors.find(m => m.id === MY_MAJOR_ID))
const otherMajors = computed(() =>
  myCollege.value?.majors.filter(m => m.id !== MY_MAJOR_ID) || []
)

const currentMajorName = computed(() => {
  for (const college of colleges) {
    const major = college.majors.find(m => m.id === selectedMajorId.value)
    if (major) return `${college.name} · ${major.name}`
  }
  return ''
})

function goHome() {
  currentPage.value = 'home'
}

function handleEnterMajor() {
  currentPage.value = 'major'
}
</script>

<style scoped lang="scss">
/* ====== 首页 ====== */
.page-home {
  min-height: 100vh;
  background: var(--iflyv-bg-page);
  overflow-y: auto;
}

/* ====== 专业详情页 ====== */
.page-major {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--iflyv-bg-page);
}

/* ====== 顶栏 ====== */
.topbar {
  flex-shrink: 0;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--iflyv-spacing-5);
  background: var(--iflyv-bg-panel);
  border-bottom: 1px solid var(--iflyv-border-light);
  z-index: 10;

  &__left {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-3);
  }

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
    transition: all 0.15s ease;

    &:hover {
      border-color: var(--iflyv-border-dark);
      color: var(--iflyv-text-1);
      background: var(--iflyv-bg-inset);
    }
  }

  &__divider {
    width: 1px;
    height: 20px;
    background: var(--iflyv-border-light);
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--iflyv-text-3);
    font-size: 13px;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
      color: var(--iflyv-brand-primary);
    }
  }

  &__major-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--iflyv-text-1);
  }

  &__right {
    display: flex;
    align-items: center;
  }

  &__user {
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

  &__username {
    font-size: 13px;
    color: var(--iflyv-text-2);
  }
}

/* ====== 页面主体 ====== */
.page-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ====== 侧栏 ====== */
.sidebar {
  width: 200px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-4);
  padding: var(--iflyv-spacing-4) var(--iflyv-spacing-3);
  background: var(--iflyv-bg-panel);
  border-right: 1px solid var(--iflyv-border-light);
  overflow-y: auto;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &__label {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px var(--iflyv-spacing-2);
    font-size: 11px;
    font-weight: 600;
    color: var(--iflyv-text-4);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    user-select: none;
  }
}

.nav-major {
  display: block;
  padding: 8px var(--iflyv-spacing-3);
  padding-left: 28px;
  border-radius: var(--iflyv-radius-smallmodule);
  font-size: 13px;
  color: var(--iflyv-text-3);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  user-select: none;
  position: relative;

  &:hover {
    background: var(--iflyv-bg-inset);
    color: var(--iflyv-text-1);
  }

  &--active {
    color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
    font-weight: 500;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 18px;
      border-radius: 0 3px 3px 0;
      background: var(--iflyv-brand-primary);
    }

    &:hover {
      background: var(--iflyv-brand-bg);
    }
  }
}

/* ====== 内容区 ====== */
.major-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--iflyv-spacing-4);

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--iflyv-bg-panel);
    border-radius: var(--iflyv-radius-page);
    padding: var(--iflyv-spacing-7) var(--iflyv-spacing-6);
    min-height: 100%;
  }
}
</style>
