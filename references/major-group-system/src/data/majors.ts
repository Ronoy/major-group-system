import { ref } from 'vue'
import {
  Cpu,
  Globe,
  Smartphone,
  Server,
  BarChart3,
  Users,
  Briefcase,
  BookOpen,
  GraduationCap,
  Layers,
  Settings,
  Shield,
} from 'lucide-vue-next'

// ============================================================
// Interfaces
// ============================================================

export interface MajorInfo {
  id: string
  code: string
  name: string
  level: string
  duration: string
  college: string
  group: string
  location: string
  description: string
  enrollment: number
  established: string
  tags: string[]
  trainingPlanUrl?: string
}

export interface JobProfile {
  education: string
  experience: string
  level: string
  demandCount: number
  careerPath: string
  tasks: string[]
  tools: string[]
  skills: string[]
  qualities: string[]
}

export interface JobMatch {
  id: string
  name: string
  category: string
  matchRate: number
  salaryRange: string
  demand: '高' | '中' | '低'
  skills: string[]
  profile: JobProfile
}

export interface Course {
  id: string
  name: string
  category: '专业基础课' | '专业核心课' | 'AI实训课' | '专业拓展课'
  credits: number
  hours: number
  semester: string
  description: string
  /** 前序课程 ID 列表 */
  prerequisites?: string[]
  /** 课标字段 */
  objectives?: string[]
  contents?: string[]
  teachingMethods?: string[]
  assessment?: string
}

/** 课程-岗位关联 */
export interface CourseJobLink {
  jobId: string
  jobName: string
  /** 课程对该岗位的能力覆盖度 0-100 */
  coverage: number
  /** 覆盖的具体能力项 */
  coveredSkills: string[]
}

/** 学习任务 */
export interface LearningTask {
  id: string
  name: string
  /** 关联的能力项 */
  knowledge: string[]
  qualities: string[]
  generalSkills: string[]
  professionalSkills: string[]
}

export interface CompetencyItem {
  name: string
  value: number
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
  reason: string
  relatedCourses: string[]
  suggestedCourses?: { name: string; reason: string }[]
}

export interface NavGroup {
  id: string
  label: string
  icon: any
  children: { id: string; label: string }[]
}

// ============================================================
// Navigation
// ============================================================

export const colleges = [
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
]

export const navGroups: NavGroup[] = [
  {
    id: 'dev',
    label: '开发方向',
    icon: Cpu,
    children: [
      { id: 'frontend', label: 'Web前端' },
      { id: 'backend', label: '后端开发' },
      { id: 'mobile', label: '移动应用' },
    ],
  },
  {
    id: 'ops',
    label: '运维方向',
    icon: Server,
    children: [
      { id: 'devops', label: 'DevOps' },
      { id: 'cloud', label: '云运维' },
      { id: 'security', label: '安全运维' },
    ],
  },
  {
    id: 'data',
    label: '数据方向',
    icon: BarChart3,
    children: [
      { id: 'datadev', label: '数据开发' },
      { id: 'dataanalysis', label: '数据分析' },
    ],
  },
  {
    id: 'management',
    label: '项目管理',
    icon: Users,
    children: [
      { id: 'pm', label: '项目管理' },
      { id: 'test', label: '软件测试' },
      { id: 'product', label: '产品助理' },
    ],
  },
]

export const jobCategories = [
  'Web前端开发',
  'Java后端开发',
  '移动应用开发',
  'DevOps运维',
  '软件测试',
  '数据开发',
  '项目管理',
]

// ============================================================
// Major Info
// ============================================================

export const majorInfoMap: Record<string, MajorInfo> = {
  m1: {
    id: 'm1',
    code: '610205',
    name: '软件技术',
    level: '高职(专科)',
    duration: '3年',
    college: '人工智能学院',
    group: '电子与信息大类',
    location: '广东深圳',
    description:
      '本专业面向软件和信息技术服务业，培养掌握软件开发、Web前后端、移动应用开发、DevOps运维等核心技能，具有良好的职业素养和创新意识，能够从事软件编码、测试、部署与运维等工作的高素质技术技能人才。依托深圳产业优势和校企合作资源，紧密对接华为、腾讯、字节跳动等头部企业用人需求。',
    enrollment: 200,
    established: '2001',
    tags: ['国家级骨干专业', '产教融合', '1+X证书试点'],
  },
}

// ============================================================
// Job Matches
// ============================================================

