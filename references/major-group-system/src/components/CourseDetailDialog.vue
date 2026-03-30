<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    width="820px"
    class="course-detail-dialog"
    align-center
    destroy-on-close
    append-to-body
  >
    <template #header>
      <div class="dialog-header">
        <div class="dialog-header__left">
          <BookOpen :size="20" :stroke-width="2" class="dialog-header__icon" />
          <span class="dialog-header__title">{{ course.name }}</span>
          <el-tag :type="categoryTagType" size="small">{{ course.category }}</el-tag>
          <span v-if="isPending" class="pending-badge">
            <Clock :size="12" :stroke-width="2.5" />
            待定课程
          </span>
        </div>
        <div class="dialog-header__right">
          <button v-if="!editing && !isPending" class="edit-btn" @click="startEditing">
            <Pencil :size="14" :stroke-width="2" />
            编辑
          </button>
          <button class="close-btn" @click="visible = false">
            <X :size="18" :stroke-width="2" />
          </button>
        </div>
      </div>
    </template>

    <div class="dialog-body">
      <!-- 待定课程提示 -->
      <div v-if="isPending" class="pending-hint">
        <Sparkles :size="14" :stroke-width="2" class="pending-hint__icon" />
        <div class="pending-hint__text">
          <span class="pending-hint__title">AI 建议新增课程</span>
          <span class="pending-hint__desc">该课程由 AI 根据岗位需求建议新增，尚未正式创建。点击下方按钮使用 AI 快速生成课程内容。</span>
        </div>
      </div>

      <!-- === 查看模式 === -->
      <template v-if="!editing">
        <!-- 基本信息 -->
        <div class="info-row" v-if="!isPending">
          <div class="info-item">
            <span class="info-item__label">学分</span>
            <span class="info-item__value">{{ course.credits }}</span>
          </div>
          <div class="info-item">
            <span class="info-item__label">学时</span>
            <span class="info-item__value">{{ course.hours }}</span>
          </div>
          <div class="info-item">
            <span class="info-item__label">开设学期</span>
            <span class="info-item__value">{{ course.semester }}</span>
          </div>
          <div class="info-item">
            <span class="info-item__label">关联岗位</span>
            <span class="info-item__value info-item__value--brand">{{ jobLinks.length }} 个</span>
          </div>
        </div>

        <!-- 前序课程 -->
        <div v-if="prereqCourses.length" class="section">
          <div class="section__title">
            <span class="section__bar" />
            前序课程
          </div>
          <div class="prereq-list">
            <span v-for="pc in prereqCourses" :key="pc.id" class="prereq-chip">
              <GitBranch :size="12" :stroke-width="2" />
              {{ pc.name }}
            </span>
          </div>
        </div>

        <!-- 后继课程 -->
        <div v-if="successorCourses.length" class="section">
          <div class="section__title">
            <span class="section__bar" />
            后继课程
          </div>
          <div class="prereq-list">
            <span v-for="sc in successorCourses" :key="sc.id" class="prereq-chip prereq-chip--successor">
              <GitBranch :size="12" :stroke-width="2" />
              {{ sc.name }}
            </span>
          </div>
        </div>

        <!-- 课程简介 -->
        <div class="section">
          <div class="section__title">
            <span class="section__bar" />
            课程简介
          </div>
          <p class="section__text">{{ course.description }}</p>
        </div>

        <!-- 课程目标 -->
        <div v-if="course.objectives?.length" class="section">
          <div class="section__title">
            <span class="section__bar" />
            课程目标
          </div>
          <div class="objective-list">
            <div v-for="(obj, i) in course.objectives" :key="i" class="objective-item">
              <span class="objective-item__num">{{ i + 1 }}</span>
              <span>{{ obj }}</span>
            </div>
          </div>
        </div>

        <!-- 教学内容 -->
        <div v-if="course.contents?.length" class="section">
          <div class="section__title">
            <span class="section__bar" />
            教学内容
          </div>
          <div class="content-tags">
            <span v-for="c in course.contents" :key="c" class="content-tag">{{ c }}</span>
          </div>
        </div>

        <!-- 教学方法 & 考核方式 -->
        <div class="two-col" v-if="course.teachingMethods?.length || course.assessment">
          <div v-if="course.teachingMethods?.length" class="section section--compact">
            <div class="section__title">
              <span class="section__bar" />
              教学方法
            </div>
            <div class="method-list">
              <span v-for="m in course.teachingMethods" :key="m" class="method-tag">{{ m }}</span>
            </div>
          </div>
          <div v-if="course.assessment" class="section section--compact">
            <div class="section__title">
              <span class="section__bar" />
              考核方式
            </div>
            <p class="section__text">{{ course.assessment }}</p>
          </div>
        </div>

        <!-- 岗位覆盖度 -->
        <div v-if="jobLinks.length" class="section">
          <div class="section__title">
            <span class="section__bar section__bar--brand" />
            岗位能力覆盖度
            <span class="section__count">{{ jobLinks.length }} 个岗位</span>
          </div>
          <div class="coverage-list">
            <div
              v-for="link in sortedLinks"
              :key="link.jobId"
              class="coverage-card"
              :class="{ 'coverage-card--active': expandedJob === link.jobId }"
              @click="toggleExpand(link.jobId)"
            >
              <div class="coverage-card__header">
                <div class="coverage-card__info">
                  <span class="coverage-card__name">{{ link.jobName }}</span>
                  <span class="coverage-card__percent" :class="coverageLevel(link.coverage)">{{ link.coverage }}%</span>
                </div>
                <div class="coverage-card__bar-wrap">
                  <div
                    class="coverage-card__bar"
                    :class="coverageLevel(link.coverage)"
                    :style="{ width: link.coverage + '%' }"
                  />
                </div>
              </div>
              <Transition name="expand">
                <div v-if="expandedJob === link.jobId" class="coverage-card__detail">
                  <div class="coverage-card__label">覆盖能力项</div>
                  <div class="coverage-card__skills">
                    <span v-for="s in link.coveredSkills" :key="s" class="skill-chip">
                      <Check :size="12" :stroke-width="2.5" />
                      {{ s }}
                    </span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="coverage-summary">
            <div class="coverage-summary__item">
              <span class="coverage-summary__dot coverage-summary__dot--high" />
              高覆盖（≥70%）
              <span class="coverage-summary__num">{{ highCount }}</span>
            </div>
            <div class="coverage-summary__item">
              <span class="coverage-summary__dot coverage-summary__dot--mid" />
              中覆盖（40-69%）
              <span class="coverage-summary__num">{{ midCount }}</span>
            </div>
            <div class="coverage-summary__item">
              <span class="coverage-summary__dot coverage-summary__dot--low" />
              低覆盖（＜40%）
              <span class="coverage-summary__num">{{ lowCount }}</span>
            </div>
            <div class="coverage-summary__avg">
              平均覆盖度
              <span class="coverage-summary__avg-val">{{ avgCoverage }}%</span>
            </div>
          </div>
        </div>
      </template>

      <!-- === 编辑模式 === -->
      <template v-else>
        <el-form label-position="top" class="edit-form">
          <div class="edit-form__row">
            <el-form-item label="课程名称">
              <el-input v-model="editForm.name" />
            </el-form-item>
            <el-form-item label="课程类别">
              <el-select v-model="editForm.category">
                <el-option label="专业基础课" value="专业基础课" />
                <el-option label="专业核心课" value="专业核心课" />
                <el-option label="AI实训课" value="AI实训课" />
                <el-option label="专业拓展课" value="专业拓展课" />
              </el-select>
            </el-form-item>
          </div>
          <div class="edit-form__row edit-form__row--3">
            <el-form-item label="学分">
              <el-input-number v-model="editForm.credits" :min="0.5" :max="20" :step="0.5" />
            </el-form-item>
            <el-form-item label="学时">
              <el-input-number v-model="editForm.hours" :min="8" :max="600" :step="8" />
            </el-form-item>
            <el-form-item label="开设学期">
              <el-select v-model="editForm.semester">
                <el-option v-for="s in semesterOptions" :key="s" :label="s" :value="s" />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="课程简介">
            <el-input v-model="editForm.description" type="textarea" :rows="3" />
          </el-form-item>

          <!-- 前序课程编辑 -->
          <el-form-item label="前序课程">
            <div class="prereq-edit">
              <div class="prereq-edit__list">
                <span
                  v-for="pid in editForm.prerequisites"
                  :key="pid"
                  class="prereq-edit__tag"
                >
                  {{ getCourseName(pid) }}
                  <button class="prereq-edit__remove" @click="removePrereq(pid)">
                    <X :size="12" :stroke-width="2.5" />
                  </button>
                </span>
                <span v-if="!editForm.prerequisites.length" class="prereq-edit__empty">无前序课程</span>
              </div>
              <el-select
                v-model="prereqToAdd"
                placeholder="添加前序课程"
                filterable
                class="prereq-edit__select"
                @change="addPrereq"
              >
                <el-option
                  v-for="c in availablePrereqs"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-form>
      </template>
    </div>

    <!-- 操作按钮区 -->
    <div class="action-bar">
      <template v-if="editing">
        <button class="action-btn action-btn--primary" @click="saveEdits">
          <Check :size="16" :stroke-width="2" />
          保存修改
        </button>
        <button class="action-btn action-btn--outline" @click="editing = false">
          取消
        </button>
      </template>
      <template v-else-if="isPending">
        <button class="action-btn action-btn--ai" @click="goToAiCreate">
          <Sparkles :size="16" :stroke-width="2" />
          AI 创建课程
        </button>
        <button class="action-btn action-btn--danger-outline" @click="removePending">
          <X :size="16" :stroke-width="2" />
          移除待定课程
        </button>
      </template>
      <template v-else-if="isCourseCreated(course.id)">
        <button class="action-btn action-btn--primary" @click="goToLearn">
          <Play :size="16" :stroke-width="2" />
          进入学习
        </button>
        <button class="action-btn action-btn--outline" @click="goToAiCreate">
          <Sparkles :size="16" :stroke-width="2" />
          AI 优化课程
        </button>
      </template>
      <template v-else>
        <button class="action-btn action-btn--ai" @click="goToAiCreate">
          <Sparkles :size="16" :stroke-width="2" />
          AI 创建课程
        </button>
      </template>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { BookOpen, X, Check, Play, Sparkles, Clock, Pencil, GitBranch } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import type { Course } from '../data/majors'
