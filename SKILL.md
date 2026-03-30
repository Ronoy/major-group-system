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

The canonical reference project lives at `/Users/Ronoy/major-group-system`. When generating a new project, read components from this reference to ensure fidelity. The reference contains 13+ Vue components, a complete design token system, and ECharts visualizations.

## Step 1: Gather Input

Collect the following from the user. If they provide a training plan document (PDF/Word), extract the information from it.

### Required
| Field | Example |
|-------|---------|
| School name (学校名称) | 江西应用技术职业学院 |
| College name (学院名称) | 电子信息工程学院 |
| Primary major (主专业) | 电子信息工程技术 |
| Major code (专业代码) | 510101 |
| Training level (培养层次) | 高职(专科) |
| Duration (学制) | 3年 |
| Major group (专业大类) | 电子与信息大类 |
| Location (所在地) | 江西赣州 |

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
│   ├── App.vue                    # Two-page layout (home + detail)
│   ├── main.ts                    # Entry point
│   ├── components/
│   │   ├── SystemMap.vue          # Homepage: AI input + module grid
│   │   ├── MajorDetail.vue        # Detail page coordinator
│   │   ├── MajorBasicInfo.vue     # Info description + action cards
│   │   ├── SectionTitle.vue       # Reusable section header
│   │   ├── JobList.vue            # Filterable job cards + picker
│   │   ├── JobProfileDialog.vue   # Job detail modal
│   │   ├── JobAtlasDialog.vue     # Job atlas modal
│   │   ├── CompetencyRadar.vue    # ECharts radar chart
│   │   ├── CourseMap.vue          # Semester grid + SVG prerequisite lines
│   │   ├── CourseDetailDialog.vue # Course detail + edit mode
│   │   ├── CourseJobChord.vue     # ECharts chord diagram
│   │   └── MajorAtlasView.vue    # Full-screen force-directed graph
│   ├── data/
│   │   └── majors.ts             # All interfaces + data (customize per school)
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

Example chain: `电路分析 → 模拟电子 → PCB设计 → 电子产品工艺`

### Data Generation from Training Plan

If the user provides a raw training plan document:
1. Extract all course names, credits, hours, semesters
2. Categorize courses into: 专业基础课, 专业核心课, AI实训课, 专业拓展课
3. Infer prerequisite relationships from course sequence and content overlap
4. Extract or infer job matches from the plan's career goals section
5. Build competency items from the plan's ability requirements
6. Generate course-job links by matching course content to job skill requirements
7. Create learning tasks by decomposing each course into 2-3 actionable tasks

## Step 4: Install Dependencies & Verify

```bash
npm install
npm install vue@^3.5 element-plus echarts vue-echarts lucide-vue-next sass --save
npm install vite @vitejs/plugin-vue vue-tsc typescript --save-dev
```

Then verify:
```bash
npx vue-tsc --noEmit    # Type check
npx vite build           # Production build
```

## Key Architecture Decisions

### Two-Page SPA (No Router)
- `currentPage` ref switches between `'home'` and `'major'`
- Home page: full-screen SystemMap
- Major page: topbar (56px) + sidebar (200px) + scrollable content area

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
- CompetencyRadar: radar chart with `vue-echarts`
- CourseJobChord: circular graph with course→job links
- MajorAtlasView: force-directed graph with 6-level hierarchy, expandable nodes, bridge detection