export const jobMatchMap: Record<string, JobMatch[]> = {
  m1: [
    {
      id: 'j1',
      name: 'Web前端开发工程师',
      category: 'Web前端开发',
      matchRate: 92,
      salaryRange: '10-20K',
      demand: '高',
      skills: ['Vue/React', 'TypeScript', 'CSS', 'Webpack/Vite'],
      profile: {
        education: '大专及以上',
        experience: '0-2年',
        level: '初级/中级',
        demandCount: 3200,
        careerPath: '初级前端→中级前端→高级前端→前端架构师/技术经理',
        tasks: ['根据设计稿完成页面开发', '实现前端交互逻辑与数据绑定', '前端性能优化与兼容适配', '参与前后端联调与接口对接', '编写组件库与技术文档'],
        tools: ['VS Code', 'Chrome DevTools', 'Git', 'Figma', 'Postman'],
        skills: ['HTML5/CSS3', 'JavaScript/TypeScript', 'Vue.js/React', '响应式布局', '前端工程化', 'HTTP协议'],
        qualities: ['细致耐心', '审美意识', '沟通协作', '持续学习'],
      },
    },
    {
      id: 'j2',
      name: 'Java后端开发工程师',
      category: 'Java后端开发',
      matchRate: 88,
      salaryRange: '12-22K',
      demand: '高',
      skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
      profile: {
        education: '大专及以上',
        experience: '0-3年',
        level: '初级/中级',
        demandCount: 4100,
        careerPath: '初级后端→中级后端→高级后端→架构师/技术总监',
        tasks: ['设计与开发后端API接口', '数据库设计与SQL优化', '微服务架构开发与维护', '排查线上问题与性能调优', '参与技术方案评审'],
        tools: ['IntelliJ IDEA', 'Maven/Gradle', 'Git', 'Docker', 'Navicat'],
        skills: ['Java SE/EE', 'Spring Boot/Cloud', 'MySQL', 'Redis', 'Linux', 'RESTful API'],
        qualities: ['逻辑思维', '系统性思维', '责任心', '抗压能力'],
      },
    },
    {
      id: 'j3',
      name: '移动应用开发工程师',
      category: '移动应用开发',
      matchRate: 78,
      salaryRange: '10-18K',
      demand: '中',
      skills: ['Flutter/RN', 'Dart/JS', 'iOS/Android', 'UI适配'],
      profile: {
        education: '大专及以上',
        experience: '0-2年',
        level: '初级/中级',
        demandCount: 1800,
        careerPath: '初级移动端→中级→高级→移动端架构师',
        tasks: ['移动端UI开发与交互实现', '调用原生API完成功能开发', '应用性能优化与包体积控制', '应用上架与版本管理', '跨平台适配与兼容测试'],
        tools: ['Android Studio', 'Xcode', 'Flutter SDK', 'Charles', 'Git'],
        skills: ['Flutter/React Native', 'Dart/JavaScript', '原生API调用', '状态管理', 'APP性能优化'],
        qualities: ['用户体验意识', '耐心细致', '快速学习', '跨平台思维'],
      },
    },
    {
      id: 'j4',
      name: 'DevOps工程师',
      category: 'DevOps运维',
      matchRate: 75,
      salaryRange: '12-25K',
      demand: '高',
      skills: ['Docker', 'K8s', 'CI/CD', 'Linux'],
      profile: {
        education: '大专及以上',
        experience: '1-3年',
        level: '中级',
        demandCount: 2200,
        careerPath: '运维工程师→DevOps工程师→SRE→运维架构师',
        tasks: ['搭建与维护CI/CD流水线', '容器化部署与K8s集群管理', '监控告警体系建设', '自动化运维脚本开发', '故障排查与应急响应'],
        tools: ['Jenkins/GitLab CI', 'Docker', 'Kubernetes', 'Prometheus', 'Ansible'],
        skills: ['Linux系统管理', 'Docker容器化', 'Kubernetes编排', 'Shell/Python脚本', '网络与安全基础'],
        qualities: ['严谨细致', '应急能力', '自动化思维', '全局视野'],
      },
    },
    {
      id: 'j5',
      name: '软件测试工程师',
      category: '软件测试',
      matchRate: 82,
      salaryRange: '8-16K',
      demand: '中',
      skills: ['测试用例', 'Selenium', 'JMeter', '缺陷管理'],
      profile: {
        education: '大专及以上',
        experience: '0-2年',
        level: '初级/中级',
        demandCount: 2600,
        careerPath: '初级测试→中级测试→测试主管→测试架构师/QA经理',
        tasks: ['编写测试计划与测试用例', '执行功能测试与回归测试', '自动化测试脚本编写', '性能测试与安全测试', '缺陷跟踪与测试报告'],
        tools: ['Selenium', 'JMeter', 'Postman', 'JIRA', 'Git'],
        skills: ['测试理论与方法', '自动化测试框架', '性能测试工具', 'SQL查询', '接口测试'],
        qualities: ['耐心细致', '批判思维', '沟通能力', '质量意识'],
      },
    },
    {
      id: 'j6',
      name: '数据开发工程师',
      category: '数据开发',
      matchRate: 70,
      salaryRange: '12-20K',
      demand: '中',
      skills: ['Python', 'SQL', 'Spark', 'ETL'],
      profile: {
        education: '大专及以上',
        experience: '1-3年',
        level: '初级/中级',
        demandCount: 1500,
        careerPath: '数据开发→高级数据开发→数据架构师',
        tasks: ['数据仓库建模与ETL开发', '数据清洗与质量治理', '数据接口开发与优化', '数据报表与可视化开发', '大数据平台运维'],
        tools: ['Hive', 'Spark', 'Airflow', 'DataX', 'Superset'],
        skills: ['Python/SQL', 'Hadoop/Spark生态', 'ETL流程设计', '数据建模', '数据质量管理'],
        qualities: ['逻辑严密', '数据敏感', '耐心', '系统思维'],
      },
    },
  ],
}

// ============================================================
// Courses (软件技术专业 — 6学期)
// ============================================================