import { courseJobLinkMap, createdCourseIds, pendingCourses } from '../data/majors'

const props = defineProps<{ course: Course; allCourses?: Course[] }>()
const visible = defineModel<boolean>({ required: true })
const emit = defineEmits<{ 'update-course': [course: Course] }>()

const expandedJob = ref<string | null>(null)
const editing = ref(false)
const prereqToAdd = ref('')

const semesterOptions = ['第1学期', '第2学期', '第3学期', '第4学期', '第5学期', '第6学期']

const editForm = reactive({
  name: '',
  category: '' as Course['category'],
  credits: 0,
  hours: 0,
  semester: '',
  description: '',
  prerequisites: [] as string[],
})

function startEditing() {
  editForm.name = props.course.name
  editForm.category = props.course.category
  editForm.credits = props.course.credits
  editForm.hours = props.course.hours
  editForm.semester = props.course.semester
  editForm.description = props.course.description
  editForm.prerequisites = [...(props.course.prerequisites || [])]
  editing.value = true
}

function saveEdits() {
  const updated: Course = {
    ...props.course,
    name: editForm.name,
    category: editForm.category,
    credits: editForm.credits,
    hours: editForm.hours,
    semester: editForm.semester,
    description: editForm.description,
    prerequisites: [...editForm.prerequisites],
  }
  emit('update-course', updated)
  editing.value = false
  ElMessage.success('课程信息已更新')
}

