# Data Interfaces Reference

All TypeScript interfaces for `src/data/majors.ts`. Every export must conform to these types.

## Core Interfaces

```typescript
export interface MajorInfo {
  id: string
  code: string          // e.g. '510101'
  name: string          // e.g. '电子信息工程技术'
  level: string         // e.g. '高职(专科)'
  duration: string      // e.g. '3年'
  college: string       // e.g. '电子信息工程学院'
  group: string         // e.g. '电子与信息大类'
  location: string      // e.g. '江西赣州'
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
  name: string          // e.g. '嵌入式软件工程师'
  category: string      // e.g. '嵌入式开发'
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
  name: string  // e.g. '电子信息工程学院'
  majors: { id: string; name: string }[]
}

export const colleges: College[] = [
  {
    id: 'c1',
    name: '电子信息工程学院',
    majors: [
      { id: 'm1', name: '电子信息工程技术' },
      { id: 'm2', name: '物联网应用技术' },
      { id: 'm3', name: '通信技术' },
      { id: 'm4', name: '智能产品开发与应用' },
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
    name: 'AI视觉检测技术',
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

Example prerequisite chain for electronics major:
```
cr1 (电路分析, S1) ──→ cr2 (模拟电子, S2) ──→ cr7 (PCB设计, S3) ──→ cr10 (生产工艺, S4)
                  ──→ cr3 (数字电子, S2) ──→ cr6 (单片机, S3) ──→ cr9 (嵌入式, S4) ──→ cr14 (AI边缘, S5)
cr4 (C语言, S1) ──→ cr6 (单片机, S3)
              ──→ cr12 (Python, S4) ──→ cr13 (机器学习, S5) ──→ cr14 (AI边缘, S5)
```