export const courseMap: Record<string, Course[]> = {
  m1: [
    // ---- 第1学期 ----
    {
      id: 'cr1',
      name: '计算机基础与办公自动化',
      category: '专业基础课',
      credits: 3,
      hours: 48,
      semester: '第1学期',
      description: '计算机组成、操作系统基础、办公软件高级应用',
      objectives: ['了解计算机硬件与软件体系', '熟练使用Office办公套件', '掌握信息检索与数字化办公能力'],
      contents: ['计算机组成原理概述', 'Windows/Linux基础操作', 'Word/Excel/PPT高级应用', '信息检索与网络安全基础'],
      teachingMethods: ['理论讲授', '上机实践', '案例教学'],
      assessment: '上机考试40% + 课堂作业30% + 期末考试30%',
    },
    {
      id: 'cr2',
      name: 'HTML5与CSS3网页设计',
      category: '专业基础课',
      credits: 4,
      hours: 64,
      semester: '第1学期',
      description: '网页结构、样式与响应式布局基础',
      objectives: ['掌握HTML5语义化标签', '熟练使用CSS3布局与动画', '能独立完成响应式网页设计', '了解Web标准与浏览器兼容'],
      contents: ['HTML5语义化', 'CSS3选择器与盒模型', 'Flexbox与Grid布局', '响应式设计与媒体查询', 'CSS动画与过渡', '项目实战'],
      teachingMethods: ['理论讲授', '上机实践', '项目驱动'],
      assessment: '项目作品40% + 上机考试30% + 平时成绩30%',
    },
    {
      id: 'cr3',
      name: 'Java程序设计基础',
      category: '专业基础课',
      credits: 4,
      hours: 64,
      semester: '第1学期',
      description: 'Java语法基础、面向对象编程思想',
      objectives: ['掌握Java基础语法与数据类型', '理解面向对象编程三大特性', '能编写结构化Java程序', '具备调试与排错基本能力'],
      contents: ['Java开发环境搭建', '数据类型与流程控制', '数组与字符串', '面向对象(封装/继承/多态)', '异常处理', '集合框架入门'],
      teachingMethods: ['理论讲授', '编程练习', '翻转课堂'],
      assessment: '编程作业35% + 上机考试25% + 期末考试40%',
    },
    {
      id: 'cr4',
      name: '数据库原理与应用',
      category: '专业基础课',
      credits: 4,
      hours: 64,
      semester: '第1学期',
      description: '关系型数据库原理、SQL语言与MySQL应用',
      objectives: ['理解关系型数据库基本概念', '熟练编写SQL增删改查', '掌握数据库设计范式', '能进行MySQL数据库管理'],
      contents: ['数据库基本概念', 'SQL语言(DDL/DML/DQL)', '数据库设计与ER图', '索引与查询优化', '事务与并发控制', 'MySQL管理工具'],
      teachingMethods: ['理论讲授', '上机实践', '案例分析'],
      assessment: '上机考试35% + 数据库设计作业25% + 期末考试40%',
    },
    // ---- 第2学期 ----
    {
      id: 'cr5',
      name: 'JavaScript程序设计',
      category: '专业基础课',
      credits: 4,
      hours: 64,
      semester: '第2学期',
      description: 'JavaScript核心语法、DOM操作与ES6+新特性',
      prerequisites: ['cr2'],
      objectives: ['掌握JavaScript核心语法', '熟练操作DOM与事件处理', '理解ES6+新特性', '能实现常见网页交互效果'],
      contents: ['JS基础语法与数据类型', 'DOM/BOM操作', '事件机制与异步编程', 'ES6+(箭头函数/解构/Promise/async)', '模块化开发', '综合项目实战'],
      teachingMethods: ['理论讲授', '编程实践', '项目驱动'],
      assessment: '项目作品40% + 编程作业30% + 期末考试30%',
    },
    {
      id: 'cr6',
      name: 'Java高级编程',
      category: '专业基础课',
      credits: 3,
      hours: 48,
      semester: '第2学期',
      description: 'Java高级特性、IO流、多线程与网络编程',
      prerequisites: ['cr3'],
      objectives: ['掌握Java IO流与文件操作', '理解多线程编程模型', '了解网络编程基础', '能使用JDBC操作数据库'],
      contents: ['IO流与NIO', '多线程与线程池', '网络编程(Socket)', 'JDBC与连接池', '反射与注解', 'Lambda与Stream'],
      teachingMethods: ['理论讲授', '编程练习', '项目实战'],
      assessment: '编程作业35% + 项目成果25% + 期末考试40%',
    },
    {
      id: 'cr7',
      name: 'Linux操作系统',
      category: '专业基础课',
      credits: 3,
      hours: 48,
      semester: '第2学期',
      description: 'Linux系统管理、Shell脚本与服务部署',
      prerequisites: ['cr1'],
      objectives: ['掌握Linux常用命令与文件管理', '能编写Shell脚本', '了解系统服务管理与网络配置', '具备基本的服务器运维能力'],
      contents: ['Linux安装与基本命令', '用户与权限管理', 'Shell脚本编程', '软件包管理', '网络配置与防火墙', '服务管理(Nginx/MySQL)'],
      teachingMethods: ['理实一体化', '上机实操', '案例教学'],
      assessment: '上机考试40% + Shell脚本作业30% + 期末考试30%',
    },
    {
      id: 'cr8',
      name: '数据结构与算法',
      category: '专业基础课',
      credits: 3,
      hours: 48,
      semester: '第2学期',
      description: '常用数据结构与基本算法思想',
      prerequisites: ['cr3'],
      objectives: ['掌握线性表、栈、队列等基本数据结构', '理解树与图的存储与遍历', '掌握排序与查找算法', '能分析算法时间复杂度'],
      contents: ['线性表与链表', '栈与队列', '树与二叉树', '图的基本算法', '排序算法', '查找算法与哈希'],
      teachingMethods: ['理论讲授', '编程实践', '算法竞赛'],
      assessment: '编程作业40% + 算法实践20% + 期末考试40%',
    },
    // ---- 第3学期 ----
    {
      id: 'cr9',
      name: 'Vue.js前端框架开发',
      category: '专业核心课',
      credits: 4,
      hours: 64,
      semester: '第3学期',
      description: 'Vue 3 + TypeScript企业级前端开发',
      prerequisites: ['cr5'],
      objectives: ['掌握Vue 3组合式API', '熟练使用TypeScript开发', '能使用Element Plus等UI库', '能独立开发企业级前端项目'],
      contents: ['Vue 3核心(响应式/组件/生命周期)', 'Composition API', 'TypeScript集成', 'Vue Router与Pinia', 'Element Plus组件库', '前端工程化(Vite)'],
      teachingMethods: ['项目驱动', '翻转课堂', '企业案例'],
      assessment: '项目成果50%(含答辩) + 过程考核20% + 期末考核30%',
    },
    {
      id: 'cr10',
      name: 'Spring Boot后端开发',
      category: '专业核心课',
      credits: 4,
      hours: 64,
      semester: '第3学期',
      description: 'Spring Boot框架与RESTful API开发',
      prerequisites: ['cr6', 'cr4'],
      objectives: ['掌握Spring Boot核心特性', '能设计RESTful API接口', '熟练使用MyBatis/JPA操作数据库', '了解Spring Security基础'],
      contents: ['Spring Boot快速入门', 'IoC/AOP原理', 'MyBatis-Plus持久层', 'RESTful API设计', '统一异常处理与日志', 'JWT认证与权限控制'],
      teachingMethods: ['理实一体化', '项目驱动', '企业导师'],
      assessment: '项目成果45%(含答辩) + 实验报告15% + 期末考核40%',
    },
    {
      id: 'cr11',
      name: '软件工程与项目管理',
      category: '专业核心课',
      credits: 3,
      hours: 48,
      semester: '第3学期',
      description: '软件开发流程、敏捷方法与项目管理工具',
      prerequisites: ['cr3'],
      objectives: ['理解软件生命周期模型', '掌握敏捷开发方法(Scrum)', '能使用项目管理工具', '具备需求分析与文档编写能力'],
      contents: ['软件开发模型(瀑布/敏捷)', 'Scrum框架与实践', '需求分析与UML建模', 'Git工作流与代码评审', 'JIRA/禅道项目管理', '软件质量与配置管理'],
      teachingMethods: ['理论讲授', '案例分析', '模拟项目'],
      assessment: '模拟项目40% + 文档作业30% + 期末考试30%',
    },
    {
      id: 'cr12',
      name: '移动应用开发基础',
      category: '专业核心课',
      credits: 3,
      hours: 48,
      semester: '第3学期',
      description: 'Flutter/React Native跨平台移动应用开发',
      prerequisites: ['cr5'],
      objectives: ['了解移动开发生态', '掌握Flutter/RN开发基础', '能完成跨平台APP开发', '了解应用上架流程'],
      contents: ['移动开发概述', 'Flutter/Dart基础', 'UI组件与布局', '状态管理', '网络请求与数据持久化', 'APP打包与发布'],
      teachingMethods: ['项目驱动', '上机实践', '案例教学'],
      assessment: '项目作品45% + 上机考试25% + 期末考试30%',
    },
    // ---- 第4学期 ----
    {
      id: 'cr13',
      name: '前后端分离项目实战',
      category: '专业核心课',
      credits: 4,
      hours: 64,
      semester: '第4学期',
      description: 'Vue + Spring Boot全栈项目开发实战',
      prerequisites: ['cr9', 'cr10'],
      objectives: ['能独立完成前后端分离项目', '掌握接口联调与跨域处理', '具备项目部署上线能力', '了解前后端协作规范'],
      contents: ['项目需求分析', '数据库设计与API文档', 'Vue前端开发', 'Spring Boot后端开发', '前后端联调', 'Nginx部署与上线'],
      teachingMethods: ['项目制学习', '团队协作', '企业导师'],
      assessment: '项目成果60%(含答辩) + 过程文档20% + 个人贡献20%',
    },
    {
      id: 'cr14',
      name: 'Docker与容器化部署',
      category: '专业核心课',
      credits: 3,
      hours: 48,
      semester: '第4学期',
      description: 'Docker容器技术与微服务部署',
      prerequisites: ['cr7', 'cr10'],
      objectives: ['掌握Docker核心概念与操作', '能编写Dockerfile构建镜像', '了解Docker Compose编排', '能使用容器部署Web应用'],
      contents: ['Docker核心概念', '镜像构建与管理', 'Docker Compose编排', '容器网络与存储', '微服务容器化部署', 'CI/CD流水线集成'],
      teachingMethods: ['理实一体化', '项目驱动', '企业案例'],
      assessment: '实操考核45% + 部署方案设计25% + 期末考试30%',
    },
    {
      id: 'cr15',
      name: 'Python与数据分析',
      category: 'AI实训课',
      credits: 3,
      hours: 48,
      semester: '第4学期',
      description: 'Python编程基础与数据处理分析',
      prerequisites: ['cr4'],
      objectives: ['掌握Python编程基础', '能使用NumPy/Pandas处理数据', '能进行数据可视化分析', '具备数据驱动决策思维'],
      contents: ['Python基础语法', 'NumPy数值计算', 'Pandas数据处理', 'Matplotlib/Seaborn可视化', '数据清洗与特征工程', '数据分析项目实战'],
      teachingMethods: ['翻转课堂', '项目驱动', '在线实训'],
      assessment: '数据分析项目45% + 编程作业25% + 期末考试30%',
    },
    {
      id: 'cr16',
      name: '自动化测试技术',
      category: '专业核心课',
      credits: 3,
      hours: 48,
      semester: '第4学期',
      description: '软件测试理论与自动化测试实践',
      prerequisites: ['cr9', 'cr10'],
      objectives: ['掌握测试基本理论与方法', '能编写自动化测试脚本', '了解性能测试与接口测试', '能使用缺陷管理工具'],
      contents: ['测试基础理论', '测试用例设计', 'Selenium Web自动化', 'Postman接口测试', 'JMeter性能测试', '持续集成中的测试'],
      teachingMethods: ['理实一体化', '案例教学', '企业项目'],
      assessment: '自动化脚本40% + 测试报告30% + 期末考试30%',
    },
    // ---- 第5学期 ----
    {
      id: 'cr17',
      name: 'Spring Cloud微服务架构',
      category: '专业核心课',
      credits: 4,
      hours: 64,
      semester: '第5学期',
      description: '微服务架构设计与Spring Cloud实践',
      prerequisites: ['cr10', 'cr14'],
      objectives: ['理解微服务架构思想', '掌握Spring Cloud核心组件', '能搭建微服务项目', '了解服务治理与分布式事务'],
      contents: ['微服务架构概论', 'Nacos注册中心与配置', 'Gateway网关', 'OpenFeign服务调用', '分布式事务(Seata)', '链路追踪与限流'],
      teachingMethods: ['项目驱动', '企业案例', '架构设计研讨'],
      assessment: '项目成果50%(含答辩) + 过程考核20% + 期末考核30%',
    },
    {
      id: 'cr18',
      name: 'AI辅助编程实训',
      category: 'AI实训课',
      credits: 3,
      hours: 48,
      semester: '第5学期',
      description: 'AI编程助手与大模型API应用开发',
      prerequisites: ['cr13'],
      objectives: ['掌握AI编程辅助工具(Copilot等)', '能使用大模型API构建应用', '了解Prompt Engineering', '具备AI时代的编程思维'],
      contents: ['AI编程助手使用', 'Prompt Engineering', 'LLM API调用与集成', 'RAG应用开发', 'AI Agent基础', 'AI+软件开发项目'],
      teachingMethods: ['项目驱动', '实训操作', '前沿技术讲座'],
      assessment: '项目成果55%(含演示) + 过程考核15% + 期末考核30%',
    },
    {
      id: 'cr19',
      name: 'Kubernetes与云原生',
      category: '专业拓展课',
      credits: 3,
      hours: 48,
      semester: '第5学期',
      description: 'Kubernetes集群管理与云原生应用',
      prerequisites: ['cr14'],
      objectives: ['掌握K8s核心概念', '能部署与管理K8s集群', '了解Helm与服务网格', '具备云原生架构思维'],
      contents: ['K8s架构与核心对象', 'Pod/Deployment/Service', 'ConfigMap/Secret管理', 'Helm包管理', '持久化存储', '云原生监控(Prometheus+Grafana)'],
      teachingMethods: ['理实一体化', '项目驱动', '企业参观'],
      assessment: '实操考核50% + 部署方案20% + 期末考试30%',
    },
    {
      id: 'cr20',
      name: '软件综合项目实战',
      category: 'AI实训课',
      credits: 4,
      hours: 64,
      semester: '第5学期',
      description: '企业级全栈项目从需求到交付的完整流程',
      prerequisites: ['cr17', 'cr18'],
      objectives: ['能完成企业级项目全流程', '具备团队协作与项目管理能力', '能集成AI能力到项目中', '具备产品思维与交付能力'],
      contents: ['需求调研与原型设计', '技术选型与架构设计', '敏捷迭代开发', 'AI功能集成', '测试与部署上线', '项目路演与答辩'],
      teachingMethods: ['项目制学习', '企业导师', '敏捷团队', '路演答辩'],
      assessment: '项目成果60%(含路演) + 过程文档20% + 个人贡献20%',
    },
    // ---- 第6学期 ----
    {
      id: 'cr21',
      name: '顶岗实习',
      category: '专业核心课',
      credits: 16,
      hours: 480,
      semester: '第6学期',
      description: '在软件企业进行岗位实习实践',
      prerequisites: ['cr20'],
      objectives: ['能胜任企业软件开发岗位', '具备职业素养与团队协作能力', '积累行业实践经验', '完成实习报告与总结'],
      contents: ['岗位技能实践', '企业文化适应', '项目参与', '实习报告撰写'],
      teachingMethods: ['岗位实践', '企业导师', '校企双导师'],
      assessment: '企业评价50% + 实习报告30% + 答辩20%',
    },
    {
      id: 'cr22',
      name: '毕业设计',
      category: '专业核心课',
      credits: 6,
      hours: 120,
      semester: '第6学期',
      description: '完成软件技术相关课题的毕业设计与答辩',
      prerequisites: ['cr20'],
      objectives: ['能独立完成课题设计与开发', '具备系统架构与编码能力', '能撰写规范毕业论文', '通过毕业答辩'],
      contents: ['选题与开题', '系统设计与开发', '论文撰写', '毕业答辩'],
      teachingMethods: ['导师指导', '自主研究'],
      assessment: '论文质量40% + 系统成果30% + 答辩表现30%',
    },
    // ---- 拓展课 ----
    {
      id: 'cr23',
      name: '网络安全基础',
      category: '专业拓展课',
      credits: 2,
      hours: 32,
      semester: '第4学期',
      description: 'Web安全、渗透测试与安全防护基础',
      prerequisites: ['cr7'],
      objectives: ['了解常见安全漏洞(OWASP Top 10)', '掌握基本安全防护方法', '了解渗透测试流程', '具备安全编码意识'],
      contents: ['Web安全概论', 'SQL注入与XSS防护', 'CSRF与认证安全', '渗透测试基础', '安全编码规范', '安全工具使用'],
      teachingMethods: ['理论讲授', '攻防演练', '案例分析'],
      assessment: '安全实验报告40% + 课堂表现20% + 期末考试40%',
    },
    {
      id: 'cr24',
      name: '创新创业实践',
      category: '专业拓展课',
      credits: 2,
      hours: 32,
      semester: '第5学期',
      description: '软件领域创新项目孵化与创业实践',
      prerequisites: ['cr13'],
      objectives: ['了解创新创业基本流程', '能完成商业计划书', '具备产品思维与路演能力', '培养创业精神'],
      contents: ['创新方法论', '商业模式设计', '产品原型开发', '路演与融资', '创业案例分析'],
      teachingMethods: ['工作坊', '项目孵化', '导师辅导', '路演答辩'],
      assessment: '商业计划书40% + 路演答辩40% + 过程参与20%',
    },
  ],
}

