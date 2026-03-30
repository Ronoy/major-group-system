---
name: major-group-system
description: |
  Generate a complete 专业群建设系统 (Professional Group Construction System) frontend project for vocational colleges.
  Trigger this skill whenever the user wants to create a major/curriculum management system, provides training plan
  data (人才培养方案) for a college major, or asks to set up a 专业群建设 / 专业建设 / 课程地图 / 岗位匹配 project.
  Also trigger when the user mentions generating a curriculum visualization system, course-job mapping platform,
  or competency radar for a vocational education program. Even partial requests like "帮我生成一个专业的课程地图"
  or "我有一份人才培养方案，帮我做成系统" should trigger this skill.
---

# 专业群建设系统生成器

Generate a production-grade Vue 3 frontend for managing vocational college majors, mapping jobs to courses, visualizing curriculum-career relationships, and providing AI-powered insights.

## Reference Implementation

The canonical reference project lives at `./major-group-system`. When generating a new project, read components from this reference to ensure fidelity. The reference contains 23 Vue components, a complete design token system, ECharts visualizations, and a 3-step plan workflow (解析确认 → 数据检索 → 智能修订).

## Step 1: Gather Input

Collect the following from the user. If they provide a training plan document (PDF/Word), extract the information from it.

### Required
| Field | Example |
|-------|---------|
| School name (学校名称) | 深圳职业技术大学 |
| College name (学院名称) | 人工智能学院 |
| Primary major (主专业) | 软件技术 |
| Major code (专业代码) | 610205 |
| Training level (培养层次) | 高职(专科) |
| Duration (学制) | 3年 |
| Major group (专业大类) | 电子与信息大类 |
| Location (所在地) | 深圳 |

### Extracted from Training Plan
| Data | Description |
|------|-------------|
| Courses (课程列表) | Name, category, credits, hours, semester, description, prerequisites |
| Job matches (岗位匹配) | Name, category, match rate, salary range, skills, demand level |
| Competencies (能力图谱) | Competency items with proficiency values (0-100) |
| Course-Job links (课-岗关联) | Which courses cover which job skills, coverage percentage |

### Optional
| Field | Description |
|-------|-------------|
| Other majors in group (专业群其他专业) | Name + code for sibling majors |
| Tags (专业标签) | e.g., 省级特色专业, 产教融合 |
| Training plan URL | Link to official document |
| AI insights | Descriptive text about the major's strengths/opportunities |

## Step 2: Generate Project

### Project Structure
```
<project-name>/
├── src/
│   ├── App.vue                    # Multi-page layout (icon-rail + sub-menu + content)
│   ├── main.ts                    # Entry point
│   ├── components/
│   │   ├── SystemMap.vue          # Homepage: header + AI input + module grid + tools
│   │   ├── MajorDetail.vue        # Major detail coordinator
│   │   ├── MajorBasicInfo.vue     # Info description + action cards
│   │   ├── SectionTitle.vue       # Reusable section header
│   │   ├── SearchHero.vue         # Reusable search hero section
│   │   ├── AiInsights.vue         # AI insights display
│   │   ├── JobList.vue            # Filterable job cards + picker + AI recommendations
│   │   ├── JobProfileDialog.vue   # Job detail modal
│   │   ├── JobAtlasDialog.vue     # Job atlas modal
│   │   ├── CompetencyRadar.vue    # ECharts Sankey/radar chart
│   │   ├── CourseMap.vue          # Semester grid + SVG prerequisite lines
│   │   ├── CourseDetailDialog.vue # Course detail + edit mode
│   │   ├── CourseJobChord.vue     # ECharts chord diagram
│   │   ├── MajorAtlasView.vue    # Full-screen force-directed graph
│   │   ├── DataOverview.vue       # Data statistics with policies/standards/plans
│   │   ├── PlanManagement.vue     # Training plan CRUD management
│   │   ├── PlanParseConfirm.vue   # Step 1: Document parse + template matching
│   │   ├── PlanDataSearch.vue     # Step 2: Knowledge base retrieval + data selection
│   │   ├── PlanRevision.vue       # Step 3: AI-assisted intelligent revision editor
│   │   ├── PlanPreview.vue        # Document-style preview with TOC + export
│   │   ├── PlanResearch.vue       # Training plan research landing page
│   │   ├── TeamManagement.vue     # Team member management dialog
│   │   └── PlaceholderPage.vue    # Placeholder for WIP features
│   ├── data/
│   │   └── majors.ts             # All interfaces + data (customize per school)
│   ├── assets/
│   │   └── szpu-logo.svg         # School logo (customize per school)
│   └── styles/
│       ├── global.scss
│       ├── design-token/          # iflyv CSS variables (DO NOT MODIFY)
│       │   ├── index.scss
│       │   └── css/
│       │       ├── root.scss      # Light theme
│       │       ├── root-dark.scss # Dark theme
│       │       ├── font.scss      # Typography system
│       │       ├── brands.scss    # Brand colors
│       │       └── animation.scss
│       └── el-theme/              # Element Plus customization
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── .gitignore
```

