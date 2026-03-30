# Component Architecture Guide

## Table of Contents
1. [App.vue — Page Layout](#appvue)
2. [SystemMap.vue — Homepage](#systemmapvue)
3. [MajorDetail.vue — Coordinator](#majordetailvue)
4. [MajorBasicInfo.vue — Info + Actions](#majorbasicinfovue)
5. [CourseMap.vue — SVG Prerequisite Lines](#coursemapvue)
6. [CourseDetailDialog.vue — Edit Mode](#coursedetaildialogvue)
7. [CompetencyRadar.vue — ECharts Radar](#competencyradarvue)
8. [CourseJobChord.vue — Chord Diagram](#coursejobchordvue)
9. [MajorAtlasView.vue — Force Graph](#majoratlasviewvue)
10. [JobList.vue — Filterable Jobs](#joblistvue)
11. [SectionTitle.vue — Reusable Header](#sectiontitlevue)

---

## App.vue

Two-page SPA controlled by `currentPage` ref (`'home' | 'major'`).

**Home page**: Full-screen, no sidebar. Renders `<SystemMap>`.

**Major page**: Three-zone layout:
- **Topbar** (56px fixed): Back button + brand + current major breadcrumb + user avatar
- **Sidebar** (200px): "我的专业" (Star icon, primary major) + "专业群其他专业" (Layers icon, sibling majors)
- **Content** (flex: 1, scrollable): `<MajorDetail>` inside max-width 1200px card

Key constants at top of script:
```typescript
const MY_MAJOR_ID = 'm1'    // Customize per deployment
const MY_COLLEGE_ID = 'c1'  // Customize per deployment
```

Active sidebar item: `.nav-major--active` with 3px left accent bar.

---

## SystemMap.vue

Homepage with centered AI greeting + input bar and module grid.

**AI Hero Section**: Greeting text + `<input>` with send button + 4 suggestion chips.

**Module Grid** (3-column): 5 cards for platform modules:
- 专业调研 (external URL)
- 岗位群管理 (placeholder)
- 专业群建设 (emits `enterMajor`)
- 专业管理 (span 2, emits `enterMajor`)
- 课程管理 (external URL)

Card hover: `translateY(-4px) scale(1.02)`, top color bar `scaleX(0→1)`, icon `scale(1.1) rotate(-4deg)`.

---

## MajorDetail.vue

Central coordinator. Props: `majorId`.

**Reactive state**:
```typescript
const jobs = ref<JobMatch[]>([])       // Mutable for add/remove
const courses = ref<Course[]>([])      // Mutable for edit
```

Both initialized via `watch(majorId)` from data maps.

**Page header**: Title + inline info tags (专业代码, 培养层次, 学制, etc.) + training plan link.

**Sections** (staggered animation `--i * 0.07s`):
1. MajorBasicInfo (description + 3 action cards)
2. JobList (岗位匹配清单)
3. CompetencyRadar + chord/atlas buttons (岗位能力图谱)
4. CourseJobChord (modal dialog)
5. CourseMap (专业课程地图)

**Event handlers**:
- `addJob(job)` / `removeJob(jobId)` — mutate `jobs` array
- `updateCourse(course)` — splice updated course into `courses` array
- `handleAction(key)` — placeholder for knowledge base / agent / enterprise links

---

## MajorBasicInfo.vue

Props: `info: MajorInfo`. Emits: `action(key: string)`.

Two sections:
1. **Description**: Left-bordered text block
2. **Action cards** (3-column grid): 专业知识库 / 专业智能体 / 关联企业
   - Each shows icon + label + count + "查看详情 >"
   - Hover: translateY(-2px) + border highlight

---

## CourseMap.vue — SVG Prerequisite Lines

**This is a key differentiator.** The component overlays SVG bezier curves on top of a semester grid.

### Template Structure
```html
<div class="semester-wrap" ref="wrapRef">
  <!-- SVG overlay: z-index 10, pointer-events none -->
  <svg class="link-svg">
    <defs><marker id="arrow" ... /></defs>
    <path v-for="link in links" :d="link.d" class="link-path" />
  </svg>

  <!-- Semester grid: 6-column -->
  <div class="semester-grid">
    <div v-for="sem in semesters" class="semester-col">
      <div class="semester-col__header">...</div>
      <div class="semester-col__body">
        <div v-for="course in getCoursesBySemester(sem)"
          :ref="(el) => setCourseRef(course.id, el)"
          class="course-chip"
          @mouseenter="hoveredCourse = course.id"
          @mouseleave="hoveredCourse = null">
        </div>
      </div>
    </div>
  </div>
</div>
```

### Line Calculation (calcLinks)
```typescript
// For each prerequisite edge (from → to):
const fromRect = fromEl.getBoundingClientRect()
const toRect = toEl.getBoundingClientRect()
const wrapRect = wrapRef.getBoundingClientRect()

// Start: right-center of "from" card
const x1 = fromRect.right - wrapRect.left
const y1 = fromRect.top + fromRect.height / 2 - wrapRect.top

// End: left-center of "to" card
const x2 = toRect.left - wrapRect.left
const y2 = toRect.top + toRect.height / 2 - wrapRect.top

// Cubic bezier with 40% horizontal control offset
const cp = Math.max(Math.abs(x2 - x1) * 0.4, 30)
const d = `M${x1},${y1} C${x1+cp},${y1} ${x2-cp},${y2} ${x2},${y2}`
```

### Critical CSS
```scss
.link-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;           // MUST be above the grid
}

.link-path {
  fill: none;
  stroke: var(--iflyv-text-4);
  stroke-width: 1.2;
  stroke-dasharray: 4 3;
  opacity: 0.45;

  &--hover {             // When related course is hovered
    opacity: 1;
    stroke: var(--iflyv-brand-primary);
    stroke-width: 1.8;
    stroke-dasharray: none;
  }
}
```

### Hover Interaction
- `hoveredCourse` ref tracks which course card is under the mouse
- Related courses (prerequisites + successors) get `course-chip--highlighted` (brand ring)
- Unrelated courses get `course-chip--dimmed` (opacity 0.35)
- Related lines get `link-path--hover` (solid brand color)

### Recalculation
- `ResizeObserver` on wrapRef triggers recalc
- `watch(courses, { deep: true })` triggers recalc on edits
- `onMounted` → `nextTick(calcLinks)`

---

## CourseDetailDialog.vue — Edit Mode

Two modes: **View** and **Edit**.

**View mode**: Basic info row + prerequisites + successors + description + objectives + contents + methods + coverage bars + action buttons.

**Edit mode** (toggled by "编辑" button in header):
- Form fields: name, category (select), credits (input-number), hours, semester, description (textarea)
- **Prerequisite editor**: Tag list with remove buttons + filterable el-select dropdown to add
- Save emits `update-course` with full updated Course object

```typescript
function saveEdits() {
  const updated: Course = {
    ...props.course,
    name: editForm.name,
    // ... all editable fields
    prerequisites: [...editForm.prerequisites],
  }
  emit('update-course', updated)
}
```

Props: `course: Course`, `allCourses?: Course[]` (needed for prerequisite name lookup).

---

## CompetencyRadar.vue

ECharts radar chart. Data from `competencyMap[majorId]`.

- 6-10 indicators arranged radially
- Filled area with brand color at 30% opacity
- Border line at full brand color
- Tooltip shows competency name + value

---

## CourseJobChord.vue

ECharts graph (circular layout) showing course → job relationships.

- **Job nodes**: 42px, blue, positioned on right
- **Course nodes**: 24-54px (size scales with link count), color-coded by category
- **Links**: Width proportional to coverage, color by level (≥70 green, 40-69 orange, <40 gray)
- **Stats panel below**: 4-column overview + horizontal coverage bars

---

## MajorAtlasView.vue — Force-Directed Graph

Full-screen overlay (teleport to body) with ECharts force graph.

### 6-Level Node Hierarchy
| Level | Type | Color | Size | Parent |
|-------|------|-------|------|--------|
| 1 | Major (center) | #EF4444 | 58px | — |
| 2 | Job | #3658FF | 42px | Major |
| 3 | Task | #22C55E | 26px | Job (expanded) |
| 4 | Course | #F5A623 | 28px | Job (expanded) |
| 5 | Learning Task | #06B6D4 | 22px | Course (expanded) |
| 6 | Ability | varies | 14-30px | Task or LT |

### Key Features
- **Double-click to expand/collapse** jobs → reveals tasks + courses
- **Bridge nodes**: Abilities linked from BOTH job tasks and learning tasks get special styling (white bg + colored border + glow)
- **Sidebar detail card**: Shows metadata for selected node
- **Stats panel**: Node count, link count, expanded jobs, bridge count
- **Reset & Expand All buttons**

### Force Simulation Config
```typescript
force: {
  repulsion: [200, 410],  // adaptive
  gravity: 0.06,
  edgeLength: [50, 160],
  friction: 0.6,
}
```

---

## JobList.vue

Category filter chips + 3-column job card grid + AI recommendations section.

- **Filter**: 7 category chips with colored dots
- **Job cards**: Match rate progress bar (color-coded), salary, demand badge, skills tags, remove button
- **AI section**: Gradient background, glassmorphic cards with suggested courses
- **Add job**: Picker dialog with search, category filters, checkbox list

---

## SectionTitle.vue

Simple reusable component:
```html
<div class="section-title">
  <span class="section-title__bar" />     <!-- 4x18px brand accent -->
  <component :is="icon" />                 <!-- lucide icon -->
  <h2>{{ title }}</h2>
  <span v-if="count" class="section-title__count">{{ count }}</span>
</div>
```

Props: `title: string`, `icon: Component`, `count?: number`.
