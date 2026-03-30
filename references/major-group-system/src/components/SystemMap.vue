<template>
  <div class="home-wrap">
    <!-- ============ 顶栏 ============ -->
    <header class="home-header">
      <div class="home-header__left">
        <img src="../assets/szpu-logo.svg" alt="深圳职业技术大学" class="home-header__logo" />
        <span class="home-header__school">深圳职业技术大学</span>
      </div>
      <div class="home-header__right">
        <div class="role-switch">
          <button
            class="role-switch__btn"
            :class="{ 'role-switch__btn--active': currentRole === 'admin' }"
            @click="currentRole = 'admin'"
          >管理员</button>
          <button
            class="role-switch__btn"
            :class="{ 'role-switch__btn--active': currentRole === 'teacher' }"
            @click="currentRole = 'teacher'"
          >教师</button>
        </div>
        <div class="home-header__divider" />
        <div class="home-header__user">
          <div class="home-header__avatar">管</div>
          <span class="home-header__username">管理员</span>
        </div>
      </div>
    </header>

    <div class="home">
      <!-- ============ AI 问答区 ============ -->
      <section class="ai-hero">
        <h1 class="ai-hero__title">
          <Sparkles :size="22" :stroke-width="1.5" class="ai-hero__star" />
          {{ greeting }}，有什么我可以帮你的？
        </h1>
        <p class="ai-hero__desc">基于专业数据的智能问答，支持岗位分析、课程推荐、能力诊断</p>

        <div class="chat-box" :class="{ 'chat-box--focus': inputFocused }">
          <textarea
            ref="inputRef"
            v-model="query"
            class="chat-box__textarea"
            placeholder="您可以在这里开启对话..."
            rows="3"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @keydown.enter.exact="handleSend"
          />
          <div class="chat-box__toolbar">
            <div class="chat-box__left">
              <button class="toolbar-btn" title="添加附件" @click.prevent="ElMessage.info('附件功能即将上线')">
                <Paperclip :size="16" :stroke-width="1.8" />
              </button>
              <div class="toolbar-select" @click.prevent="ElMessage.info('知识库选择即将上线')">
                <span>请选择知识库</span>
                <ChevronDown :size="13" :stroke-width="2" />
              </div>
              <div class="toolbar-select" @click.prevent>
                <span>{{ currentModel }}</span>
                <ChevronDown :size="13" :stroke-width="2" />
                <div class="model-dropdown" @click.stop>
                  <a
                    v-for="m in modelOptions"
                    :key="m.value"
                    class="model-dropdown__item"
                    :class="{ 'model-dropdown__item--active': currentModel === m.label }"
                    @click="currentModel = m.label"
                  >{{ m.label }}</a>
                </div>
              </div>
            </div>
            <div class="chat-box__right">
              <button class="toolbar-btn toolbar-btn--mic" title="语音输入" @click.prevent="ElMessage.info('语音输入即将上线')">
                <Mic :size="18" :stroke-width="1.8" />
              </button>
              <div class="toolbar-divider" />
              <button
                class="send-btn"
                :class="{ 'send-btn--active': query.trim() }"
                @click="handleSend"
              >
                <ArrowUp :size="16" :stroke-width="2.5" />
              </button>
            </div>
          </div>
        </div>

        <div class="ai-suggestions">
          <button
            v-for="s in suggestions"
            :key="s.text"
            class="suggestion-chip"
            @click="handleSuggestion(s.text)"
          >
            <component :is="s.icon" :size="13" :stroke-width="2" class="suggestion-chip__icon" />
            {{ s.text }}
          </button>
        </div>
      </section>

      <!-- ============ AI 工具条 ============ -->
      <section class="ai-tools-strip">
        <span class="ai-tools-strip__label">AI 工具</span>
        <div class="ai-tools-strip__list">
          <a
            v-for="tool in aiTools"
            :key="tool.label"
            class="tool-chip"
            :style="{ '--tc': tool.color, '--tbg': tool.bg }"
            @click="handleToolClick(tool)"
          >
            <component :is="tool.icon" :size="13" :stroke-width="1.8" />
            <span>{{ tool.label }}</span>
          </a>
        </div>
        <a class="tool-chip tool-chip--more" @click="openAiSpace">
          <span>查看更多</span>
          <ArrowRight :size="12" :stroke-width="2" />
        </a>
      </section>

      <!-- ============ 待办 + 功能模块 ============ -->
      <section class="content-grid">
        <!-- 左：功能模块 -->
        <div class="mod-area">
          <div class="section-label">功能模块</div>
          <div class="mod-grid">
            <div
              v-for="(mod, i) in modules"
              :key="mod.id"
              class="mod-card"
              :style="{ '--c': mod.color, '--bg': mod.bg, animationDelay: `${0.05 * i}s` }"
              @click="handleModuleClick(mod)"
            >
              <div class="mod-card__icon">
                <component :is="mod.icon" :size="18" :stroke-width="1.6" />
              </div>
              <div class="mod-card__body">
                <div class="mod-card__name">
                  {{ mod.name }}
                  <ExternalLink v-if="mod.external" :size="10" :stroke-width="2" class="mod-card__ext" />
                </div>
                <p class="mod-card__desc">{{ mod.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右：待办 -->
        <div class="todo-panel">
          <div class="section-label">
            我的待办
            <span class="todo-badge">{{ todoItems.length }}</span>
          </div>
          <div class="todo-list">
            <div v-for="item in todoItems" :key="item.id" class="todo-item" @click="handleTodoClick(item)">
              <div class="todo-item__dot" :style="{ background: item.urgent ? '#EF4444' : '#E5A04B' }" />
              <span class="todo-item__text">{{ item.text }}</span>
              <span class="todo-item__time">{{ item.time }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import {
  Gem, Sparkles, Search, Network, BookMarked, Layers,
  ArrowRight, ArrowUp, ExternalLink, ClipboardList,
  Briefcase, GraduationCap, BarChart3, Lightbulb,
  PenTool, FileQuestion, FolderSearch, FileEdit, Languages, TrendingUp, ShieldCheck, ScanSearch, BookOpen,
  Paperclip, ChevronDown, Mic,
} from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  navigate: [page: string]
}>()

/* ==== AI 问答 ==== */
const query = ref('')
const inputFocused = ref(false)
const inputRef = ref<HTMLTextAreaElement | null>(null)

const currentModel = ref('Gest-DeepSeek')
const modelOptions = [
  { label: 'Gest-DeepSeek', value: 'deepseek' },
  { label: 'Gest-Qwen', value: 'qwen' },
  { label: 'Gest-GLM', value: 'glm' },
]

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

/* ==== AI 特色工具 ==== */
interface AiTool {
  label: string
  tags: string
  icon: any
  color: string
  bg: string
  url: string
}

const aiTools: AiTool[] = [
  { label: '智能批改', tags: '教学·效率', icon: markRaw(PenTool), color: '#3658FF', bg: '#F0F5FF', url: 'https://icourse.fifedu.com/istp-ai-tool/intelligentCorrection' },
  { label: '命题助手', tags: '教学·效率', icon: markRaw(FileQuestion), color: '#3658FF', bg: '#F0F5FF', url: 'https://assess.fifedu.com/static/fiftest/newbank/index.html#/AIPropositionAssistant?origin=AICourse' },
  { label: '论文检索与总结', tags: '科研·效率', icon: markRaw(FolderSearch), color: '#059669', bg: '#ECFDF5', url: 'https://icourse.fifedu.com/istp-ai-tool/articleSearch' },
  { label: '论文综述生成', tags: '科研·效率', icon: markRaw(BookOpen), color: '#059669', bg: '#ECFDF5', url: 'https://icourse.fifedu.com/istp-ai-tool/literatureReview' },
  { label: 'AI文档编写', tags: '教学·AIGC', icon: markRaw(FileEdit), color: '#8B5CF6', bg: '#F5F3FF', url: 'https://icourse.fifedu.com/istp-ai-tool/documentWriting' },
  { label: '学术翻译', tags: '科研·效率', icon: markRaw(Languages), color: '#E67E22', bg: '#FEF6EC', url: 'https://icourse.fifedu.com/istp-ai-tool/academicTranslation' },
  { label: '科研趋势分析', tags: '科研·效率', icon: markRaw(TrendingUp), color: '#059669', bg: '#ECFDF5', url: 'https://icourse.fifedu.com/istp-ai-tool/researchTrendAnalysis/search' },
  { label: '论文查重', tags: '教学·AIGC', icon: markRaw(ShieldCheck), color: '#EF4444', bg: '#FEF2F2', url: 'https://icourse.fifedu.com/istp-ai-tool/duplicateCheck/detectionInspect' },
  { label: 'AIGC检测', tags: '教学·AIGC', icon: markRaw(ScanSearch), color: '#EF4444', bg: '#FEF2F2', url: 'https://icourse.fifedu.com/istp-ai-tool/aigcDetection/detectionInspect' },
]

function handleToolClick(tool: AiTool) {
  window.open(tool.url, '_blank')
}

function openAiSpace() {
  window.open('https://iflyvedcs.fifedu.com/vocational-mannage/aiSpace/list', '_blank')
}

/* ==== 待办事项 ==== */
interface TodoItem {
  id: string
  text: string
  time: string
  urgent: boolean
}

const todoItems: TodoItem[] = [
  { id: 't1', text: '软件技术专业培养方案待审核', time: '今天', urgent: true },
  { id: 't2', text: '新增3个岗位匹配数据待确认', time: '明天', urgent: false },
  { id: 't3', text: '课程标准更新提醒（Java EE开发）', time: '3天内', urgent: false },
]

function handleTodoClick(item: TodoItem) {
  ElMessage.info(`待办「${item.text}」详情即将上线`)
}

function handleSend(e?: Event) {
  e?.preventDefault()
  if (!query.value.trim()) return
  ElMessage.info(`正在跳转至 AI 空间...`)
  query.value = ''
  window.open('https://iflyvedcs.fifedu.com/vocational-mannage/aiSpace/list', '_blank')
}

function handleSuggestion(text: string) {
  query.value = text
  inputRef.value?.focus()
}

/* ==== 角色与权限 ==== */
type UserRole = 'admin' | 'teacher'
const currentRole = ref<UserRole>('admin')

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
  roles: UserRole[]
  external?: boolean
  url?: string
}

const allModules: ModuleItem[] = [
  {
    id: 'research',
    name: '专业调研系统',
    icon: markRaw(Search),
    color: '#6366F1',
    bg: '#EEF2FF',
    description: '洞察产业趋势与人才需求，为专业定位提供数据支撑',
    tags: ['政策解读', '产业报告', '岗位人才需求', '岗位能力图谱'],
    kvs: [{ value: '12', label: '调研报告' }, { value: '4', label: '产业方向' }],
    roles: ['admin', 'teacher'],
    external: false,
  },
  {
    id: 'major-build',
    name: '专业建设中心',
    icon: markRaw(Gem),
    color: '#3658FF',
    bg: '#F0F5FF',
    description: '构建岗位-课程-能力关联体系，驱动上下游数据流转',
    tags: ['岗位匹配', '课程地图', '能力图谱', 'AI推荐', '专业画像', '建设报告'],
    kvs: [{ value: '6', label: '功能模块' }, { value: '68', label: '关联课程' }],
    roles: ['admin', 'teacher'],
  },
  {
    id: 'major-group',
    name: '专业群管理',
    icon: markRaw(Layers),
    color: '#3B82F6',
    bg: '#EFF6FF',
    description: '统筹专业群整体规划，管理共享课程池与资源矩阵',
    tags: ['专业群规划', '共享课程池', '资源矩阵', '群内协同'],
    kvs: [{ value: '4', label: '学院' }, { value: '14', label: '专业' }],
    roles: ['admin'],
    external: true,
    url: 'https://iflyvedcs.fifedu.com/vocational-mannage/basic/majorGroup',
  },
  {
    id: 'course',
    name: '课程中心',
    icon: markRaw(BookMarked),
    color: '#059669',
    bg: '#ECFDF5',
    description: '管理课程标准与教学资源，支撑教学全流程数字化',
    tags: ['课程标准', '教学设计', '考核方案', '资源建设'],
    kvs: [{ value: '68', label: '门课程' }, { value: '6', label: '学期覆盖' }],
    roles: ['admin', 'teacher'],
    external: true,
    url: 'https://iflyvedcs.fifedu.com/vocational-mannage/courseCenter/list',
  },
  {
    id: 'job-cluster',
    name: '岗位群中心',
    icon: markRaw(Network),
    color: '#8B5CF6',
    bg: '#F5F3FF',
    description: '梳理岗位族群关系，构建岗位能力模型与职业路径',
    tags: ['岗位聚类', '能力模型', '职业路径', '技能标签'],
    kvs: [{ value: '8', label: '典型岗位' }, { value: '46', label: '能力标签' }],
    roles: ['admin', 'teacher'],
    external: true,
    url: 'https://iflyvedcs.fifedu.com/vocational-mannage/positionCenter/list',
  },
  {
    id: 'ai-innovation',
    name: 'AI创新中心',
    icon: markRaw(Sparkles),
    color: '#E67E22',
    bg: '#FEF6EC',
    description: '融合AI技术赋能专业建设，探索智能教育创新场景',
    tags: ['AI课程推荐', '智能诊断', '能力画像', '趋势预测'],
    kvs: [{ value: '9', label: 'AI工具' }, { value: '5', label: '创新场景' }],
    roles: ['admin', 'teacher'],
    external: true,
    url: 'https://iflyvedcs.fifedu.com/vocational-mannage/aiSpace/list',
  },
]

const modules = computed(() =>
  allModules.filter(m => m.roles.includes(currentRole.value))
)

function handleModuleClick(mod: ModuleItem) {
  if (mod.external && mod.url) {
    window.open(mod.url, '_blank')
    return
  }
  emit('navigate', mod.id)
}
</script>

<style scoped lang="scss">
/* ====================================================================
   整体布局
   ==================================================================== */
.home-wrap {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.home {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0 48px 64px;
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
}

/* ====================================================================
   顶栏 — 毛玻璃，极简
   ==================================================================== */
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 32px;
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(248, 249, 252, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  &__left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__logo {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__school {
    font-size: 14px;
    font-weight: 600;
    color: var(--iflyv-text-1);
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__divider {
    width: 1px;
    height: 16px;
    background: var(--iflyv-border-light);
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 3px 10px 3px 3px;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.15s;
    &:hover { background: var(--iflyv-bg-inset); }
  }

  &__avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--iflyv-brand-bg);
    color: var(--iflyv-brand-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
  }

  &__username {
    font-size: 12px;
    color: var(--iflyv-text-3);
  }
}

/* ====================================================================
   角色切换
   ==================================================================== */
.role-switch {
  display: flex;
  background: var(--iflyv-bg-inset);
  border-radius: 20px;
  padding: 2px;

  &__btn {
    padding: 4px 14px;
    border-radius: 20px;
    border: none;
    background: transparent;
    font-size: 12px;
    font-weight: 500;
    color: var(--iflyv-text-3);
    cursor: pointer;
    transition: all 0.2s;

    &--active {
      background: #fff;
      color: var(--iflyv-text-1);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    }
  }
}

/* ====================================================================
   AI 问答区 — 大呼吸空间
   ==================================================================== */
.ai-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 56px 0 8px;
  animation: fadeUp 0.5s ease both;

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 21px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    margin: 0;
    letter-spacing: -0.3px;
  }

  &__star {
    color: var(--iflyv-brand-primary);
    opacity: 0.6;
    flex-shrink: 0;
  }

  &__desc {
    margin: 8px 0 0;
    font-size: 13px;
    color: var(--iflyv-text-4);
  }
}

/* ====================================================================
   对话输入框 — 多行 + 工具栏
   ==================================================================== */
.chat-box {
  margin-top: 28px;
  width: 100%;
  max-width: 720px;
  background: #fff;
  border: 1.5px solid var(--iflyv-border-light);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;

  &--focus {
    border-color: var(--iflyv-brand-primary);
    box-shadow: 0 0 0 3px rgba(54, 88, 255, 0.06);
  }

  &__textarea {
    display: block;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: var(--iflyv-text-1);
    line-height: 1.6;
    padding: 16px 20px 8px;
    resize: none;
    font-family: inherit;
    box-sizing: border-box;

    &::placeholder { color: var(--iflyv-text-4); }
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

.toolbar-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--iflyv-border-light);
  background: var(--iflyv-bg-page);
  color: var(--iflyv-text-3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
  }

  &--mic {
    border: none;
    background: transparent;
    width: 36px;
    height: 36px;
    color: var(--iflyv-text-2);

    &:hover {
      color: var(--iflyv-brand-primary);
      background: var(--iflyv-brand-bg);
    }
  }
}

.toolbar-select {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--iflyv-border-light);
  background: var(--iflyv-bg-page);
  font-size: 13px;
  color: var(--iflyv-text-3);
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  user-select: none;

  &:hover {
    border-color: var(--iflyv-text-4);
    color: var(--iflyv-text-2);
  }

  svg { flex-shrink: 0; color: var(--iflyv-text-4); }

  .model-dropdown {
    display: none;
    position: absolute;
    left: 0;
    top: calc(100% + 4px);
    min-width: 160px;
    padding: 4px;
    background: #fff;
    border: 1px solid var(--iflyv-border-light);
    border-radius: 10px;
    box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  &:hover .model-dropdown {
    display: block;
  }
}

.model-dropdown__item {
  display: block;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--iflyv-text-2);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s;

  &:hover { background: var(--iflyv-bg-inset); }

  &--active {
    color: var(--iflyv-brand-primary);
    font-weight: 600;
    background: var(--iflyv-brand-bg);
  }
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--iflyv-border-light);
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--iflyv-bg-inset);
  color: var(--iflyv-text-4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &--active {
    background: var(--iflyv-brand-primary);
    color: #fff;
  }
}