### Generation Workflow

1. **Scaffold project**: Create Vite + Vue 3 + TypeScript project
2. **Copy design tokens**: Read and copy the entire `styles/` directory from reference — these are standardized and school-independent
3. **Copy components**: Read each component from the reference and copy as-is — they are data-driven and adapt to whatever data is provided
4. **Generate data layer**: This is the key customization step — build `src/data/majors.ts` with school-specific data
5. **Customize App.vue**: Update the `orgData` array for the school's college/major tree, update `statsMajorList` for data overview filtering

Read `references/data-interfaces.md` for the complete TypeScript interfaces that must be implemented in majors.ts.

Read `references/component-guide.md` for component architecture details and key implementation patterns (SVG lines, ECharts configs, edit mode, force graph).

## Step 3: Customize Data Layer

The data layer (`src/data/majors.ts`) is where all school-specific content lives. Everything else is generic.

### Key Exports to Populate

| Export | Type | Purpose |
|--------|------|---------|
| `colleges` | `College[]` | Navigation structure (college → majors) |
| `majorInfoMap` | `Record<string, MajorInfo>` | Major metadata |
| `jobMatchMap` | `Record<string, JobMatch[]>` | Jobs per major |
| `courseMap` | `Record<string, Course[]>` | Courses per major (with prerequisites!) |
| `competencyMap` | `Record<string, CompetencyItem[]>` | Radar chart data |
| `competencyCategoryMap` | `Record<string, CompetencyCategory[]>` | Grouped competencies |
| `courseJobLinkMap` | `Record<string, CourseJobLink[]>` | Course→Job coverage |
| `learningTaskMap` | `Record<string, LearningTask[]>` | Tasks per course |
| `jobCatalog` | `JobMatch[]` | Additional jobs to pick from |
| `aiRecommendedJobMap` | `Record<string, AiRecommendedJob[]>` | AI suggestions |
| `navGroups` | `NavGroup[]` | Navigation menu |
| `jobCategories` | `string[]` | Job category filter |
| `aiInsights` | `string[]` | AI insight strings |
| `createdCourseIds` | `Ref<Set<string>>` | Reactive: created courses |
| `pendingCourses` | `Ref<Course[]>` | Reactive: AI-suggested courses |

### Course Prerequisites

When generating courses, establish logical prerequisite chains based on the curriculum:
- Foundation courses (学期1-2) have no prerequisites
- Core courses (学期3-4) depend on relevant foundations
- Advanced/AI courses (学期4-5) depend on core courses
- Capstone (学期5-6) depends on advanced courses

Example chain: `程序设计基础 → 数据结构 → Web前端开发 → 前端框架实战`

### Data Generation from Training Plan

If the user provides a raw training plan document:
1. Extract all course names, credits, hours, semesters
2. Categorize courses into: 专业基础课, 专业核心课, AI实训课, 专业拓展课
3. Infer prerequisite relationships from course sequence and content overlap
4. Extract or infer job matches from the plan's career goals section
5. Build competency items from the plan's ability requirements
6. Generate course-job links by matching course content to job skill requirements
7. Create learning tasks by decomposing each course into 2-3 actionable tasks

## Step 4: Customize App.vue

App.vue contains school-specific navigation data that must be customized:

### orgData (人培方案专业目录树)
Update the college/major tree for the school's organizational structure:
```typescript
const orgData: OrgCollege[] = [
  {
    id: 'org-1', name: '人工智能学院', children: [
      { code: '610205', name: '软件技术' },
      { code: '510205', name: '大数据技术' },
      // ... school-specific majors
    ],
  },
  // ... more colleges
]
```

### statsMajorList (数据概览专业筛选)
Update the major list for data filtering:
```typescript
const statsMajorList = [
  { code: '610205', name: '软件技术' },
  { code: '510205', name: '大数据技术' },
  // ... school-specific majors
]
```

### School branding
Update school name, logo, and role options in SystemMap.vue header.

## Step 5: Install Dependencies & Verify

```bash
npm install
npm install vue@^3.5 element-plus echarts vue-echarts lucide-vue-next sass --save
npm install vite @vitejs/plugin-vue vue-tsc typescript vite-plugin-singlefile --save-dev
```

Configure `vite.config.ts` for single-file output (all JS/CSS inlined into one HTML, openable without a server):

```typescript
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: './',
  plugins: [vue(), viteSingleFile()],
  build: { cssCodeSplit: false },
})
```

Then verify:
```bash
npx vue-tsc --noEmit    # Type check
npx vite build           # Production build → dist/index.html (~2MB, self-contained)
open dist/index.html     # Double-click to open, no server needed
```

## Key Architecture Decisions

### Multi-Page SPA (No Router)

The app uses a `currentPage` ref to switch between 9 pages:

| Page | Type | Layout |
|------|------|--------|
| `home` | SystemMap | Full-screen, no sidebar |
| `major-detail` | MajorDetail | Icon-rail + sub-menu (major list) + content |
| `plan-mgmt` | PlanManagement | Icon-rail + sub-menu (college/major tree with search) + content |
| `plan-parse` | PlanParseConfirm | Icon-rail + full-width (plan workflow step 1) |
| `plan-datasearch` | PlanDataSearch | Icon-rail + full-width (plan workflow step 2) |
| `plan-revision` | PlanRevision | Icon-rail + full-width (plan workflow step 3) |
| `plan-preview` | PlanPreview | Icon-rail + full-width (document preview) |
| `plan-research` | PlanResearch | Icon-rail + full-width content (no sub-menu) |
| `data-stats` | DataOverview | Icon-rail + sub-menu (major filter list) + content |

### Plan Workflow (人培方案工作流)

A 3-step workflow for creating/revising training plans, entered from PlanManagement or MajorDetail (empty major upload):

```
Upload → [1] 解析确认 → [2] 数据检索 → [3] 智能修订 → 方案预览
         PlanParseConfirm  PlanDataSearch  PlanRevision   PlanPreview
```

**Entry points**:
- PlanManagement: "导入" button → emits `enter-plan-flow` with target `plan-parse`
- PlanManagement: "编辑" button → emits `enter-plan-flow` with target `plan-revision`
- PlanManagement: "预览" button → emits `enter-plan-flow` with target `plan-preview`
- MajorDetail: Empty major upload → emits `enter-plan-flow` with target `plan-parse`

**App.vue plan flow state**:
```typescript
const activePlanName = ref('2026级软件技术专业人才培养方案')
const activePlanCode = ref('610205')
const activePlanMajor = ref('软件技术')
const activePlanYear = ref('2026')

function handleEnterPlanFlow(plan: { name, code, major, year, target }) {
  // Set plan metadata, switch to target page
}

function handlePlanNavigate(target: string) {
  // Navigate between workflow steps
}
```

All 4 plan workflow components share:
- Props: `planName`, `planCode`, `planMajor`, `planYear`
- Emits: `back` (returns to plan-mgmt), `navigate(target)` (moves between steps)
- Use `major-content--full` class (no padding, no inner wrapper)
- Plan workflow pages map to the `plan` rail item in activeRailId

**Step indicator**: Shared visual pattern across PlanParseConfirm and PlanDataSearch:
```html
<div class="step-indicator">
  <div class="step done"><span class="step-num">✓</span><span class="step-text">解析确认</span></div>
  <div class="step-line done" />
  <div class="step active"><span class="step-num">2</span><span class="step-text">数据检索</span></div>
  <div class="step-line" />
  <div class="step"><span class="step-num">3</span><span class="step-text">智能修订</span></div>
</div>
```

### Navigation: Icon-Rail + Sub-Menu Pattern

The sidebar uses a two-panel design:
- **Icon-rail** (72px): Fixed vertical strip with icon+label items (首页, 专业管理, 人培方案, 人培调研, 数据概览)
- **Sub-menu** (180px): Context-dependent panel that changes based on `currentPage`:
  - `major-detail`: Shows "我的专业" + "专业群其他专业" major list
  - `data-stats`: Shows "专业筛选" filter list
  - `plan-mgmt`: Shows searchable college/major tree with expand/collapse

Active item styling: Left accent bar (3px brand color) + brand color background.

### Breadcrumb Navigation

Top breadcrumb bar (48px): `系统首页 > 专业建设中心 > [current page title]`
Each breadcrumb segment is clickable for navigation.

### Reactive Data
- `jobs` and `courses` are `ref` arrays (not computed) so edits work
- Watch `majorId` changes to reload data from maps
- Course edits bubble up via `@update-course` emit chain

### Design Token System
- All colors, spacing, fonts use `--iflyv-*` CSS variables
- Brand primary: `--iflyv-brand-primary` (geekblue #3658FF)
- 4 semantic color sets: brand, success, warning, info
- 4 text levels: text-1 (darkest) → text-4 (lightest)
- Dark mode via `[data-theme="dark"]` on root

### ECharts Integration
- CompetencyRadar: Sankey/radar chart with `vue-echarts`
- CourseJobChord: circular graph with course→job links
- MajorAtlasView: force-directed graph with 6-level hierarchy, expandable nodes, bridge detection

### Homepage (SystemMap.vue)

The homepage consists of:
1. **Top header**: School logo + name (left) + role switch buttons + user avatar (right)
2. **AI Hero section**: Greeting + multi-line textarea with toolbar (attachments, knowledge base selector, model selector, voice input, send button)
3. **AI Tool grid**: 4 circular tool buttons (专业助手, 数据分析, 课程规划, 政策解读)
4. **Todo panel**: Collapsible task list with completion status and due dates
5. **Module grid** (3-column): Feature cards for platform modules (专业调研, 岗位群管理, 专业群建设, 专业管理, 课程管理, AI创新工坊)

Card hover effects: `translateY(-4px) scale(1.02)`, top color bar `scaleX(0→1)`, icon `scale(1.1) rotate(-4deg)`.
