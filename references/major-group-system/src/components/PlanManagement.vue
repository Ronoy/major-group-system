<template>
  <div class="plan-mgmt">
    <!-- 标题区 -->
    <div class="plan-mgmt__header">
      <div>
        <h2 class="plan-mgmt__title">方案管理</h2>
        <p class="plan-mgmt__desc">管理和维护专业人才培养方案，支持 Word 导入和 AI 智能修订</p>
      </div>
      <div class="plan-mgmt__actions">
        <el-button @click="teamDialogVisible = true">
          <Users :size="14" :stroke-width="2" />
          成员管理
        </el-button>
        <el-button type="primary" @click="importDialogVisible = true">
          <Upload :size="14" :stroke-width="2" />
          导入方案
        </el-button>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="plan-mgmt__toolbar">
      <div class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab.value"
          class="filter-tab"
          :class="{ 'filter-tab--active': currentFilter === tab.value }"
          @click="currentFilter = tab.value"
        >
          {{ tab.label }}
          <span class="filter-tab__count">{{ tab.count }}</span>
        </button>
      </div>
      <div style="flex:1" />
      <div class="search-box">
        <Search :size="14" :stroke-width="2" class="search-box__icon" />
        <input v-model="searchQuery" type="text" placeholder="搜索方案..." class="search-box__input" />
      </div>
      <el-select v-model="yearFilter" size="default" style="width:120px">
        <el-option label="全部年份" value="all" />
        <el-option label="2026级" value="2026" />
        <el-option label="2025级" value="2025" />
        <el-option label="2024级" value="2024" />
      </el-select>
      <div class="view-toggle">
        <button class="view-btn" :class="{ 'view-btn--active': currentView === 'grid' }" @click="currentView = 'grid'">
          <LayoutGrid :size="14" :stroke-width="2" />
        </button>
        <button class="view-btn" :class="{ 'view-btn--active': currentView === 'list' }" @click="currentView = 'list'">
          <List :size="14" :stroke-width="2" />
        </button>
      </div>
    </div>

    <!-- 卡片视图 -->
    <div v-if="currentView === 'grid'" class="plan-grid">
      <div
        v-for="(plan, i) in filteredPlans"
        :key="plan.id"
        class="plan-card"
        :style="{ animationDelay: `${i * 0.05}s` }"
      >
        <div class="plan-card__top">
          <div class="plan-card__head">
            <div class="plan-card__icon">
              <FileText :size="18" :stroke-width="1.8" />
            </div>
            <span class="status-badge" :class="`status-badge--${plan.status}`">
              {{ STATUS_MAP[plan.status] }}
            </span>
          </div>
          <div class="plan-card__name">{{ plan.name }}</div>
          <div class="plan-card__meta">
            <span class="meta-tag">{{ plan.code }}</span>
            <span class="meta-tag">{{ plan.major }}</span>
            <span class="meta-tag">{{ plan.year }}级</span>
            <span v-if="plan.progressLabel" class="meta-tag">{{ plan.progressLabel }}</span>
          </div>
        </div>
        <div class="plan-card__bottom">
          <span class="plan-card__date">{{ plan.date }}</span>
          <div class="plan-card__actions">
            <button class="action-btn" title="预览" @click.stop="handlePreview(plan)">
              <Eye :size="14" :stroke-width="2" />
            </button>
            <button class="action-btn" title="智能修订" @click.stop="handleEdit(plan)">
              <Pencil :size="14" :stroke-width="2" />
            </button>
            <button class="action-btn" title="导出Word" @click.stop="handleExport(plan)">
              <Download :size="14" :stroke-width="2" />
            </button>
            <button class="action-btn action-btn--danger" title="删除" @click.stop="handleDelete(plan)">
              <Trash2 :size="14" :stroke-width="2" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-else class="plan-list">
      <div
        v-for="(plan, i) in filteredPlans"
        :key="plan.id"
        class="plan-list-item"
        :style="{ animationDelay: `${i * 0.04}s` }"
      >
        <div class="plan-list-item__icon">
          <FileText :size="16" :stroke-width="1.8" />
        </div>
        <div class="plan-list-item__info">
          <div class="plan-list-item__name">{{ plan.name }}</div>
          <div class="plan-list-item__meta">
            <span>{{ plan.code }} {{ plan.major }}</span>
            <span>{{ plan.year }}级</span>
            <span>{{ plan.progressLabel || plan.progress }}</span>
            <span>{{ plan.date }}</span>
          </div>
        </div>
        <span class="status-badge" :class="`status-badge--${plan.status}`">
          {{ STATUS_MAP[plan.status] }}
        </span>
        <div class="plan-card__actions">
          <button class="action-btn" title="预览" @click.stop="handlePreview(plan)">
            <Eye :size="14" :stroke-width="2" />
          </button>
          <button class="action-btn" title="智能修订" @click.stop="handleEdit(plan)">
            <Pencil :size="14" :stroke-width="2" />
          </button>
          <button class="action-btn" title="导出Word" @click.stop="handleExport(plan)">
            <Download :size="14" :stroke-width="2" />
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredPlans.length === 0" class="empty-state">
      <FileText :size="48" :stroke-width="1" class="empty-state__icon" />
      <div class="empty-state__title">暂无方案</div>
      <div class="empty-state__desc">点击"导入方案"上传学校已有的人才培养方案</div>
    </div>

    <!-- 导入弹窗 -->
    <el-dialog v-model="importDialogVisible" title="导入方案" width="520px" :close-on-click-modal="false">
      <el-form label-position="top">
        <el-form-item label="上传方案文件">
          <div class="upload-area" @click="ElMessage.info('选择文件...')">
            <Upload :size="28" :stroke-width="1.5" class="upload-area__icon" />
            <div class="upload-area__text">将 Word 文件拖拽到此处，或 <span style="color:var(--iflyv-brand-primary);font-weight:500;">点击上传</span></div>
            <div class="upload-area__hint">支持 .doc / .docx 格式，不超过 20MB</div>
          </div>
        </el-form-item>
        <el-form-item label="方案名称" required>
          <el-input placeholder="输入方案名称（上传文件后自动填充）" />
        </el-form-item>
        <el-form-item label="专业选择" required>
          <el-input value="610205 软件技术" disabled />
        </el-form-item>
        <el-form-item label="适用入学年份" required>
          <el-select style="width:100%" model-value="2026">
            <el-option label="2026级" value="2026" />
            <el-option label="2025级" value="2025" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImport">导入并解析</el-button>
      </template>
    </el-dialog>

    <!-- 成员管理弹窗 -->
    <el-dialog v-model="teamDialogVisible" title="软件技术 — 建设团队" width="480px">
      <div class="team-list">
        <div v-for="member in teamMembers" :key="member.name" class="team-member">
          <div class="team-member__avatar">{{ member.name.charAt(0) }}</div>
          <div class="team-member__info">
            <div class="team-member__name">{{ member.name }}</div>
            <div class="team-member__role">{{ member.role }}</div>
          </div>
          <span v-if="member.isLeader" class="leader-tag">负责人</span>
          <el-button v-else size="small" text @click="ElMessage.info(`已移除 ${member.name}`)">移除</el-button>
        </div>
      </div>
      <div class="team-add">
        <el-input placeholder="输入教师姓名或工号添加成员" style="flex:1" />
        <el-button type="primary" @click="ElMessage.success('已发送邀请')">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FileText, Search, Upload, Users, Eye, Pencil, Download, Trash2,
  LayoutGrid, List,
} from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  majorFilter?: string
}>()