// ============================================================
// Competencies
// ============================================================

export const competencyMap: Record<string, CompetencyItem[]> = {
  m1: [
    { name: 'Web前端开发', value: 90 },
    { name: 'Java后端开发', value: 85 },
    { name: '数据库设计', value: 80 },
    { name: '移动应用开发', value: 72 },
    { name: 'DevOps运维', value: 68 },
    { name: '软件测试', value: 75 },
    { name: 'AI应用集成', value: 65 },
    { name: '项目管理', value: 70 },
  ],
}

export const competencyCategoryMap: Record<string, CompetencyCategory[]> = {
  m1: [
    {
      name: '前端技术',
      children: [
        { name: 'HTML5/CSS3', value: 92 },
        { name: 'JavaScript/TypeScript', value: 88 },
        { name: 'Vue.js框架', value: 90 },
        { name: '响应式设计', value: 85 },
      ],
    },
    {
      name: '后端技术',
      children: [
        { name: 'Java编程', value: 85 },
        { name: 'Spring Boot', value: 82 },
        { name: 'MySQL数据库', value: 80 },
        { name: '微服务架构', value: 68 },
      ],
    },
    {
      name: '运维与部署',
      children: [
        { name: 'Linux管理', value: 72 },
        { name: 'Docker容器化', value: 70 },
        { name: 'CI/CD流水线', value: 65 },
        { name: 'K8s编排', value: 55 },
      ],
    },
    {
      name: '综合能力',
      children: [
        { name: '软件测试', value: 75 },
        { name: '项目管理', value: 70 },
        { name: 'AI辅助开发', value: 65 },
        { name: '团队协作', value: 82 },
      ],
    },
  ],
}