function removePrereq(id: string) {
  editForm.prerequisites = editForm.prerequisites.filter(p => p !== id)
}

function addPrereq(id: string) {
  if (id && !editForm.prerequisites.includes(id)) {
    editForm.prerequisites.push(id)
  }
  prereqToAdd.value = ''
}

const availablePrereqs = computed(() => {
  const all = props.allCourses || []
  return all.filter(c =>
    c.id !== props.course.id && !editForm.prerequisites.includes(c.id)
  )
})

function getCourseName(id: string) {
  const all = props.allCourses || []
  return all.find(c => c.id === id)?.name || id
}

// Prerequisites & successors
const prereqCourses = computed(() => {
  const all = props.allCourses || []
  const ids = props.course.prerequisites || []
  return all.filter(c => ids.includes(c.id))
})

const successorCourses = computed(() => {
  const all = props.allCourses || []
  return all.filter(c => c.prerequisites?.includes(props.course.id))
})

function toggleExpand(jobId: string) {
  expandedJob.value = expandedJob.value === jobId ? null : jobId
}

const isPending = computed(() => pendingCourses.value.some(c => c.id === props.course.id))

function isCourseCreated(courseId: string) {
  return createdCourseIds.value.has(courseId)
}

function goToAiCreate() {
  visible.value = false
  ElMessage.info(`即将进入「${props.course.name}」AI 课程创建页面...`)
}

