<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title=""
    width="560px"
    :show-close="false"
    align-center
    destroy-on-close
    append-to-body
  >
    <template #header>
      <div class="team-dialog-header">
        <div class="team-dialog-header__left">
          <Users :size="20" :stroke-width="2" class="team-dialog-header__icon" />
          <span class="team-dialog-header__title">专业建设团队</span>
          <span class="team-dialog-header__count">{{ members.length }}</span>
        </div>
        <div class="team-dialog-header__right">
          <button class="team-add-btn" @click="showAddForm = true">
            <UserPlus :size="14" :stroke-width="2" />
            添加成员
          </button>
          <button class="close-btn" @click="emit('update:modelValue', false)">
            <X :size="18" :stroke-width="2" />
          </button>
        </div>
      </div>
    </template>

    <!-- 头像概览 -->
    <div class="team-avatars">
      <div
        v-for="(m, i) in members"
        :key="m.id"
        class="team-avatars__item"
        :style="{ zIndex: members.length - i }"
        :title="m.name"
      >
        <div class="team-avatars__circle" :style="{ background: m.color }">
          {{ m.name.slice(-1) }}
        </div>
        <span v-if="m.role === '专业负责人'" class="team-avatars__badge">负责人</span>
      </div>
      <span class="team-avatars__total">{{ members.length }}人</span>
    </div>

    <!-- 成员列表 -->
    <div class="member-list">
      <div v-for="m in members" :key="m.id" class="member-card">
        <div class="member-card__avatar" :style="{ background: m.color }">
          {{ m.name.slice(-1) }}
        </div>
        <div class="member-card__info">
          <div class="member-card__name-row">
            <span class="member-card__name">{{ m.name }}</span>
            <span v-if="m.role" class="member-card__tag">{{ m.role }}</span>
            <span v-if="m.isSelf" class="member-card__tag member-card__tag--self">本人</span>
          </div>
          <span class="member-card__uid">{{ m.uid }}</span>
        </div>
        <button
          v-if="!m.isSelf"
          class="member-card__remove"
          @click="handleRemove(m)"
        >移除</button>
      </div>
    </div>

    <!-- 添加成员内嵌表单 -->
    <div v-if="showAddForm" class="add-form">
      <div class="add-form__title">添加新成员</div>
      <div class="add-form__fields">
        <el-input v-model="newMember.uid" placeholder="工号，如 js103" size="default" />
        <el-input v-model="newMember.name" placeholder="姓名" size="default" />
        <el-select v-model="newMember.role" placeholder="角色" size="default" style="width: 100%">
          <el-option label="专业负责人" value="专业负责人" />
          <el-option label="骨干教师" value="骨干教师" />
          <el-option label="课程负责人" value="课程负责人" />
          <el-option label="企业导师" value="企业导师" />
        </el-select>
      </div>
      <div class="add-form__actions">
        <el-button size="default" @click="showAddForm = false">取消</el-button>
        <el-button size="default" type="primary" @click="handleAdd">确认添加</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Users, UserPlus, X } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [val: boolean] }>()

interface TeamMember {
  id: string
  name: string
  uid: string
  role: string
  isSelf: boolean
  color: string
}

const avatarColors = ['#6366F1', '#3B82F6', '#059669', '#E67E22', '#EF4444', '#8B5CF6', '#EC4899']

const members = ref<TeamMember[]>([
  { id: '1', name: '张老师', uid: 'js1', role: '专业负责人', isSelf: true, color: '#6366F1' },
  { id: '2', name: '教师122', uid: 'js122', role: '骨干教师', isSelf: false, color: '#3B82F6' },
  { id: '3', name: '李老师', uid: 'js45', role: '课程负责人', isSelf: false, color: '#059669' },
  { id: '4', name: '王工', uid: 'js78', role: '企业导师', isSelf: false, color: '#E67E22' },
])

const showAddForm = ref(false)
const newMember = reactive({ uid: '', name: '', role: '' })

function handleAdd() {
  if (!newMember.uid.trim() || !newMember.name.trim()) {
    ElMessage.warning('请填写工号和姓名')
    return
  }
  members.value.push({
    id: `m-${Date.now()}`,
    name: newMember.name,
    uid: newMember.uid,
    role: newMember.role,
    isSelf: false,
    color: avatarColors[members.value.length % avatarColors.length],
  })
  ElMessage.success(`已添加成员「${newMember.name}」`)
  newMember.uid = ''
  newMember.name = ''
  newMember.role = ''
  showAddForm.value = false
}

function handleRemove(m: TeamMember) {
  ElMessageBox.confirm(`确定移除成员「${m.name}」？`, '移除确认', {
    confirmButtonText: '移除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    members.value = members.value.filter(item => item.id !== m.id)
    ElMessage.success(`已移除「${m.name}」`)
  }).catch(() => {})
}
</script>

<style scoped lang="scss">
/* ====== Dialog header ====== */
.team-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__icon {
    color: var(--iflyv-brand-primary);
  }

  &__title {
    font-size: 17px;
    font-weight: 700;
    color: var(--iflyv-text-1);
  }

  &__count {
    font-size: 14px;
    font-weight: 600;
    color: var(--iflyv-text-4);
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.team-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--iflyv-brand-primary);
  background: #fff;
  color: var(--iflyv-brand-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: var(--iflyv-brand-bg);
  }
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

/* ====== Avatar strip ====== */
.team-avatars {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--iflyv-border-light);

  &__item {
    position: relative;
    margin-right: -8px;
  }

  &__circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border: 2px solid #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &__badge {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    font-weight: 600;
    color: #fff;
    background: var(--iflyv-brand-primary);
    padding: 1px 5px;
    border-radius: 6px;
    white-space: nowrap;
    line-height: 1.3;
  }

  &__total {
    margin-left: 16px;
    font-size: 13px;
    font-weight: 500;
    color: var(--iflyv-text-3);
  }
}

/* ====== Member list ====== */
.member-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 10px;
  transition: background 0.15s;

  &:hover {
    background: var(--iflyv-bg-inset);
  }

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }

  &__name {
    font-size: 15px;
    font-weight: 600;
    color: var(--iflyv-text-1);
  }

  &__tag {
    padding: 1px 8px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 500;
    background: var(--iflyv-bg-inset);
    color: var(--iflyv-text-3);
    border: 1px solid var(--iflyv-border-light);

    &--self {
      background: var(--iflyv-brand-bg);
      color: var(--iflyv-brand-primary);
      border-color: transparent;
    }
  }

  &__uid {
    font-size: 12px;
    color: var(--iflyv-text-4);
  }

  &__remove {
    padding: 5px 14px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--iflyv-text-4);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;

    &:hover {
      color: #EF4444;
      background: #FEF2F2;
    }
  }
}

/* ====== Inline add form ====== */
.add-form {
  margin-top: 16px;
  padding: 16px;
  background: var(--iflyv-bg-inset);
  border-radius: 10px;

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--iflyv-text-1);
    margin-bottom: 12px;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 12px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>