// ============================================================
// Course-Job Links (keyed by course ID)
// ============================================================

export const courseJobLinkMap: Record<string, CourseJobLink[]> = {
  cr2: [
    { jobId: 'j1', jobName: 'Web前端开发工程师', coverage: 60, coveredSkills: ['HTML5/CSS3', '响应式布局'] },
  ],
  cr5: [
    { jobId: 'j1', jobName: 'Web前端开发工程师', coverage: 75, coveredSkills: ['JavaScript', 'DOM操作', 'ES6+'] },
    { jobId: 'j3', jobName: '移动应用开发工程师', coverage: 40, coveredSkills: ['JavaScript基础'] },
  ],
  cr9: [
    { jobId: 'j1', jobName: 'Web前端开发工程师', coverage: 90, coveredSkills: ['Vue.js', 'TypeScript', '前端工程化', '组件化开发'] },
  ],
  cr3: [
    { jobId: 'j2', jobName: 'Java后端开发工程师', coverage: 55, coveredSkills: ['Java基础', '面向对象'] },
  ],
  cr6: [
    { jobId: 'j2', jobName: 'Java后端开发工程师', coverage: 65, coveredSkills: ['Java高级', 'IO/多线程', 'JDBC'] },
  ],
  cr10: [
    { jobId: 'j2', jobName: 'Java后端开发工程师', coverage: 85, coveredSkills: ['Spring Boot', 'MyBatis', 'RESTful API', 'JWT认证'] },
    { jobId: 'j5', jobName: '软件测试工程师', coverage: 30, coveredSkills: ['接口规范理解'] },
  ],
  cr12: [
    { jobId: 'j3', jobName: '移动应用开发工程师', coverage: 80, coveredSkills: ['Flutter/RN', 'UI组件', '状态管理', 'APP发布'] },
  ],
  cr14: [
    { jobId: 'j4', jobName: 'DevOps工程师', coverage: 75, coveredSkills: ['Docker', 'Docker Compose', '容器化部署', 'CI/CD'] },
  ],
  cr7: [
    { jobId: 'j4', jobName: 'DevOps工程师', coverage: 60, coveredSkills: ['Linux管理', 'Shell脚本', '服务管理'] },
  ],
  cr19: [
    { jobId: 'j4', jobName: 'DevOps工程师', coverage: 85, coveredSkills: ['Kubernetes', 'Helm', '云原生监控', '集群管理'] },
  ],
  cr16: [
    { jobId: 'j5', jobName: '软件测试工程师', coverage: 88, coveredSkills: ['测试理论', 'Selenium自动化', '接口测试', '性能测试'] },
  ],
  cr15: [
    { jobId: 'j6', jobName: '数据开发工程师', coverage: 65, coveredSkills: ['Python', 'Pandas', '数据分析', '数据可视化'] },
  ],
  cr4: [
    { jobId: 'j2', jobName: 'Java后端开发工程师', coverage: 50, coveredSkills: ['SQL', '数据库设计'] },
    { jobId: 'j6', jobName: '数据开发工程师', coverage: 55, coveredSkills: ['SQL', '数据建模'] },
  ],
  cr13: [
    { jobId: 'j1', jobName: 'Web前端开发工程师', coverage: 70, coveredSkills: ['全栈项目', '前后端联调'] },
    { jobId: 'j2', jobName: 'Java后端开发工程师', coverage: 70, coveredSkills: ['全栈项目', 'API开发'] },
  ],
  cr17: [
    { jobId: 'j2', jobName: 'Java后端开发工程师', coverage: 78, coveredSkills: ['微服务', 'Spring Cloud', '服务治理'] },
    { jobId: 'j4', jobName: 'DevOps工程师', coverage: 50, coveredSkills: ['微服务部署', '服务发现'] },
  ],
  cr18: [
    { jobId: 'j1', jobName: 'Web前端开发工程师', coverage: 45, coveredSkills: ['AI辅助编程', 'LLM集成'] },
    { jobId: 'j2', jobName: 'Java后端开发工程师', coverage: 45, coveredSkills: ['AI辅助编程', 'RAG应用'] },
  ],
}