const STATUS_MAP: Record<string, string> = {
  draft: '草稿',
  published: '已发布',
}

interface Plan {
  id: number
  name: string
  major: string
  code: string
  year: string
  status: 'draft' | 'published'
  progressLabel: string
  progress: string
  date: string
}

const plans = ref<Plan[]>([
  { id: 1, name: '2026级软件技术专业人才培养方案', major: '软件技术', code: '610205', year: '2026', status: 'draft', progressLabel: '修订中', progress: '修订中 · 已完成 8/16 章节', date: '2026-03-18' },
  { id: 2, name: '2025级软件技术专业人才培养方案', major: '软件技术', code: '610205', year: '2025', status: 'published', progressLabel: '', progress: '已发布', date: '2026-03-15' },
  { id: 3, name: '2026级大数据技术专业人才培养方案', major: '大数据技术', code: '510205', year: '2026', status: 'draft', progressLabel: '解析中...', progress: '解析中...', date: '2026-03-14' },
  { id: 4, name: '2025级大数据技术专业人才培养方案', major: '大数据技术', code: '510205', year: '2025', status: 'published', progressLabel: '', progress: '已发布', date: '2026-03-10' },
  { id: 5, name: '2026级云计算技术应用专业人才培养方案', major: '云计算技术应用', code: '510206', year: '2026', status: 'draft', progressLabel: '修订中', progress: '修订中 · 已完成 3/16 章节', date: '2026-03-12' },
  { id: 6, name: '2026级人工智能技术应用专业人才培养方案', major: '人工智能技术应用', code: '510209', year: '2026', status: 'draft', progressLabel: '就绪', progress: '就绪 · 可开始修订', date: '2026-03-08' },
  { id: 7, name: '2025级云计算技术应用专业人才培养方案（修订版）', major: '云计算技术应用', code: '510206', year: '2025', status: 'draft', progressLabel: '就绪', progress: '就绪 · 可开始修订', date: '2026-03-05' },
])