function goToLearn() {
  visible.value = false
  ElMessage.success(`即将进入「${props.course.name}」学习页面...`)
}

function removePending() {
  pendingCourses.value = pendingCourses.value.filter(c => c.id !== props.course.id)
  visible.value = false
  ElMessage.info(`已移除待定课程「${props.course.name}」`)
}

const jobLinks = computed(() => courseJobLinkMap[props.course.id] || [])
const sortedLinks = computed(() => [...jobLinks.value].sort((a, b) => b.coverage - a.coverage))

const highCount = computed(() => jobLinks.value.filter(l => l.coverage >= 70).length)
const midCount = computed(() => jobLinks.value.filter(l => l.coverage >= 40 && l.coverage < 70).length)
const lowCount = computed(() => jobLinks.value.filter(l => l.coverage < 40).length)
const avgCoverage = computed(() => {
  if (!jobLinks.value.length) return 0
  return Math.round(jobLinks.value.reduce((s, l) => s + l.coverage, 0) / jobLinks.value.length)
})

const categoryTagType = computed(() => {
  const map: Record<string, 'info' | 'success' | 'warning' | 'primary'> = {
    '专业基础课': 'info',
    '专业核心课': 'success',
    'AI实训课': 'warning',
    '专业拓展课': 'primary',
  }
  return map[props.course.category] || 'primary'
})

function coverageLevel(val: number) {
  if (val >= 70) return 'level--high'
  if (val >= 40) return 'level--mid'
  return 'level--low'
}
</script>

<style scoped lang="scss">
/* ====== Header ====== */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &__left {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
  }

  &__right {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
  }

  &__icon {
    color: var(--iflyv-brand-primary);
  }

  &__title {
    font: var(--iflyv-font-title-primary);
    color: var(--iflyv-text-1);
  }
}

.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border: 1px solid var(--iflyv-border-primary);
  border-radius: var(--iflyv-radius-full);
  background: var(--iflyv-bg-panel);
  color: var(--iflyv-text-2);
  font: var(--iflyv-font-label-primary);
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--iflyv-brand-primary);
    color: var(--iflyv-brand-primary);
    background: var(--iflyv-brand-bg);
  }
}

.pending-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  background: linear-gradient(135deg, #7c3aed, var(--iflyv-brand-primary));
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--iflyv-radius-full);
  animation: pendingPulse 2s ease-in-out infinite;
}

@keyframes pendingPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.75; }
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--iflyv-text-3);
  cursor: pointer;
  border-radius: var(--iflyv-radius-smallmodule);
  transition: all 0.15s;

  &:hover {
    background: var(--iflyv-bg-inset);
    color: var(--iflyv-text-1);
  }
}

/* ====== Body ====== */
.dialog-body {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-5);
}

/* ====== Pending hint ====== */
.pending-hint {
  display: flex;
  gap: var(--iflyv-spacing-3);
  padding: var(--iflyv-spacing-4);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.06) 0%, rgba(54, 88, 255, 0.04) 100%);
  border: 1px dashed rgba(124, 58, 237, 0.25);
  border-radius: var(--iflyv-radius-smallmodule);

  &__icon {
    color: #7c3aed;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font: var(--iflyv-font-body-sub);
    font-weight: 600;
    color: #7c3aed;
  }

  &__desc {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
    line-height: 1.5;
  }
}