// ============================================================
// Learning Tasks (keyed by course ID)
// ============================================================

export const learningTaskMap: Record<string, LearningTask[]> = {
  cr9: [
    { id: 'lt-cr9-1', name: '组件化开发实战', knowledge: ['Vue组件', '响应式原理'], qualities: ['代码规范'], generalSkills: ['编程能力'], professionalSkills: ['前端组件设计'] },
    { id: 'lt-cr9-2', name: '状态管理与路由', knowledge: ['Pinia', 'Vue Router'], qualities: ['架构思维'], generalSkills: ['系统设计'], professionalSkills: ['SPA应用架构'] },
    { id: 'lt-cr9-3', name: '企业级项目实战', knowledge: ['TypeScript', 'Element Plus'], qualities: ['团队协作'], generalSkills: ['项目管理'], professionalSkills: ['前端工程化'] },
  ],
  cr10: [
    { id: 'lt-cr10-1', name: 'API接口开发', knowledge: ['Spring Boot', 'RESTful'], qualities: ['规范意识'], generalSkills: ['接口设计'], professionalSkills: ['后端API开发'] },
    { id: 'lt-cr10-2', name: '持久层与数据库', knowledge: ['MyBatis-Plus', 'MySQL'], qualities: ['严谨性'], generalSkills: ['数据建模'], professionalSkills: ['ORM框架使用'] },
    { id: 'lt-cr10-3', name: '认证与安全', knowledge: ['JWT', 'Spring Security'], qualities: ['安全意识'], generalSkills: ['安全防护'], professionalSkills: ['认证授权实现'] },
  ],
  cr13: [
    { id: 'lt-cr13-1', name: '全栈项目架构设计', knowledge: ['前后端分离', 'API规范'], qualities: ['架构思维'], generalSkills: ['系统设计'], professionalSkills: ['全栈架构'] },
    { id: 'lt-cr13-2', name: '前后端联调与部署', knowledge: ['Nginx', '跨域处理'], qualities: ['解决问题'], generalSkills: ['调试能力'], professionalSkills: ['项目部署'] },
  ],
  cr14: [
    { id: 'lt-cr14-1', name: '容器镜像构建', knowledge: ['Dockerfile', '多阶段构建'], qualities: ['精益求精'], generalSkills: ['工具使用'], professionalSkills: ['容器化构建'] },
    { id: 'lt-cr14-2', name: '编排与CI/CD', knowledge: ['Docker Compose', 'Jenkins'], qualities: ['自动化思维'], generalSkills: ['流程设计'], professionalSkills: ['持续交付'] },
  ],
  cr17: [
    { id: 'lt-cr17-1', name: '微服务拆分与治理', knowledge: ['Spring Cloud', 'Nacos'], qualities: ['架构思维'], generalSkills: ['系统设计'], professionalSkills: ['微服务架构'] },
    { id: 'lt-cr17-2', name: '网关与分布式', knowledge: ['Gateway', 'Seata'], qualities: ['全局视野'], generalSkills: ['分布式思维'], professionalSkills: ['分布式系统'] },
  ],
  cr18: [
    { id: 'lt-cr18-1', name: 'AI编程助手应用', knowledge: ['Copilot', 'Prompt'], qualities: ['创新思维'], generalSkills: ['AI工具使用'], professionalSkills: ['AI辅助编程'] },
    { id: 'lt-cr18-2', name: 'LLM应用开发', knowledge: ['LLM API', 'RAG'], qualities: ['前沿意识'], generalSkills: ['API集成'], professionalSkills: ['AI应用开发'] },
  ],
}