/* ====================================================================
   建议标签
   ==================================================================== */
.ai-suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  max-width: 720px;
}

.suggestion-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid var(--iflyv-border-light);
  background: #fff;
  color: var(--iflyv-text-2);
  font-size: 12.5px;
  cursor: pointer;
  transition: all 0.15s;

  &__icon { color: var(--iflyv-brand-primary); opacity: 0.6; }

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
    .suggestion-chip__icon { opacity: 1; }
  }
}

/* ====================================================================
   AI 工具条 — 单行水平排列，轻量
   ==================================================================== */
.ai-tools-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  animation: fadeUp 0.4s ease both;
  animation-delay: 0.05s;

  &__label {
    font-size: 12px;
    font-weight: 600;
    color: var(--iflyv-text-4);
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: 0.3px;
  }

  &__list {
    display: flex;
    gap: 6px;
    overflow: hidden;
    flex: 1;
    min-width: 0;
  }
}

.tool-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid var(--iflyv-border-light);
  color: var(--iflyv-text-2);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s;

  svg { color: var(--tc); flex-shrink: 0; }

  &:hover {
    border-color: var(--tc);
    background: var(--tbg);
    color: var(--tc);
  }

  &--more {
    border-color: transparent;
    background: transparent;
    color: var(--iflyv-brand-primary);
    font-weight: 600;
    flex-shrink: 0;

    &:hover {
      background: var(--iflyv-brand-bg);
      border-color: var(--iflyv-brand-primary);
      color: var(--iflyv-brand-primary);
    }
  }
}