/* ====== Info row ====== */
.info-row {
  display: flex;
  gap: var(--iflyv-spacing-5);
  padding: var(--iflyv-spacing-4);
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  text-align: center;

  &__label {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
  }

  &__value {
    font: var(--iflyv-font-title-primary);
    color: var(--iflyv-text-1);

    &--brand {
      color: var(--iflyv-brand-primary);
    }
  }
}

/* ====== Prerequisites ====== */
.prereq-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--iflyv-spacing-2);
}

.prereq-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-full);
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-text-2);
  border: 1px solid var(--iflyv-border-light);

  &--successor {
    background: var(--iflyv-brand-bg);
    border-color: transparent;
    color: var(--iflyv-brand-primary);
  }
}

/* ====== Sections ====== */
.section {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-3);

  &--compact {
    flex: 1;
    min-width: 0;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-2);
    font: var(--iflyv-font-title-primary);
    color: var(--iflyv-text-1);
  }

  &__bar {
    width: 4px;
    height: 18px;
    border-radius: 2px;
    background: var(--iflyv-text-3);
    flex-shrink: 0;

    &--brand {
      background: var(--iflyv-brand-primary);
    }
  }

  &__count {
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-3);
    background: var(--iflyv-bg-inset);
    padding: 1px var(--iflyv-spacing-2);
    border-radius: var(--iflyv-radius-full);
    margin-left: auto;
  }

  &__text {
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-2);
    line-height: 1.7;
    margin: 0;
  }
}

.two-col {
  display: flex;
  gap: var(--iflyv-spacing-5);
}

/* ====== Objectives ====== */
.objective-list {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);
}

.objective-item {
  display: flex;
  align-items: flex-start;
  gap: var(--iflyv-spacing-2);
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-text-2);
  line-height: 1.5;

  &__num {
    width: 20px;
    height: 20px;
    border-radius: var(--iflyv-radius-full);
    background: var(--iflyv-brand-bg);
    color: var(--iflyv-brand-primary);
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
}

/* ====== Content tags ====== */
.content-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--iflyv-spacing-2);
}

.content-tag {
  padding: var(--iflyv-spacing-1) var(--iflyv-spacing-3);
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-full);
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-text-2);
  border: 1px solid var(--iflyv-border-light);
}

/* ====== Method tags ====== */
.method-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--iflyv-spacing-2);
}

.method-tag {
  padding: var(--iflyv-spacing-1) var(--iflyv-spacing-3);
  background: var(--iflyv-brand-bg);
  border-radius: var(--iflyv-radius-full);
  font: var(--iflyv-font-body-sub);
  color: var(--iflyv-brand-primary);
  font-weight: 500;
}

/* ====== Edit form ====== */
.edit-form {
  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--iflyv-spacing-3);
  }

  &__row--3 {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.prereq-edit {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);
  width: 100%;

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--iflyv-spacing-2);
    min-height: 32px;
    align-items: center;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px 4px 10px;
    background: var(--iflyv-brand-bg);
    border-radius: var(--iflyv-radius-full);
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-brand-primary);
    font-weight: 500;
  }

  &__remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: none;
    background: none;
    color: var(--iflyv-text-3);
    cursor: pointer;
    border-radius: var(--iflyv-radius-full);
    transition: all 0.15s;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
      color: var(--iflyv-text-1);
    }
  }

  &__empty {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-4);
  }

  &__select {
    max-width: 240px;
  }
}

/* ====== Coverage list ====== */
.coverage-list {
  display: flex;
  flex-direction: column;
  gap: var(--iflyv-spacing-2);
}