// ============================================================
// Job Catalog (additional jobs for picker)
// ============================================================

export const jobCatalog: JobMatch[] = [
  {
    id: 'jc1',
    name: '产品经理助理',
    category: '项目管理',
    matchRate: 55,
    salaryRange: '8-14K',
    demand: '中',
    skills: ['需求分析', '原型设计', 'Axure', '用户研究'],
    profile: {
      education: '大专及以上', experience: '0-1年', level: '初级', demandCount: 900,
      careerPath: '产品助理→产品经理→高级产品→产品总监',
      tasks: ['编写需求文档', '绘制原型图', '竞品分析', '用户调研'],
      tools: ['Axure', 'Figma', '墨刀', 'JIRA'],
      skills: ['需求分析', '原型设计', '数据分析', '沟通表达'],
      qualities: ['同理心', '逻辑思维', '沟通力', '用户视角'],
    },
  },
  {
    id: 'jc2',
    name: '技术支持工程师',
    category: '项目管理',
    matchRate: 60,
    salaryRange: '7-12K',
    demand: '中',
    skills: ['问题排查', '文档编写', '客户沟通', '系统维护'],
    profile: {
      education: '大专及以上', experience: '0-1年', level: '初级', demandCount: 1200,
      careerPath: '技术支持→高级技术支持→售前工程师→解决方案架构师',
      tasks: ['处理客户技术问题', '编写技术文档', '部署与维护系统', '收集产品改进需求'],
      tools: ['工单系统', 'VPN', '远程协助工具', 'Confluence'],
      skills: ['问题诊断', '文档能力', '系统管理', '网络基础'],
      qualities: ['耐心', '沟通力', '服务意识', '快速学习'],
    },
  },
  {
    id: 'jc3',
    name: 'UI/UX设计师',
    category: 'Web前端开发',
    matchRate: 45,
    salaryRange: '8-16K',
    demand: '中',
    skills: ['Figma', '交互设计', '用户体验', '设计系统'],
    profile: {
      education: '大专及以上', experience: '0-2年', level: '初级/中级', demandCount: 1100,
      careerPath: 'UI设计师→高级设计师→设计主管→设计总监',
      tasks: ['界面视觉设计', '交互原型制作', '设计规范维护', '用户可用性测试'],
      tools: ['Figma', 'Sketch', 'Adobe XD', 'Principle'],
      skills: ['视觉设计', '交互设计', '设计系统', '用户研究'],
      qualities: ['审美能力', '细致耐心', '同理心', '创新思维'],
    },
  },
  {
    id: 'jc4',
    name: '网络安全工程师',
    category: 'DevOps运维',
    matchRate: 50,
    salaryRange: '10-20K',
    demand: '中',
    skills: ['渗透测试', '安全防护', '日志分析', '应急响应'],
    profile: {
      education: '大专及以上', experience: '1-3年', level: '中级', demandCount: 800,
      careerPath: '安全工程师→高级安全→安全架构师→CSO',
      tasks: ['安全漏洞扫描与修复', '渗透测试', '安全事件响应', '安全策略制定'],
      tools: ['Nmap', 'Burp Suite', 'Wireshark', 'WAF'],
      skills: ['Web安全', '网络协议', '渗透测试', '安全编码'],
      qualities: ['严谨', '好奇心', '责任心', '持续学习'],
    },
  },
]

