<template>
  <div class="home">
    <!-- ============ AI 问答入口 ============ -->
    <section class="ai-hero">
      <div class="ai-hero__greeting">
        <Sparkles :size="28" :stroke-width="1.6" class="ai-hero__star" />
        <h1 class="ai-hero__title">{{ greeting }}，有什么我可以帮你的？</h1>
      </div>
      <p class="ai-hero__desc">基于专业数据的智能问答，支持岗位分析、课程推荐、能力诊断、建设规划</p>

      <div class="ai-input" :class="{ 'ai-input--focus': inputFocused }">
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          class="ai-input__field"
          placeholder="问我任何关于专业建设的问题..."
          @focus="inputFocused = true"
          @blur="inputFocused = false"
          @keydown.enter="handleSend"
        />
        <button
          class="ai-input__send"
          :class="{ 'ai-input__send--active': query.trim() }"
          @click="handleSend"
        >
          <ArrowUp :size="18" :stroke-width="2" />
        </button>
      </div>

      <div class="ai-suggestions">
        <button
          v-for="s in suggestions"
          :key="s.text"
          class="suggestion-chip"
          @click="handleSuggestion(s.text)"
        >
          <component :is="s.icon" :size="14" :stroke-width="2" class="suggestion-chip__icon" />
          <span>{{ s.text }}</span>
        </button>
      </div>
    </section>

    <!-- ============ 功能模块 — 栅格卡片 ============ -->
    <section class="mod-grid">
      <div
        v-for="mod in modules"
        :key="mod.id"
        class="mod-card"
        :class="{ 'mod-card--hub': !mod.external }"
        :style="{ '--c': mod.color, '--bg': mod.bg }"
        @click="handleModuleClick(mod)"
      >
        <div class="mod-card__head">
          <div class="mod-card__icon">
            <component :is="mod.icon" :size="20" :stroke-width="1.8" />
          </div>
          <ExternalLink v-if="mod.external" :size="12" :stroke-width="2" class="mod-card__ext" />
        </div>
        <h3 class="mod-card__name">{{ mod.name }}</h3>
        <p class="mod-card__desc">{{ mod.description }}</p>
        <div class="mod-card__tags">
          <span v-for="t in mod.tags" :key="t" class="mod-tag">{{ t }}</span>
        </div>
        <div class="mod-card__footer">
          <div class="mod-card__stats">
            <span v-for="kv in mod.kvs" :key="kv.label" class="mod-kv">
              <strong>{{ kv.value }}</strong> {{ kv.label }}
            </span>
          </div>
          <div class="mod-card__action">
            <span>{{ mod.external ? '前往' : '进入' }}</span>
            <ArrowRight :size="14" :stroke-width="2" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import {
  Gem, Sparkles, Search, Network, Layers, BookMarked,
  ArrowRight, ArrowUp, ExternalLink,
  Briefcase, GraduationCap, BarChart3, Lightbulb,
} from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  enterMajor: []
}>()

/* ==== AI 问答 ==== */
const query = ref('')
const inputFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const suggestions = [
  { text: '嵌入式专业岗位匹配度分析', icon: markRaw(Briefcase) },
  { text: '推荐适合物联网方向的新课程', icon: markRaw(GraduationCap) },
  { text: '对比各专业核心能力覆盖率', icon: markRaw(BarChart3) },
  { text: '如何优化人才培养方案结构', icon: markRaw(Lightbulb) },
]

function handleSend() {
  if (!query.value.trim()) return
  ElMessage.info(`AI 超级问答即将上线，您的问题「${query.value}」已记录`)
  query.value = ''
}

function handleSuggestion(text: string) {
  query.value = text
  inputRef.value?.focus()
}

/* ==== 功能模块 ==== */
interface ModuleItem {
  id: string
  name: string
  icon: any
  color: string
  bg: string
  description: string
  tags: string[]
  kvs: { value: string; label: string }[]
  external?: boolean
  url?: string
}

const modules: ModuleItem[] = [
  {
    id: 'research',
    name: '专业调研',
    icon: markRaw(Search),
    color: '#6366F1',
    bg: '#EEF2FF',
    description: '洞察产业趋势与人才需求，为专业定位提供数据支撑',
    tags: ['政策解读', '产业报告', '岗位人才需求', '岗位能力图谱'],
    kvs: [{ value: '12', label: '调研报告' }, { value: '4', label: '产业方向' }],
    external: true,
    url: 'http://localhost:5174',
  },
  {
    id: 'job-cluster',
    name: '岗位群管理',
    icon: markRaw(Network),
    color: '#8B5CF6',
    bg: '#F5F3FF',
    description: '梳理岗位族群关系，构建岗位能力模型与职业发展路径',
    tags: ['岗位聚类', '能力模型', '职业路径', '技能标签'],
    kvs: [{ value: '8', label: '典型岗位' }, { value: '46', label: '能力标签' }],
    external: true,
    url: 'https://jobs.example.com',
  },
  {
    id: 'major-group',
    name: '专业群建设',
    icon: markRaw(Layers),
    color: '#3B82F6',
    bg: '#EFF6FF',
    description: '统筹专业群整体规划，管理共享课程池与资源矩阵',
    tags: ['专业群规划', '共享课程池', '资源矩阵'],
    kvs: [{ value: '4', label: '学院' }, { value: '14', label: '专业' }],
    external: true,
    url: 'https://group.example.com',
  },
  {
    id: 'major-build',
    name: '专业管理',
    icon: markRaw(Gem),
    color: '#3658FF',
    bg: '#F0F5FF',
    description: '以专业为单位构建岗位-课程-能力关联体系，驱动上下游数据流转',
    tags: ['岗位匹配', '课程地图', '能力图谱', 'AI推荐', '专业画像', '建设报告'],
    kvs: [{ value: '6', label: '功能模块' }, { value: '68', label: '关联课程' }],
  },
  {
    id: 'course',
    name: '课程管理',
    icon: markRaw(BookMarked),
    color: '#059669',
    bg: '#ECFDF5',
    description: '管理课程标准与教学资源，支撑教学全流程数字化',
    tags: ['课程标准', '教学设计', '考核方案', '资源建设'],
    kvs: [{ value: '68', label: '门课程' }, { value: '6', label: '学期覆盖' }],
    external: true,
    url: 'https://iflyvedcs.fifedu.com/vocational-mannage/courseCenter/list',
  },
]

