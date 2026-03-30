# Component Architecture Guide

## Table of Contents
1. [App.vue — Multi-Page Layout](#appvue)
2. [SystemMap.vue — Homepage](#systemmapvue)
3. [MajorDetail.vue — Coordinator](#majordetailvue)
4. [MajorBasicInfo.vue — Info + Actions](#majorbasicinfovue)
5. [CourseMap.vue — SVG Prerequisite Lines](#coursemapvue)
6. [CourseDetailDialog.vue — Edit Mode](#coursedetaildialogvue)
7. [CompetencyRadar.vue — ECharts Sankey](#competencyradarvue)
8. [CourseJobChord.vue — Chord Diagram](#coursejobchordvue)
9. [MajorAtlasView.vue — Force Graph](#majoratlasviewvue)
10. [JobList.vue — Filterable Jobs + AI Recommendations](#joblistvue)
11. [SectionTitle.vue — Reusable Header](#sectiontitlevue)
12. [DataOverview.vue — Data Statistics](#dataoverviewvue)
13. [PlanManagement.vue — Training Plan CRUD](#planmanagementvue)
14. [PlanParseConfirm.vue — Plan Parse Step 1](#planparseconfirmvue)
15. [PlanDataSearch.vue — Data Retrieval Step 2](#plandatasearchvue)
16. [PlanRevision.vue — Intelligent Revision Step 3](#planrevisionvue)
17. [PlanPreview.vue — Document Preview](#planpreviewvue)
18. [PlanResearch.vue — Research Landing](#planresearchvue)
19. [TeamManagement.vue — Team Dialog](#teammanagementvue)
20. [PlaceholderPage.vue — WIP Features](#placeholderpagevue)

---

## App.vue

Multi-page SPA controlled by `currentPage` ref (`'home' | 'major-detail' | 'plan-mgmt' | 'data-stats' | 'plan-research' | 'plan-parse' | 'plan-datasearch' | 'plan-revision' | 'plan-preview'`).

**Home page**: Full-screen, no sidebar. Renders `<SystemMap>`.

**All other pages**: Three-zone layout:
- **Icon-rail** (72px fixed): Vertical strip with icon+label navigation items
- **Sub-menu** (180px, context-dependent): Changes based on currentPage
- **Main area** (flex: 1): Breadcrumb bar (48px) + scrollable content

### Icon-Rail Navigation
```typescript
const railItems: RailItem[] = [
  { id: 'major', label: '专业管理', icon: Settings, page: 'major-detail' },
  { id: 'plan', label: '人培方案', icon: FileText, page: 'plan-mgmt' },
  { id: 'research', label: '人培调研', icon: ClipboardPenLine, page: 'plan-research' },
  { id: 'stats', label: '数据概览', icon: PieChart, page: 'data-stats' },
]
```

Active item: 3px left brand-color accent bar + brand background.

### Sub-Menu Variants
| Page | Sub-menu content |
|------|------------------|
| `major-detail` | "我的专业" primary major + "专业群其他专业" sibling list |
| `data-stats` | "专业筛选" — clickable major codes for filtering |
| `plan-mgmt` | "专业目录" — searchable college/major tree with expand/collapse |
| `plan-research` | No sub-menu (full-width content with `major-content--full` class) |
| `plan-parse` | No sub-menu (full-width, plan workflow step 1) |
| `plan-datasearch` | No sub-menu (full-width, plan workflow step 2) |
| `plan-revision` | No sub-menu (full-width, plan workflow step 3) |
| `plan-preview` | No sub-menu (full-width, document preview) |

### School-Specific Data in App.vue
```typescript
const MY_MAJOR_ID = 'm1'    // Customize per deployment
const MY_COLLEGE_ID = 'c1'  // Customize per deployment

// College/major tree for plan management sidebar
const orgData: OrgCollege[] = [
  { id: 'org-1', name: '人工智能学院', children: [...] },
  // ... customize per school
]

// Major list for data overview filtering
const statsMajorList = [
  { code: '610205', name: '软件技术' },
  // ... customize per school
]
```

### Plan Workflow State
```typescript
// Active plan metadata (passed as props to all plan workflow components)
const activePlanName = ref('2026级软件技术专业人才培养方案')
const activePlanCode = ref('610205')
const activePlanMajor = ref('软件技术')
const activePlanYear = ref('2026')

// Plan flow navigation handlers
function handleEnterPlanFlow(plan: { name, code, major, year, target }) { ... }
function handlePlanNavigate(target: string) { ... }
function handlePlanBack() { currentPage.value = 'plan-mgmt' }
```

Plan workflow pages (`plan-parse`, `plan-datasearch`, `plan-revision`, `plan-preview`) all map to the `plan` rail item in `activeRailId` computed property and use `major-content--full` class.

### Breadcrumb Navigation
Top bar shows: `系统首页 > 专业建设中心 > [current page]`. Each segment is clickable.

---

## SystemMap.vue

Homepage with top header, centered AI greeting + chat input, tool buttons, todo panel, and module grid.

**Top Header**: School logo + name (left) | Role switch (管理员/教师) + divider + user avatar (right).

**AI Hero Section**:
- Greeting text with time-based message (早上好/下午好/晚上好)
- Multi-line `<textarea>` with rich toolbar:
  - Left: Attach button, knowledge base selector, model selector dropdown
  - Right: Voice input button, send button
- Model options: 星火大模型 V4.0 / V3.5 / V3.0

**AI Tool Grid**: 4 circular icon buttons below the chat box (专业助手, 数据分析, 课程规划, 政策解读).

**Todo Panel**: Collapsible section showing pending tasks with checkboxes, due dates, and completion status.

**Module Grid** (3-column): 6 cards for platform modules:
- 专业调研 (external URL or opens demo-zj-mec project)
- 岗位群管理 (placeholder)
- 专业群建设 (emits `navigate('major-build')`)
- 专业管理 (span 2, emits `navigate('major-build')`)
- 课程管理 (external URL)
- AI创新工坊 (placeholder)

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

**Page header**: Title + inline info tags (专业代码, 培养层次, 学制, etc.) + training plan link + team management button with member count badge.

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
- `showTeamDialog` — open TeamManagement dialog

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

ECharts Sankey chart showing industry chain → industry → position → course → major relationships.

- 5-column layout with color-coded categories
- Statistics panel showing coverage metrics
- Coverage rule dialog explaining calculation formulas
- Detailed breakdown by job and course

---

## CourseJobChord.vue

ECharts graph (circular layout) showing course → job relationships.

- **Job nodes**: 42px, blue, positioned on right
- **Course nodes**: 24-54px (size scales with link count), color-coded by category
- **Links**: Width proportional to coverage, color by level (≥70 green, 40-69 orange, <40 gray)
- **Stats panel below**: 4-column overview + horizontal coverage bars
- **Coverage rule dialog**: Explains the matching formula

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
- **Suggested courses**: When an AI-recommended job is added, shows new course suggestions with "创建课程" buttons
- **Rule explanation dialog**: Shows matching rate calculation formula

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

---

## DataOverview.vue

Comprehensive data statistics page. Props: `majorFilter: string` (major code for filtering).

**4 main stat cards** at top:
- 19 职教政策 | 3 国家标准 | 12 人培方案库 | 64 岗课证赛

**Expandable detail sections** below each card:
- **职教政策**: Policy documents with dates and relevance tags
- **国家标准**: National standards with status indicators
- **人培方案库**: Collected training plans from other institutions
- **岗课证赛**: Job-related certificates, competitions, and courses

Supports filtering by major code via the sidebar sub-menu.

---

## PlanManagement.vue

Full CRUD interface for managing training plans (人才培养方案). Props: `majorFilter: string`.

**Features**:
- **View toggle**: Grid (default) and list views
- **Filters**: Status dropdown (全部/草稿/已发布), year filter, keyword search
- **Plan cards**: Show plan name, major, year, status badge, progress bar, last modified date
- **Actions per plan**: Preview, intelligent revision (AI), export to Word, delete
- **Import dialog**: Upload Word documents for new plans
- **Team dialog**: Manage team members for collaborative plan editing

**Sample data**: 7 training plans with different statuses (草稿/已发布) and progress (30-100%).

**Plan workflow entry**: Emits `enter-plan-flow` with payload `{ name, code, major, year, target }`:
- "导入" → target `plan-parse`
- "编辑" → target `plan-revision`
- "预览" → target `plan-preview`

---

## PlanParseConfirm.vue

Step 1 of the plan workflow. Parses an uploaded training plan document and matches its structure against a standard template.

Props: `planName`, `planCode`, `planMajor`, `planYear`. Emits: `back`, `navigate`.

**Two phases**:
1. **Progress phase**: 5-step auto-advancing animation (700ms intervals) showing document analysis steps
2. **Result phase**: Left-right comparison of source document sections vs template sections

**Result phase layout**:
- **Toolbar**: Match statistics (source matched/unmatched, template matched/unmatched) + "确认并进入数据检索" button
- **Left panel**: Source sections extracted from the uploaded document, each with matched/unmatched status
- **Right panel**: Template sections with diagnostic rules (12 standard items like 专业名称与代码, 入学要求, 培养目标 etc.)
- **Click interaction**: Clicking a matched source section highlights its corresponding template pair and vice versa

**Navigation**: "确认并进入数据检索" emits `navigate('plan-datasearch')`.

**Step indicator**: Shows Step 1 active/done, Steps 2-3 upcoming.

**Data to customize per school**: `TEMPLATE` array (12 template sections with diagnostic rules), `sources` ref (source document sections with `matchKeys`).

---

## PlanDataSearch.vue

Step 2 of the plan workflow. Retrieves reference data from the knowledge base for plan revision.

Props: `planName`, `planCode`, `planMajor`, `planYear`. Emits: `back`, `navigate`.

**Two phases**:
1. **Searching phase**: 5-step progress animation (分析报告 → 匹配国标 → 检索岗课证赛 → 检索同类方案 → 冲突检测), auto-advances at 500ms intervals
2. **Result phase**: Categorized data selection interface

**Result phase — 4 data categories**:

| Category | Mode | Features |
|----------|------|----------|
| 用户上传报告 | `report` | Cards with AI summary, delete button, expandable detail |
| 国标与政策 | `summary` | Checkable items, locked/必选 items (disabled checkbox), expand/collapse at 8 items |
| 同类院校方案 | `summary` | Checkable school plans, expand/collapse at 8 items |
| 岗位·课程·证书·赛事 | `data-tabs` | 4 sub-tabs (position/course/cert/comp), checkable cards, expand/collapse |

**Key interactions**:
- **Category expand/collapse**: Click header to toggle
- **Checkbox selection**: Individual item checking (locked items cannot be unchecked)
- **"从库中添加" drawer**: Right-side drawer with category-specific filters (policy type, province, school, major, year), search button, add button
- **Confirmation dialog**: Before proceeding, warns if categories have no selections (uses ElMessageBox)

**Navigation**: "确认并开始修订" emits `navigate('plan-revision')`.

**Data to customize per school**:
- `searchData` ref: 4 categories with items adapted to the school's major (report titles, national standards matching the major code, peer institutions, job/course/cert/comp data)
- `LIB_DATA`: Library search results for each category
- `SEARCH_STEPS`: Step descriptions and result counts

**Icons**: Uses lucide-vue-next (FileText, BookOpen, GraduationCap, BarChart3) instead of emoji for category headers.

---

## PlanRevision.vue

Step 3 of the plan workflow. AI-assisted intelligent revision editor with 3-panel layout.

Props: `planName`, `planCode`, `planMajor`, `planYear`. Emits: `back`, `navigate`.

**Action bar**: Back button + plan info + buttons (收起目录, 修订对比, 诊断, 保存, 预览)

**3-panel layout**:
1. **Left sidebar** (collapsible): Chapter navigation with issue badges, expand/collapse groups, active item highlighting
2. **Center editor**: Rich text editor with formatting toolbar (Bold, Italic, Underline, H1-H3, lists, table insert). Compare mode shows side-by-side original vs revised text
3. **Right AI panel** (toggleable): 3 tabs:
   - **智能诊断**: Multi-dimension analysis (国标符合度, 行业匹配度, 课程逻辑, 格式规范) with issue items
   - **修订建议**: Two types — A-type (whole-section rewrite) and B-type (item-by-item suggestions)
   - **问问智灵**: Chat interface with mock AI responses

**Key data**:
- `NAV_DATA`: 9 top-level chapter items, some with children, issue badge counts
- `DIAGNOSIS_DATA`: 4 diagnostic dimensions with scored items
- `REVISION_DATA`: Mixed A/B type revision suggestions per chapter

**Navigation**: "预览" button emits `navigate('plan-preview')`.

---

## PlanPreview.vue

Full-page document-style preview with table of contents and export.

Props: `planName`, `planCode`, `planMajor`, `planYear`. Emits: `back`, `navigate`.

**Top bar**: Back button + plan metadata + status tag (草稿) + action buttons (智能修订, 导出Word)

**Layout**:
- **Left TOC sidebar**: Hierarchical table of contents with scroll spy (tracks active section via `handleScroll` on the content container's scroll event)
- **Right document content**: A4-style rendering with cover page, 9 chapters, tables, structured sections

**Key data**: `PLAN_SECTIONS` array with hierarchical content data (id, name, level, content HTML, children).

**Scroll spy**: Uses `IntersectionObserver` or scroll position calculation to highlight the current visible section in the TOC.

**Navigation**: "智能修订" button emits `navigate('plan-revision')`.

---

## MajorDetail.vue — Empty Major Upload Entry

When a major has no data in `majorInfoMap`, MajorDetail shows an empty state with an upload entry:

- **Upload area**: Dashed border box with drag/click UI, accepts training plan documents
- **Upload dialog** (`el-dialog` with `append-to-body`): Confirmation form with plan name, year selector, file preview
- **On confirm**: Emits `enter-plan-flow` with `{ name, code, major, year, target: 'plan-parse' }` to start the parse workflow

The `append-to-body` attribute is critical to escape the parent component's stacking context and prevent z-index issues.

`MAJOR_CODE_MAP` provides major codes for majors that don't have `majorInfoMap` entries.

---

## PlanResearch.vue

Full-screen landing page for discovering professional training plans from other institutions.

**Visual design**: Gradient background (geekblue) with decorative glow effects.

**Content**:
- Hero text: "人才培养方案调研平台" with description
- Search input bar with AI integration
- Stats counter: "已收录 17 篇院校人才培养方案"
- Click redirects to external training plan research portal

Layout uses `major-content--full` class (no padding, no scroll).

---

## TeamManagement.vue

Dialog component for managing professional construction teams.

**Features**:
- Visual avatar strip with overlapping colored circles
- Team member list with name, role, and remove button
- Inline form to add new members: name input + role selector
- Role options: 专业负责人, 骨干教师, 课程负责人, 企业导师
- Confirmation before removing members

Used in both MajorDetail (team button in header) and PlanManagement (team management for plans).

---

## PlaceholderPage.vue

Generic placeholder for features under construction.

Props: `icon: Component`, `title: string`, `description: string`, `tags: string[]`.

Displays centered content with icon, title, description text, feature tags, and a "功能建设中" notice.