/* ====================================================================
   下方内容：模块 + 待办 并排
   ==================================================================== */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  animation: fadeUp 0.4s ease both;
  animation-delay: 0.10s;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--iflyv-text-3);
  margin-bottom: 12px;
}

/* ====================================================================
   功能模块 — 横向紧凑卡片（图标 + 文字）
   ==================================================================== */
.mod-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.mod-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid var(--iflyv-border-light);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  animation: fadeUp 0.35s ease both;

  &:hover {
    border-color: var(--c);
    box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    color: var(--c);
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__name {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    margin-bottom: 4px;
  }

  &__ext {
    color: var(--iflyv-text-4);
    opacity: 0;
    transition: opacity 0.15s;
  }

  &:hover &__ext {
    opacity: 0.6;
  }

  &__desc {
    font-size: 12px;
    color: var(--iflyv-text-4);
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* ====================================================================
   待办面板
   ==================================================================== */
.todo-panel {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--iflyv-border-light);
  align-self: start;
}

.todo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 10px;
  background: #FEE2E2;
  color: #DC2626;
  font-size: 11px;
  font-weight: 700;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s;

  &:hover { background: var(--iflyv-bg-inset); }

  &__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__text {
    flex: 1;
    font-size: 13px;
    color: var(--iflyv-text-2);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__time {
    font-size: 11px;
    color: var(--iflyv-text-4);
    flex-shrink: 0;
  }
}

/* ====================================================================
   动画
   ==================================================================== */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
