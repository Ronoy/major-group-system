# Data Interfaces Reference

All TypeScript interfaces for `src/data/majors.ts`. Every export must conform to these types.

## Core Interfaces

```typescript
export interface MajorInfo {
  id: string
  code: string          // e.g. '610205'
  name: string          // e.g. '软件技术'
  level: string         // e.g. '高职(专科)'
  duration: string      // e.g. '3年'
  college: string       // e.g. '人工智能学院'
  group: string         // e.g. '电子与信息大类'
  location: string      // e.g. '深圳'
  description: string   // 2-3 sentence overview
  enrollment: number    // students per year
  established: string   // e.g. '2005'
  tags: string[]        // e.g. ['省级特色专业', '产教融合']
  trainingPlanUrl?: string
}

export interface JobProfile {
  education: string     // e.g. '大专及以上'
  experience: string    // e.g. '1-3年'
  level: string         // e.g. '初级/中级'
  demandCount: number   // job openings
  careerPath: string    // career progression description
  tasks: string[]       // 4-6 key job tasks
  tools: string[]       // software/hardware tools used
  skills: string[]      // technical skills required
  qualities: string[]   // soft skills / professional qualities
}

export interface JobMatch {
  id: string            // e.g. 'j1'
  name: string          // e.g. 'Web前端开发工程师'
  category: string      // e.g. '前端开发'
  matchRate: number     // 0-100 percentage
  salaryRange: string   // e.g. '8-15K'
  demand: '高' | '中' | '低'
  skills: string[]      // 3-5 key skills shown on card
  profile: JobProfile
}

export interface Course {
  id: string            // e.g. 'cr1'
  name: string
  category: '专业基础课' | '专业核心课' | 'AI实训课' | '专业拓展课'
  credits: number
  hours: number
  semester: string      // '第1学期' through '第6学期'
  description: string
  /** Prerequisite course IDs — drives the SVG connection lines */
  prerequisites?: string[]
  /** 课标字段 */
  objectives?: string[]
  contents?: string[]
  teachingMethods?: string[]
  assessment?: string
}

export interface CourseJobLink {
  jobId: string
  jobName: string
  /** Course coverage of job skills: 0-100 */
  coverage: number
  /** Specific skills this course covers for the job */
  coveredSkills: string[]
}

export interface LearningTask {
  id: string
  name: string
  /** Ability tags linked to this task */
  knowledge: string[]
  qualities: string[]
  generalSkills: string[]
  professionalSkills: string[]
}

export interface CompetencyItem {
  name: string
  value: number  // 0-100
}

export interface CompetencyCategory {
  name: string
  children: CompetencyItem[]
}

export interface AiRecommendedJob {
  id: string
  name: string
  category: string
  matchRate: number
  salaryRange: string
  reason: string        // Why AI recommends this job
  relatedCourses: string[]
  suggestedCourses?: { name: string; reason: string }[]
}

export interface NavGroup {
  id: string
  label: string
  icon: any             // lucide icon component
  children: { id: string; label: string }[]
}
```

## Navigation Structure

```typescript
// College → Majors hierarchy for sidebar
export interface College {
  id: string    // e.g. 'c1'
  name: string  // e.g. '人工智能学院'
  majors: { id: string; name: string }[]
}

export const colleges: College[] = [
  {
    id: 'c1',
    name: '人工智能学院',
    majors: [
      { id: 'm1', name: '软件技术' },
      { id: 'm2', name: '大数据技术' },
      { id: 'm3', name: '云计算技术应用' },
      { id: 'm4', name: '人工智能技术应用' },
    ],
  },
  // ... more colleges
]
```

## Reactive State Exports

```typescript
import { ref } from 'vue'

/** Courses that have been "created" in the system (simulated) */
export const createdCourseIds = ref<Set<string>>(new Set(['cr1', 'cr2', ...]))

/** AI-suggested pending courses (not yet confirmed) */
export const pendingCourses = ref<Course[]>([
  {
    id: 'pending-1',
    name: 'LangChain应用开发',
    category: 'AI实训课',
    credits: 3,
    hours: 48,
    semester: '第5学期',
    description: 'AI建议：基于岗位需求缺口...',
  },
])
```

## Data Map Pattern

All major-specific data uses `Record<string, T>` keyed by major ID:

```typescript
export const majorInfoMap: Record<string, MajorInfo> = {
  m1: { /* ... */ },
}

export const jobMatchMap: Record<string, JobMatch[]> = {
  m1: [ /* 6-10 jobs */ ],
}

export const courseMap: Record<string, Course[]> = {
  m1: [ /* 15-25 courses across 6 semesters */ ],
}

export const competencyMap: Record<string, CompetencyItem[]> = {
  m1: [ /* 6-10 competency items for radar chart */ ],
}

export const courseJobLinkMap: Record<string, CourseJobLink[]> = {
  // Keyed by COURSE ID (not major ID)
  cr1: [ /* which jobs this course covers */ ],
  cr6: [ /* ... */ ],
}

export const learningTaskMap: Record<string, LearningTask[]> = {
  // Keyed by COURSE ID
  cr1: [ /* 2-3 learning tasks */ ],
}
```

## Prerequisite Data Guidelines

When populating course prerequisites, follow these patterns:

- **Semester 1 courses**: No prerequisites (entry-level foundations)
- **Semester 2 courses**: May depend on semester 1 courses in same domain
- **Semester 3-4 courses**: Depend on 1-2 foundational courses
- **Semester 5 courses**: Depend on core courses from semester 3-4
- **Semester 6 (capstone/internship)**: Depend on advanced semester 5 courses

Example prerequisite chain for software major:
```
cr1 (程序设计基础, S1) ──→ cr5 (数据结构, S2) ──→ cr9 (Java企业开发, S3) ──→ cr14 (微服务架构, S5)
                       ──→ cr6 (Web前端开发, S2) ──→ cr10 (前端框架实战, S3) ──→ cr15 (全栈项目实战, S5)
cr2 (计算机网络, S1) ──→ cr7 (Linux系统, S2) ──→ cr11 (云计算, S4) ──→ cr16 (DevOps, S5)
cr3 (数据库基础, S1) ──→ cr8 (Python, S2) ──→ cr12 (数据分析, S4) ──→ cr13 (机器学习, S5)
```