.coverage-card {
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);
  padding: var(--iflyv-spacing-3) var(--iflyv-spacing-4);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background: var(--iflyv-bg-panel);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &--active {
    border-color: var(--iflyv-brand-primary);
    background: var(--iflyv-bg-panel);
    box-shadow: 0 2px 8px rgba(54, 88, 255, 0.08);
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: var(--iflyv-spacing-2);
  }

  &__info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__name {
    font: var(--iflyv-font-body-sub);
    font-weight: 600;
    color: var(--iflyv-text-1);
  }

  &__percent {
    font-size: 14px;
    font-weight: 700;

    &.level--high { color: var(--iflyv-success-primary); }
    &.level--mid { color: var(--iflyv-warning-primary); }
    &.level--low { color: var(--iflyv-text-3); }
  }

  &__bar-wrap {
    height: 6px;
    background: var(--iflyv-border-light);
    border-radius: 3px;
    overflow: hidden;
  }

  &__bar {
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);

    &.level--high { background: var(--iflyv-success-primary); }
    &.level--mid { background: var(--iflyv-warning-primary); }
    &.level--low { background: var(--iflyv-text-4); }
  }

  &__detail {
    margin-top: var(--iflyv-spacing-3);
    padding-top: var(--iflyv-spacing-3);
    border-top: 1px solid var(--iflyv-border-light);
  }

  &__label {
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
    margin-bottom: var(--iflyv-spacing-2);
  }

  &__skills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--iflyv-spacing-2);
  }
}

.skill-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px var(--iflyv-spacing-2);
  background: var(--iflyv-success-bg);
  color: var(--iflyv-success-primary);
  border-radius: var(--iflyv-radius-full);
  font: var(--iflyv-font-label-primary);
  font-weight: 500;
}

/* ====== Expand transition ====== */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
}

/* ====== Action bar ====== */
.action-bar {
  display: flex;
  gap: var(--iflyv-spacing-3);
  padding-top: var(--iflyv-spacing-4);
  border-top: 1px solid var(--iflyv-border-light);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--iflyv-spacing-2);
  padding: 10px var(--iflyv-spacing-5);
  border-radius: var(--iflyv-radius-smallmodule);
  font: var(--iflyv-font-body-sub);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &--primary {
    background: var(--iflyv-brand-primary);
    color: #fff;

    &:hover {
      box-shadow: 0 4px 12px rgba(54, 88, 255, 0.3);
      transform: translateY(-1px);
    }
  }

  &--ai {
    background: linear-gradient(135deg, var(--iflyv-brand-primary), #7c3aed);
    color: #fff;

    &:hover {
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
      transform: translateY(-1px);
    }
  }

  &--outline {
    background: transparent;
    border: 1px solid var(--iflyv-border-primary);
    color: var(--iflyv-text-2);

    &:hover {
      border-color: var(--iflyv-brand-primary);
      color: var(--iflyv-brand-primary);
      background: var(--iflyv-brand-bg);
    }
  }

  &--danger-outline {
    background: transparent;
    border: 1px solid var(--iflyv-border-primary);
    color: var(--iflyv-text-3);

    &:hover {
      border-color: var(--iflyv-danger-primary, #EF4444);
      color: var(--iflyv-danger-primary, #EF4444);
      background: var(--iflyv-danger-bg, #FEF2F2);
    }
  }
}

/* ====== Coverage summary ====== */
.coverage-summary {
  display: flex;
  align-items: center;
  gap: var(--iflyv-spacing-4);
  padding: var(--iflyv-spacing-3) var(--iflyv-spacing-4);
  background: var(--iflyv-bg-inset);
  border-radius: var(--iflyv-radius-smallmodule);

  &__item {
    display: flex;
    align-items: center;
    gap: var(--iflyv-spacing-1);
    font: var(--iflyv-font-label-primary);
    color: var(--iflyv-text-3);
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &--high { background: var(--iflyv-success-primary); }
    &--mid { background: var(--iflyv-warning-primary); }
    &--low { background: var(--iflyv-text-4); }
  }

  &__num {
    font-weight: 600;
    color: var(--iflyv-text-1);
    margin-left: 2px;
  }

  &__avg {
    margin-left: auto;
    font: var(--iflyv-font-body-sub);
    color: var(--iflyv-text-3);
  }

  &__avg-val {
    font-weight: 700;
    color: var(--iflyv-brand-primary);
    margin-left: 4px;
  }
}
</style>