const teamMembers = [
  { name: '张建国', role: '专业负责人', isLeader: true },
  { name: '李小明', role: '团队成员', isLeader: false },
  { name: '王芳', role: '团队成员', isLeader: false },
  { name: '赵伟', role: '团队成员', isLeader: false },
]

const currentFilter = ref('all')
const currentView = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const yearFilter = ref('all')
const importDialogVisible = ref(false)
const teamDialogVisible = ref(false)

const filterTabs = computed(() => {
  const all = plans.value.length
  const draft = plans.value.filter(p => p.status === 'draft').length
  const published = plans.value.filter(p => p.status === 'published').length
  return [
    { label: '全部', value: 'all', count: all },
    { label: '草稿', value: 'draft', count: draft },
    { label: '已发布', value: 'published', count: published },
  ]
})

const filteredPlans = computed(() => {
  let result = plans.value
  if (props.majorFilter) {
    result = result.filter(p => p.code === props.majorFilter)
  }
  if (currentFilter.value !== 'all') {
    result = result.filter(p => p.status === currentFilter.value)
  }
  if (yearFilter.value !== 'all') {
    result = result.filter(p => p.year === yearFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) || p.major.toLowerCase().includes(q) || p.code.includes(q)
    )
  }
  return result
})

function handlePreview(plan: Plan) {
  ElMessage.info(`预览「${plan.name}」`)
}
function handleEdit(plan: Plan) {
  ElMessage.info(`${plan.progressLabel === '修订中' ? '继续' : '开始'}修订「${plan.name}」`)
}
function handleExport(plan: Plan) {
  ElMessage.success('导出成功')
}
function handleDelete(plan: Plan) {
  ElMessage.warning(`已删除「${plan.name}」`)
}
function handleImport() {
  importDialogVisible.value = false
  ElMessage.success('方案导入成功，正在解析...')
}
</script>

<style scoped lang="scss">
.plan-mgmt {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--iflyv-spacing-5);
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: var(--iflyv-text-1);
    margin: 0 0 4px;
  }

  &__desc {
    font-size: 14px;
    color: var(--iflyv-text-3);
    margin: 0;
  }

  &__actions {
    display: flex;
    gap: 10px;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: var(--iflyv-spacing-4);
  }
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 4px;
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  padding: 3px;
}

.filter-tab {
  padding: 5px 14px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--iflyv-text-3);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;

  &--active {
    background: var(--iflyv-bg-panel);
    color: var(--iflyv-brand-primary);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  &__count {
    font-size: 11px;
    background: var(--iflyv-bg-inset);
    padding: 0 6px;
    border-radius: 8px;
    line-height: 18px;
    color: var(--iflyv-text-4);
  }

  &--active &__count {
    background: var(--iflyv-brand-bg);
    color: var(--iflyv-brand-primary);
  }
}

/* 搜索框 */
.search-box {
  position: relative;
  width: 180px;

  &__icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--iflyv-text-4);
  }

  &__input {
    width: 100%;
    padding: 7px 12px 7px 32px;
    border: 1px solid var(--iflyv-border-light);
    border-radius: var(--iflyv-radius-smallmodule);
    font-size: 13px;
    outline: none;
    background: var(--iflyv-bg-panel);
    color: var(--iflyv-text-1);
    transition: border-color 0.15s;

    &::placeholder { color: var(--iflyv-text-4); }

    &:focus {
      border-color: var(--iflyv-brand-primary);
      box-shadow: 0 0 0 3px rgba(54, 88, 255, 0.08);
    }
  }
}