function handleModuleClick(mod: ModuleItem) {
  if (mod.id === 'major-build') {
    emit('enterMajor')
    return
  }
  if (mod.external && mod.url) {
    window.open(mod.url, '_blank')
  }
}
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-6);
  padding: var(--iflyv-spacing-5) var(--iflyv-spacing-6) var(--iflyv-spacing-8);
  max-width: 1120px;
  margin: 0 auto;
  width: 100%;
}

/* ====================================================================
   AI 问答入口
   ==================================================================== */
.ai-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--iflyv-spacing-8) var(--iflyv-spacing-6) var(--iflyv-spacing-5);
  animation: fadeUp 0.5s ease both;

  &__greeting {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-3);
  }

  &__star {
    color: var(--iflyv-brand-primary);
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    margin: 0;
    letter-spacing: -0.3px;
    line-height: 1.4;
  }

  &__desc {
    margin: 8px 0 0;
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-3);
  }
}

.ai-input {
  margin-top: var(--iflyv-spacing-6);
  width: 100%;
  max-width: 640px;
  display: flex;
  align-items: center;
  background: var(--iflyv-bg-panel);
  border: 1px solid var(--iflyv-border-primary);
  border-radius: var(--iflyv-radius-page);
  padding: 4px 4px 4px 20px;
  transition: border-color 0.25s, box-shadow 0.25s;

  &--focus {
    border-color: var(--iflyv-brand-primary);
    box-shadow: 0 0 0 3px rgba(54, 88, 255, 0.08), 0 4px 20px -2px rgba(21, 21, 21, 0.06);
  }

  &__field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
    color: var(--iflyv-text-1);
    line-height: 1.5;
    padding: 10px 0;
    &::placeholder { color: var(--iflyv-text-4); }
  }

  &__send {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: var(--iflyv-radius-smallmodule);
    border: none;
    background: var(--iflyv-bg-inset);
    color: var(--iflyv-text-4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.15s;

    &--active {
      background: var(--iflyv-brand-primary);
      color: #fff;
      &:hover { transform: scale(1.06); }
    }
  }
}

.ai-suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: var(--iflyv-spacing-4);
  max-width: 680px;
}

.suggestion-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--iflyv-radius-full);
  border: 1px solid var(--iflyv-border-light);
  background: var(--iflyv-bg-panel);
  color: var(--iflyv-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &__icon { color: var(--iflyv-text-4); transition: color 0.2s; }

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
    .suggestion-chip__icon { color: var(--iflyv-brand-primary); }
  }
}

/* ====================================================================
   功能模块 — 栅格
   ==================================================================== */
.mod-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--iflyv-spacing-4);
  animation: fadeUp 0.45s ease both;
  animation-delay: 0.10s;
}

.mod-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);
  padding: var(--iflyv-spacing-5);
  background: var(--iflyv-bg-panel);
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-page);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.25s,
              box-shadow 0.3s;

  /* 顶部主题色条 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--c);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: var(--c);
    box-shadow: 0 12px 32px -8px rgba(21, 21, 21, 0.12);

    &::before {
      transform: scaleX(1);
    }
  }

  /* 专业管理主卡 — 横跨两列 */
  &--hub {
    grid-column: span 2;
    background: linear-gradient(135deg, var(--iflyv-bg-panel) 70%, var(--bg) 100%);
    border-color: var(--c);
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: var(--iflyv-radius-smallmodule);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    color: var(--c);
    flex-shrink: 0;
    transition: transform 0.3s;
  }

  &:hover &__icon {
    transform: scale(1.1) rotate(-4deg);
  }

  &__ext {
    color: var(--iflyv-text-4);
    transition: color 0.2s;
  }

  &:hover &__ext {
    color: var(--c);
  }

  &__name {
    font-size: 16px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    margin: 4px 0 0;
  }

  &__desc {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
    line-height: 1.6;
    margin: 0;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: var(--iflyv-spacing-1);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: var(--iflyv-spacing-3);
    border-top: 1px solid var(--iflyv-border-light);
  }

  &__stats {
    display: flex;
    gap: var(--iflyv-spacing-4);
  }

  &__action {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 500;
    color: var(--c);
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.25s, transform 0.25s;
  }

  &:hover &__action {
    opacity: 1;
    transform: translateX(0);
  }
}

.mod-tag {
  padding: 3px 10px;
  border-radius: var(--iflyv-radius-full);
  background: var(--iflyv-bg-inset);
  font-size: 11px;
  color: var(--iflyv-text-3);
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;

  .mod-card:hover & {
    background: var(--bg);
    color: var(--c);
  }
}

.mod-kv {
  font-size: 12px;
  color: var(--iflyv-text-4);

  strong {
    font-size: 15px;
    font-weight: 700;
    color: var(--iflyv-text-2);
    margin-right: 2px;
  }
}

/* ====================================================================
   入场动画
   ==================================================================== */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