// ============================================================
// AI Recommended Jobs
// ============================================================

export const aiRecommendedJobMap: Record<string, AiRecommendedJob[]> = {
  m1: [
    {
      id: 'ai-j1',
      name: '低代码平台开发工程师',
      category: 'Web前端开发',
      matchRate: 72,
      salaryRange: '12-22K',
      reason: '结合前端框架与可视化拖拽技术，低代码平台是深圳企业数字化转型的热门方向',
      relatedCourses: ['Vue.js前端框架开发', '前后端分离项目实战'],
      suggestedCourses: [
        { name: '可视化编辑器开发', reason: '低代码平台核心技术，需要掌握拖拽引擎与DSL设计' },
      ],
    },
    {
      id: 'ai-j2',
      name: 'AI应用开发工程师',
      category: 'Web前端开发',
      matchRate: 68,
      salaryRange: '15-30K',
      reason: '大模型应用开发是2024-2025最热门方向，深圳AI产业生态成熟',
      relatedCourses: ['AI辅助编程实训', 'Python与数据分析'],
      suggestedCourses: [
        { name: 'LangChain应用开发', reason: '企业级AI应用开发框架，市场需求激增' },
      ],
    },
    {
      id: 'ai-j3',
      name: '全栈独立开发者',
      category: 'Java后端开发',
      matchRate: 65,
      salaryRange: '自由定价',
      reason: 'AI降低了全栈开发门槛，独立开发者可快速构建和变现SaaS产品',
      relatedCourses: ['前后端分离项目实战', 'AI辅助编程实训', 'Docker与容器化部署'],
    },
    {
      id: 'ai-j4',
      name: 'SRE可靠性工程师',
      category: 'DevOps运维',
      matchRate: 62,
      salaryRange: '15-30K',
      reason: '从DevOps进阶，SRE是互联网大厂高薪岗位，深圳头部企业需求旺盛',
      relatedCourses: ['Kubernetes与云原生', 'Docker与容器化部署'],
      suggestedCourses: [
        { name: '可观测性与故障排查', reason: 'SRE核心能力，涉及Prometheus/Grafana/链路追踪体系' },
      ],
    },
  ],
}

// ============================================================
// AI Insights
// ============================================================

export const aiInsights = [
  '深圳软件技术专业就业率连续5年超过98%，薪资水平位居全国高职前列',
  '本专业毕业生中，45%进入Web开发岗位，25%从事后端开发，15%选择DevOps方向',
  '建议加强AI辅助开发与低代码平台相关课程，对接产业需求增长点',
  '深圳企业对全栈工程师需求增长显著，前后端分离项目实战课程覆盖核心能力',
  '微服务架构与云原生技术在深圳互联网企业的覆盖率已超过80%',
]

// ============================================================
// Reactive state
// ============================================================

export const createdCourseIds = ref<Set<string>>(
  new Set(['cr1', 'cr2', 'cr3', 'cr4', 'cr5', 'cr6', 'cr7', 'cr8', 'cr9', 'cr10', 'cr11', 'cr12', 'cr13', 'cr14', 'cr15', 'cr16'])
)

export const pendingCourses = ref<Course[]>([
  {
    id: 'pending-1',
    name: 'LangChain应用开发',
    category: 'AI实训课',
    credits: 3,
    hours: 48,
    semester: '第5学期',
    description: 'AI建议：基于大模型应用开发岗位需求，建议新增LangChain框架课程，覆盖RAG、Agent、Tool Use等核心概念',
  },
  {
    id: 'pending-2',
    name: '低代码平台开发',
    category: '专业拓展课',
    credits: 3,
    hours: 48,
    semester: '第5学期',
    description: 'AI建议：低代码/无代码平台是企业数字化转型热点，建议新增可视化编辑器与DSL设计课程',
  },
])