/* 视图切换 */
.view-toggle {
  display: flex;
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-smallmodule);
  overflow: hidden;
}

.view-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: var(--iflyv-bg-panel);
  color: var(--iflyv-text-4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:first-child { border-right: 1px solid var(--iflyv-border-light); }

  &--active {
    background: var(--iflyv-brand-primary);
    color: #fff;
  }

  &:hover:not(.view-btn--active) {
    background: var(--iflyv-bg-inset);
  }
}

/* 卡片网格 */
.plan-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--iflyv-spacing-4);
}

.plan-card {
  background: var(--iflyv-bg-panel);
  border-radius: var(--iflyv-radius-page);
  border: 1px solid var(--iflyv-border-light);
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  animation: fadeUp 0.35s ease-out both;

  &:hover {
    box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
    border-color: var(--iflyv-border-primary);
  }

  &__top { padding: 20px 20px 14px; }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__icon {
    width: 40px;
    height: 40px;
    background: var(--iflyv-brand-bg);
    border-radius: var(--iflyv-radius-smallmodule);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--iflyv-brand-primary);
  }

  &__name {
    font-size: 15px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    line-height: 1.4;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__bottom {
    padding: 12px 20px;
    background: var(--iflyv-bg-inset);
    border-top: 1px solid var(--iflyv-border-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__date {
    font-size: 12px;
    color: var(--iflyv-text-4);
  }

  &__actions {
    display: flex;
    gap: 4px;
  }
}

.meta-tag {
  padding: 2px 8px;
  background: var(--iflyv-bg-inset);
  border-radius: 4px;
  font-size: 12px;
  color: var(--iflyv-text-3);
}

.status-badge {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;

  &--draft {
    background: var(--iflyv-warning-bg);
    color: var(--iflyv-warning-primary);
  }

  &--published {
    background: var(--iflyv-success-bg);
    color: var(--iflyv-success-primary);
  }
}

.action-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: var(--iflyv-text-4);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover {
    background: var(--iflyv-brand-bg);
    color: var(--iflyv-brand-primary);
  }

  &--danger:hover {
    background: #fef2f2;
    color: #ef4444;
  }
}

/* 列表视图 */
.plan-list-item {
  background: var(--iflyv-bg-panel);
  border: 1px solid var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-page);
  padding: 16px 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
  cursor: pointer;
  animation: fadeUp 0.35s ease-out both;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    border-color: var(--iflyv-border-primary);
  }

  &__icon {
    width: 36px;
    height: 36px;
    background: var(--iflyv-brand-bg);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--iflyv-brand-primary);
    flex-shrink: 0;
  }

  &__info { flex: 1; min-width: 0; }

  &__name {
    font-size: 14px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: var(--iflyv-text-4);
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;

  &__icon {
    color: var(--iflyv-text-4);
    opacity: 0.4;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--iflyv-text-2);
    margin-bottom: 8px;
  }

  &__desc {
    font-size: 14px;
    color: var(--iflyv-text-4);
  }
}

/* 上传区域 */
.upload-area {
  border: 2px dashed var(--iflyv-border-light);
  border-radius: var(--iflyv-radius-page);
  padding: 28px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
  }

  &__icon { color: var(--iflyv-text-4); margin-bottom: 8px; }
  &__text { font-size: 14px; color: var(--iflyv-text-2); }
  &__hint { font-size: 12px; color: var(--iflyv-text-4); margin-top: 4px; }
}

/* 团队管理 */
.team-list {
  margin-bottom: 16px;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--iflyv-border-light);

  &:last-child { border-bottom: none; }

  &__avatar {
    width: 36px;
    height: 36px;
    background: var(--iflyv-brand-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: var(--iflyv-brand-primary);
    flex-shrink: 0;
  }

  &__info { flex: 1; }
  &__name { font-size: 14px; font-weight: 600; color: var(--iflyv-text-1); }
  &__role { font-size: 12px; color: var(--iflyv-text-4); }
}

.leader-tag {
  font-size: 11px;
  color: var(--iflyv-warning-primary);
  background: var(--iflyv-warning-bg);
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.team-add {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--iflyv-border-light);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
