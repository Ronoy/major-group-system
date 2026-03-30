import { ref } from 'vue'

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

export interface CompetencyItem {
  name: string
  value: number
}

export interface CompetencyCategory {
  name: string
  children: CompetencyItem[]
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
  /** 关联的能力项：知识点、素养、通用技能、专业技能 */
  knowledge: string[]
  qualities: string[]
  generalSkills: string[]
  professionalSkills: string[]
}

export interface NavGroup {
  id: string
  label: string
  icon: string
  children: { id: string; label: string }[]
}

export const navGroups: NavGroup[] = [
  {
    id: 'g1',
    label: '专业管理',
    icon: 'Layers',
    children: [
      { id: 'p1', label: '专业画像分析' },
      { id: 'p2', label: '专业群映射' },
      { id: 'p3', label: '专业布点地图' },
      { id: 'p4', label: '历年开设趋势' },
    ],
  },
  {
    id: 'g2',
    label: '岗位匹配',
    icon: 'Briefcase',
    children: [
      { id: 'p5', label: '岗位匹配分析' },
      { id: 'p6', label: '招聘需求趋势' },
      { id: 'p7', label: '新技术·新岗位预判' },
      { id: 'p8', label: '职业与岗位' },
    ],
  },
  {
    id: 'g3',
    label: '课程建设',
    icon: 'BookOpen',
    children: [
      { id: 'p9', label: '课程地图' },
      { id: 'p10', label: '课程资源库' },
      { id: 'p11', label: '人培方案管理' },
    ],
  },
  {
    id: 'g4',
    label: '数据报告',
    icon: 'BarChart3',
    children: [
      { id: 'p12', label: '专业建设报告' },
      { id: 'p13', label: '人岗匹配报告' },
    ],
  },
]

export interface CollegeItem {
  id: string
  name: string
  majors: { id: string; name: string }[]
}

export const colleges: CollegeItem[] = [
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
  {
    id: 'c2',
    name: '计算机与软件工程学院',
    majors: [
      { id: 'm5', name: '计算机应用技术' },
      { id: 'm6', name: '软件技术' },
      { id: 'm7', name: '大数据技术' },
      { id: 'm8', name: '人工智能技术应用' },
    ],
  },
  {
    id: 'c3',
    name: '智能制造学院',
    majors: [
      { id: 'm9', name: '机电一体化技术' },
      { id: 'm10', name: '工业机器人技术' },
      { id: 'm11', name: '数控技术' },
    ],
  },
  {
    id: 'c4',
    name: '商务与管理学院',
    majors: [
      { id: 'm12', name: '电子商务' },
      { id: 'm13', name: '现代物流管理' },
      { id: 'm14', name: '大数据与会计' },
    ],
  },
]

export const majorInfoMap: Record<string, MajorInfo> = {
  m1: {
    id: 'm1',
    code: '510101',
    name: '电子信息工程技术',
    level: '专科（高职）',
    duration: '3年',
    college: '电子信息工程学院',
    group: '电子与信息大类',
    location: '江西赣州',
    description:
      '本专业培养掌握电子信息工程技术领域的基本理论和基本技能，能从事电子产品设计与开发、电子设备安装调试与维护、信息系统集成与应用等工作的高素质技术技能型人才。紧密对接赣州电子信息产业集群，聚焦智能终端、PCB制造、LED封装等区域支柱产业，培养产业急需的复合型技术人才。',
    enrollment: 180,
    established: '2008年',
    tags: ['省级特色专业', '产教融合示范', '1+X证书试点'],
    trainingPlanUrl: 'https://www.gzpt.edu.cn/xxgc/info/1166/1066.htm',
  },
}

export const jobCategories = [
  '全部岗位',
  '技术开发类',
  '硬件设计类',
  '系统集成类',
  '质量检测类',
  '运维服务类',
  '人工智能类',
]

export const jobMatchMap: Record<string, JobMatch[]> = {
  m1: [
    {
      id: 'j1',
      name: '嵌入式软件工程师',
      category: '技术开发',
      matchRate: 92,
      salaryRange: '8-15万/年',
      demand: '高',
      skills: ['C/C++编程', '嵌入式Linux', 'RTOS系统', '单片机开发'],
      profile: {
        education: '大专及以上',
        experience: '1-3年',
        level: '初级岗位',
        demandCount: 24500,
        careerPath: '嵌入式软件工程师 → 高级嵌入式工程师 → 嵌入式架构师 → 技术总监',
        tasks: ['编写嵌入式设备驱动和应用程序', '调试硬件接口与通信协议', '优化系统性能与内存管理', '参与产品方案设计与技术评审', '编写技术文档和测试报告', '维护和升级现有嵌入式系统'],
        tools: ['Keil MDK', 'IAR Embedded', 'STM32CubeIDE', 'VS Code', 'GCC交叉编译器', 'J-Link调试器', 'Git版本控制', '逻辑分析仪'],
        skills: ['C/C++编程', '嵌入式Linux开发', 'RTOS开发', '单片机开发', '中断与定时器', '嵌入式通信', 'Bootloader开发', 'OTA远程升级'],
        qualities: ['逻辑思维', '问题解决', '耐心细致', '持续学习', '文档编写', '团队协作', '抗压能力', '责任心'],
      },
    },
    {
      id: 'j2',
      name: 'PCB设计工程师',
      category: '硬件设计',
      matchRate: 88,
      salaryRange: '7-12万/年',
      demand: '高',
      skills: ['Altium设计', 'PCB布线', '信号完整性', 'EMC设计'],
      profile: {
        education: '大专及以上',
        experience: '1-3年',
        level: '初级岗位',
        demandCount: 18600,
        careerPath: 'PCB设计工程师 → 高级硬件工程师 → 硬件架构师 → 研发总监',
        tasks: ['完成PCB原理图设计与审核', '进行多层板布局布线', '处理信号完整性与EMC问题', '配合结构工程师完成产品集成', '跟进PCB打样与量产工艺', '制定硬件设计规范文档'],
        tools: ['Altium Designer', 'Cadence Allegro', 'PADS', 'SIwave仿真', 'AutoCAD', '阻抗计算器', 'CAM350', '示波器'],
        skills: ['PCB布局', '高速信号布线', '阻抗匹配', 'EMC/EMI设计', '电源完整性', 'DFM可制造性', 'Altium设计', '信号完整性'],
        qualities: ['空间想象力', '细心严谨', '审美能力', '规范意识', '沟通协调', '持续学习', '质量意识', '成本意识'],
      },
    },
    {
      id: 'j3',
      name: '电子产品测试工程师',
      category: '质量检测',
      matchRate: 85,
      salaryRange: '6-10万/年',
      demand: '中',
      skills: ['测试仪器', '自动化测试', '故障分析', '质量标准'],
      profile: {
        education: '大专及以上',
        experience: '0-2年',
        level: '初级岗位',
        demandCount: 15200,
        careerPath: '测试工程师 → 高级测试工程师 → 测试主管 → 质量经理',
        tasks: ['制定产品测试方案与用例', '执行功能和性能测试', '分析故障原因并出具报告', '搭建自动化测试环境', '参与产品可靠性验证', '跟踪质量改进措施'],
        tools: ['示波器', '万用表', '频谱分析仪', '网络分析仪', 'LabVIEW', 'TestStand', 'Python自动化', 'JIRA'],
        skills: ['功能测试方法', '性能测试设计', '可靠性测试', '自动化测试开发', '故障排查', '测试用例编写', 'EMC测试', '数据分析'],
        qualities: ['严谨性', '逻辑思维', '耐心细致', '质量意识', '文档编写', '沟通能力', '责任心', '安全意识'],
      },
    },
    {
      id: 'j4',
      name: '物联网系统集成工程师',
      category: '系统集成',
      matchRate: 82,
      salaryRange: '8-14万/年',
      demand: '高',
      skills: ['传感器技术', 'MQTT协议', '云平台对接', '系统集成'],
      profile: {
        education: '大专及以上',
        experience: '1-3年',
        level: '中级岗位',
        demandCount: 12800,
        careerPath: '系统集成工程师 → 高级集成工程师 → 项目经理 → 解决方案架构师',
        tasks: ['设计物联网系统整体方案', '选型与集成传感器设备', '部署边缘网关与云平台', '开发数据可视化应用', '现场安装调试与交付验收', '编写项目交付文档'],
        tools: ['MQTT Broker', 'Node-RED', '阿里云IoT', 'ThingsBoard', 'Grafana', 'Docker', 'Postman', '串口工具'],
        skills: ['传感器选型', 'MQTT开发', '边缘网关配置', '云平台对接', '数据可视化', '系统集成', '网络部署调试', 'API开发'],
        qualities: ['系统思维', '沟通协调', '项目管理', '客户服务', '持续学习', '创新意识', '文档编写', '团队协作'],
      },
    },
    {
      id: 'j5',
      name: 'FPGA开发工程师',
      category: '技术开发',
      matchRate: 78,
      salaryRange: '10-18万/年',
      demand: '中',
      skills: ['Verilog编程', 'Vivado工具', '数字电路', '时序分析'],
      profile: {
        education: '本科及以上',
        experience: '1-3年',
        level: '中级岗位',
        demandCount: 8600,
        careerPath: 'FPGA工程师 → 高级FPGA工程师 → 数字IC设计师 → 芯片架构师',
        tasks: ['编写Verilog/VHDL逻辑代码', '完成FPGA时序约束与综合', '进行仿真验证与板级联调', '集成IP核与高速接口', '优化资源占用与功耗', '撰写设计文档与测试报告'],
        tools: ['Vivado', 'Quartus Prime', 'ModelSim', 'SignalTap', 'Synplify', 'ChipScope', 'Matlab', 'Python'],
        skills: ['Verilog编程', '数字电路设计', '时序约束分析', 'FPGA综合', '高速接口设计', 'DSP算法实现', '逻辑分析', '仿真验证'],
        qualities: ['逻辑思维', '数学思维', '耐心细致', '持续学习', '英文阅读', '规范意识', '创新思维', '团队协作'],
      },
    },
    {
      id: 'j6',
      name: '智能终端产品经理',
      category: '产品管理',
      matchRate: 72,
      salaryRange: '10-20万/年',
      demand: '中',
      skills: ['产品规划', '需求分析', '项目管理', '市场调研'],
      profile: {
        education: '本科及以上',
        experience: '2-5年',
        level: '中级岗位',
        demandCount: 6400,
        careerPath: '产品助理 → 产品经理 → 高级产品经理 → 产品总监',
        tasks: ['调研市场需求与竞品分析', '撰写产品需求文档PRD', '设计产品原型与交互', '协调研发团队推进项目', '跟踪数据分析产品效果', '规划产品迭代路线图'],
        tools: ['Axure/Figma', 'Jira/Tapd', 'Visio/ProcessOn', 'Excel数据分析', 'SQL基础', 'Xmind', 'PowerPoint', 'Confluence'],
        skills: ['需求分析', '产品开发', '原型交互设计', '竞品分析', '项目管理', '数据分析', '技术方案评审', '系统集成'],
        qualities: ['用户同理心', '逻辑思维', '沟通表达', '商业敏感度', '团队协作', '抗压能力', '创新意识', '创新思维'],
      },
    },
    {
      id: 'j7',
      name: '电子设备运维工程师',
      category: '运维服务',
      matchRate: 80,
      salaryRange: '5-9万/年',
      demand: '高',
      skills: ['设备维护', '故障排除', '网络运维', '安全管理'],
      profile: {
        education: '大专及以上',
        experience: '0-2年',
        level: '初级岗位',
        demandCount: 21000,
        careerPath: '运维工程师 → 高级运维工程师 → 运维主管 → 运维经理',
        tasks: ['执行设备日常巡检维护', '诊断并排除设备故障', '管理备件库与维修记录', '制定预防性维护计划', '处理紧急故障应急响应', '编写运维操作规范文档'],
        tools: ['万用表/示波器', '网络测试仪', '远程监控系统', 'CMDB资产管理', 'Zabbix监控', 'TeamViewer', '工单系统', 'Excel'],
        skills: ['设备巡检维护', '故障排查', '备件管理', '预防性维护', '网络运维基础', '安全用电管理', '运维文档编写', '应急响应处理'],
        qualities: ['责任心', '动手能力', '安全意识', '服务意识', '问题解决', '沟通表达', '耐心细致', '团队协作'],
      },
    },
    {
      id: 'j8',
      name: 'AI边缘计算工程师',
      category: '人工智能',
      matchRate: 68,
      salaryRange: '12-22万/年',
      demand: '中',
      skills: ['TFLite部署', '模型优化', 'ARM开发', '边缘推理'],
      profile: {
        education: '大专及以上',
        experience: '1-3年',
        level: '中级岗位',
        demandCount: 8600,
        careerPath: 'AI边缘工程师 → 高级AI工程师 → AI架构师 → 技术总监',
        tasks: ['将AI模型量化压缩部署到边缘设备', '优化推理性能与功耗', '开发边缘端视觉算法应用', '搭建模型训练与验证流水线', '对接云端模型更新OTA', '编写算法评估与优化报告'],
        tools: ['TensorFlow Lite', 'ONNX Runtime', 'OpenVINO', 'NVIDIA TensorRT', 'Docker', 'Python', 'C++', 'Git'],
        skills: ['模型部署', '边缘计算', 'ARM/NPU优化', '图像处理', '模型转换适配', '性能分析', '嵌入式Linux开发', 'API开发'],
        qualities: ['数学思维', '动手能力', '持续学习', '创新思维', '问题解决', '英文阅读', '逻辑思维', '团队协作'],
      },
    },
  ],
}

export const competencyMap: Record<string, CompetencyItem[]> = {
  m1: [
    { name: '电路设计', value: 90 },
    { name: '嵌入式开发', value: 85 },
    { name: 'PCB设计', value: 88 },
    { name: '信号处理', value: 75 },
    { name: '通信技术', value: 78 },
    { name: '编程能力', value: 82 },
    { name: '测试调试', value: 86 },
    { name: '物联网应用', value: 80 },
  ],
}

export const competencyCategoryMap: Record<string, CompetencyCategory[]> = {
  m1: [
    {
      name: '硬件设计',
      children: [
        { name: '电路设计', value: 90 },
        { name: 'PCB设计', value: 88 },
      ],
    },
    {
      name: '软件开发',
      children: [
        { name: '嵌入式开发', value: 85 },
        { name: '单片机应用', value: 88 },
      ],
    },
    {
      name: '通信与IoT',
      children: [
        { name: '通信技术', value: 78 },
        { name: '物联网应用', value: 80 },
      ],
    },
    {
      name: '测试与AI',
      children: [
        { name: '测试调试', value: 86 },
        { name: '边缘计算', value: 62 },
      ],
    },
  ],
}

export const courseMap: Record<string, Course[]> = {
  m1: [
    {
      id: 'cr1',
      name: '电路分析基础',
      category: '专业基础课',
      credits: 4,
      hours: 64,
      semester: '第1学期',
      description: '学习直流电路、交流电路的基本分析方法',
      objectives: ['掌握电路基本定律和分析方法', '能运用戴维南定理等简化复杂电路', '具备交流电路的稳态分析能力', '能使用仪器仪表进行电路测量'],
      contents: ['电路基本概念与定律', '电阻电路分析方法', '正弦交流电路', '三相电路', '暂态分析', '电路仿真实验'],
      teachingMethods: ['理论讲授', '实验操作', '仿真实训', '项目驱动'],
      assessment: '过程考核40%（实验报告+课堂测验）+ 期末考试60%',
    },
    {
      id: 'cr2',
      name: '模拟电子技术',
      category: '专业基础课',
      credits: 4,
      hours: 64,
      semester: '第2学期',
      description: '掌握放大器、运算放大器等模拟电路设计',
      prerequisites: ['cr1'],
      objectives: ['理解半导体器件工作原理', '掌握基本放大电路分析与设计', '能设计运算放大器应用电路', '具备模拟电路调试与故障排除能力'],
      contents: ['半导体二极管与三极管', '基本放大电路', '多级放大器', '运算放大器', '反馈与稳定性', '信号发生与功率放大'],
      teachingMethods: ['理论讲授', '实验操作', 'EDA仿真', '课程设计'],
      assessment: '实验考核30%（实验操作+报告）+ 课程设计20% + 期末考试50%',
    },
    {
      id: 'cr3',
      name: '数字电子技术',
      category: '专业基础课',
      credits: 3.5,
      hours: 56,
      semester: '第2学期',
      description: '学习组合逻辑、时序逻辑电路设计方法',
      prerequisites: ['cr1'],
      objectives: ['掌握数制转换与逻辑代数化简', '能设计组合逻辑与时序逻辑电路', '了解可编程逻辑器件原理', '具备数字系统初步设计能力'],
      contents: ['数制与编码', '逻辑门电路', '组合逻辑设计', '触发器与时序电路', '脉冲波形产生', 'D/A与A/D转换'],
      teachingMethods: ['理论讲授', '实验操作', 'EDA仿真', '小组项目'],
      assessment: '平时成绩30% + 实验报告20% + 期末考试50%',
    },
    {
      id: 'cr4',
      name: 'C语言程序设计',
      category: '专业基础课',
      credits: 4,
      hours: 64,
      semester: '第1学期',
      description: '掌握C语言编程基础与嵌入式编程思维',
      objectives: ['掌握C语言基本语法与编程范式', '能编写结构化程序解决实际问题', '理解指针与内存管理', '具备嵌入式编程基本思维'],
      contents: ['数据类型与运算', '流程控制', '数组与字符串', '函数与模块化', '指针与动态内存', '结构体与文件操作'],
      teachingMethods: ['理论讲授', '上机实践', '编程练习', '课程项目'],
      assessment: '编程作业30% + 上机考试20% + 期末考试50%',
    },
    {
      id: 'cr5',
      name: '工程数学',
      category: '专业基础课',
      credits: 3,
      hours: 48,
      semester: '第1学期',
      description: '高等数学、线性代数在工程中的应用',
      objectives: ['掌握微积分基本方法', '能运用线性代数解决工程问题', '理解概率统计基本概念', '具备工程计算能力'],
      contents: ['微积分', '常微分方程', '线性代数', '概率与数理统计'],
      teachingMethods: ['理论讲授', '案例分析', '数学建模'],
      assessment: '课堂测验20% + 作业20% + 期末考试60%',
    },
    {
      id: 'cr6',
      name: '单片机原理与应用',
      category: '专业核心课',
      credits: 4,
      hours: 64,
      semester: '第3学期',
      description: '基于STM32的嵌入式系统开发核心课程',
      prerequisites: ['cr3', 'cr4'],
      objectives: ['掌握STM32单片机体系结构', '能独立完成GPIO、定时器、中断等外设编程', '具备串口/SPI/I2C通信开发能力', '能完成基于单片机的综合项目'],
      contents: ['STM32体系结构', 'GPIO与中断系统', '定时器与PWM', 'ADC/DAC数据采集', '串口/SPI/I2C通信', '综合项目实战'],
      teachingMethods: ['理实一体化', '项目驱动', '任务导向', '企业案例'],
      assessment: '项目成果40%（含答辩）+ 实验报告20% + 期末考核40%',
    },
    {
      id: 'cr7',
      name: 'PCB设计与制作',
      category: '专业核心课',
      credits: 3,
      hours: 48,
      semester: '第3学期',
      description: '使用Altium Designer进行PCB设计制造全流程',
      prerequisites: ['cr2'],
      objectives: ['掌握Altium Designer软件操作', '能完成原理图设计与PCB布局布线', '了解DFM可制造性设计规范', '能独立完成PCB打样全流程'],
      contents: ['Altium Designer操作', '原理图设计', 'PCB布局与布线', '设计规则检查', 'Gerber文件输出', 'PCB打样与焊接'],
      teachingMethods: ['理实一体化', '企业项目导入', '工学交替'],
      assessment: '设计作品50%（含PCB实物）+ 过程考核20% + 期末考核30%',
    },
    {
      id: 'cr8',
      name: '传感器与检测技术',
      category: '专业核心课',
      credits: 3,
      hours: 48,
      semester: '第3学期',
      description: '各类传感器原理、信号调理与数据采集',
      prerequisites: ['cr2'],
      objectives: ['了解常用传感器工作原理', '能进行传感器选型与信号调理', '掌握数据采集系统设计方法', '能完成传感器应用项目'],
      contents: ['传感器概论', '温度/湿度/光照传感器', '力/压力/加速度传感器', '信号调理电路', '数据采集系统', '综合应用项目'],
      teachingMethods: ['理论讲授', '实验操作', '项目实训'],
      assessment: '实验报告30% + 项目设计30% + 期末考试40%',
    },
    {
      id: 'cr9',
      name: '嵌入式系统开发',
      category: '专业核心课',
      credits: 4,
      hours: 64,
      semester: '第4学期',
      description: '嵌入式Linux系统开发与驱动编程',
      prerequisites: ['cr6'],
      objectives: ['掌握嵌入式Linux系统构建', '能编写字符/块设备驱动程序', '具备交叉编译与调试能力', '能完成嵌入式应用开发项目'],
      contents: ['嵌入式Linux基础', 'Bootloader与内核移植', '设备驱动开发', '文件系统与进程管理', '网络编程', '综合项目实战'],
      teachingMethods: ['理实一体化', '项目驱动', '企业案例', '翻转课堂'],
      assessment: '项目成果45%（含答辩）+ 实验报告15% + 期末考核40%',
    },
    {
      id: 'cr10',
      name: '电子产品生产工艺',
      category: '专业核心课',
      credits: 3,
      hours: 48,
      semester: '第4学期',
      description: 'SMT工艺、焊接技术、质量管控',
      prerequisites: ['cr7'],
      objectives: ['了解电子产品生产全流程', '掌握SMT贴片工艺流程', '能进行焊接质量检测', '具备生产工艺文件编写能力'],
      contents: ['电子产品生产流程', 'SMT贴片工艺', '手工焊接与返修', '质量检测标准', '工艺文件编写', '产线实训'],
      teachingMethods: ['现场教学', '工学交替', '企业导师'],
      assessment: '实操考核50% + 工艺文件20% + 期末考试30%',
    },
    {
      id: 'cr11',
      name: '通信原理与应用',
      category: '专业核心课',
      credits: 3,
      hours: 48,
      semester: '第4学期',
      description: '通信系统基本原理、调制解调、数字通信',
      prerequisites: ['cr3'],
      objectives: ['理解通信系统基本模型', '掌握调制解调基本原理', '了解数字通信技术', '能搭建简单通信系统'],
      contents: ['通信系统模型', '模拟调制', '数字基带传输', '数字调制技术', '信道编码', '通信系统仿真'],
      teachingMethods: ['理论讲授', '仿真实验', '课程设计'],
      assessment: '实验报告25% + 课程设计25% + 期末考试50%',
    },
    {
      id: 'cr12',
      name: 'Python与数据分析',
      category: 'AI实训课',
      credits: 3,
      hours: 48,
      semester: '第4学期',
      description: 'Python编程基础与数据处理分析实战',
      prerequisites: ['cr4'],
      objectives: ['掌握Python编程基础语法', '能使用NumPy/Pandas进行数据处理', '能进行数据可视化分析', '具备数据驱动决策思维'],
      contents: ['Python基础语法', 'NumPy数值计算', 'Pandas数据处理', 'Matplotlib可视化', '数据清洗与特征工程', '数据分析实战项目'],
      teachingMethods: ['翻转课堂', '项目驱动', '在线实训'],
      assessment: '编程作业30% + 数据分析项目40% + 期末考试30%',
    },
    {
      id: 'cr13',
      name: '机器学习与智能算法',
      category: 'AI实训课',
      credits: 3,
      hours: 48,
      semester: '第5学期',
      description: '常用机器学习算法原理与工程实践',
      prerequisites: ['cr12'],
      objectives: ['理解监督/无监督学习基本概念', '掌握常用分类与回归算法', '能使用Scikit-learn完成建模', '具备模型评估与优化能力'],
      contents: ['机器学习概论', '线性回归与逻辑回归', '决策树与随机森林', 'SVM与KNN', '聚类算法', '模型评估与调优'],
      teachingMethods: ['理论讲授', '案例实践', '竞赛驱动'],
      assessment: '课程作业25% + 算法实践项目45% + 期末考试30%',
    },
    {
      id: 'cr14',
      name: 'AI边缘计算实训',
      category: 'AI实训课',
      credits: 4,
      hours: 64,
      semester: '第5学期',
      description: 'AI模型在嵌入式设备上的部署与优化',
      prerequisites: ['cr9', 'cr13'],
      objectives: ['掌握模型量化与压缩技术', '能将TFLite/ONNX模型部署到边缘设备', '具备推理性能优化能力', '能完成端侧AI应用项目'],
      contents: ['边缘计算概论', '模型量化与剪枝', 'TFLite模型转换与部署', 'ONNX Runtime应用', 'ARM/NPU推理优化', '端侧AI项目实战'],
      teachingMethods: ['项目驱动', '企业案例', '竞赛导向'],
      assessment: '项目成果55%（含答辩演示）+ 过程考核15% + 期末考核30%',
    },
    {
      id: 'cr15',
      name: '智能产品综合项目',
      category: 'AI实训课',
      credits: 4,
      hours: 64,
      semester: '第5学期',
      description: '从需求分析到产品交付的全流程AI项目实战',
      prerequisites: ['cr14'],
      objectives: ['能完成产品需求分析与方案设计', '具备团队协作与项目管理能力', '能完成产品集成测试与交付', '具备创新设计与产品展示能力'],
      contents: ['需求分析与方案设计', '硬件选型与搭建', '软件开发与集成', '测试与质量保障', '产品演示与答辩'],
      teachingMethods: ['项目制学习', '团队协作', '企业导师', '路演答辩'],
      assessment: '项目成果60%（含路演答辩）+ 过程文档20% + 个人贡献20%',
    },
    {
      id: 'cr16',
      name: 'EDA技术与FPGA应用',
      category: '专业拓展课',
      credits: 3,
      hours: 48,
      semester: '第4学期',
      description: 'FPGA开发基础与数字系统设计',
      prerequisites: ['cr3'],
      objectives: ['掌握Verilog HDL基本语法', '能使用Vivado/Quartus进行FPGA开发', '具备数字系统仿真与验证能力', '能完成简单FPGA应用项目'],
      contents: ['Verilog HDL语法', 'FPGA开发流程', '组合与时序逻辑设计', 'IP核使用', '仿真与时序分析', 'FPGA项目实训'],
      teachingMethods: ['理实一体化', '项目驱动'],
      assessment: '设计作品40% + 实验报告20% + 期末考试40%',
    },
    {
      id: 'cr17',
      name: '物联网系统集成',
      category: '专业拓展课',
      credits: 3,
      hours: 48,
      semester: '第5学期',
      description: '物联网架构、协议与综合应用开发',
      prerequisites: ['cr6', 'cr8'],
      objectives: ['理解物联网三层架构', '掌握MQTT/CoAP等IoT协议', '能搭建物联网数据采集与可视化系统', '具备IoT系统集成能力'],
      contents: ['物联网架构概论', 'MQTT/CoAP协议', '传感器网络', '边缘网关与云平台', '数据可视化', 'IoT综合项目'],
      teachingMethods: ['项目驱动', '案例教学', '企业导师'],
      assessment: '项目成果50% + 实验报告20% + 期末考试30%',
    },
    {
      id: 'cr18',
      name: '智能制造概论',
      category: '专业拓展课',
      credits: 2,
      hours: 32,
      semester: '第5学期',
      description: '工业4.0、智能工厂与数字化转型',
      objectives: ['了解工业4.0与智能制造体系', '理解数字孪生与工业互联网', '了解智能工厂生产模式', '具备跨领域融合视野'],
      contents: ['工业4.0概论', '智能工厂架构', '数字孪生技术', '工业互联网', '智能制造案例'],
      teachingMethods: ['理论讲授', '企业参观', '案例分析'],
      assessment: '课程报告40% + 课堂表现20% + 期末考试40%',
    },
    {
      id: 'cr19',
      name: '创新创业实践',
      category: '专业拓展课',
      credits: 2,
      hours: 32,
      semester: '第4学期',
      description: '电子信息领域创新项目孵化与创业实践',
      objectives: ['了解创新创业基本流程', '能完成商业计划书撰写', '具备创新项目策划与路演能力', '培养创新思维与企业家精神'],
      contents: ['创新方法论', '商业模式设计', '产品原型开发', '路演与融资', '创业案例分析'],
      teachingMethods: ['工作坊', '项目孵化', '导师辅导', '路演答辩'],
      assessment: '商业计划书40% + 路演答辩40% + 过程参与20%',
    },
    {
      id: 'cr20',
      name: '顶岗实习',
      category: '专业核心课',
      credits: 16,
      hours: 480,
      semester: '第6学期',
      description: '在电子信息企业进行岗位实习实践',
      prerequisites: ['cr15'],
      objectives: ['能胜任企业电子信息相关岗位工作', '具备职业素养与团队协作能力', '积累行业实践经验', '完成实习报告与总结'],
      contents: ['岗位技能实践', '企业文化适应', '项目参与', '实习报告撰写'],
      teachingMethods: ['岗位实践', '企业导师', '校企双导师'],
      assessment: '企业评价50% + 实习报告30% + 答辩20%',
    },
    {
      id: 'cr21',
      name: '毕业设计',
      category: '专业核心课',
      credits: 6,
      hours: 120,
      semester: '第6学期',
      description: '完成电子信息相关课题的毕业设计与答辩',
      prerequisites: ['cr15'],
      objectives: ['能独立完成课题研究与方案设计', '具备系统开发与集成能力', '能撰写规范的毕业论文', '通过毕业答辩'],
      contents: ['课题选题与开题', '方案设计与实施', '论文撰写', '毕业答辩'],
      teachingMethods: ['导师指导', '自主研究'],
      assessment: '论文质量40% + 作品成果30% + 答辩表现30%',
    },
  ],
}

/** 课程→岗位覆盖度映射 */
export const courseJobLinkMap: Record<string, CourseJobLink[]> = {
  cr1: [
    { jobId: 'j2', jobName: 'PCB设计工程师', coverage: 72, coveredSkills: ['电路分析', '阻抗匹配', '电源完整性'] },
    { jobId: 'j7', jobName: '电子设备运维工程师', coverage: 58, coveredSkills: ['电路诊断', '故障排除'] },
    { jobId: 'j3', jobName: '电子产品测试工程师', coverage: 45, coveredSkills: ['电路测量', '故障定位'] },
  ],
  cr2: [
    { jobId: 'j2', jobName: 'PCB设计工程师', coverage: 68, coveredSkills: ['模拟电路设计', '信号完整性', '电源设计'] },
    { jobId: 'j1', jobName: '嵌入式软件工程师', coverage: 35, coveredSkills: ['硬件接口理解', '信号调理'] },
  ],
  cr3: [
    { jobId: 'j5', jobName: 'FPGA开发工程师', coverage: 75, coveredSkills: ['数字逻辑设计', '时序分析', '组合逻辑'] },
    { jobId: 'j1', jobName: '嵌入式软件工程师', coverage: 40, coveredSkills: ['数字接口', '逻辑设计基础'] },
  ],
  cr4: [
    { jobId: 'j1', jobName: '嵌入式软件工程师', coverage: 82, coveredSkills: ['C/C++编程', '指针与内存', '嵌入式编程思维', '模块化设计'] },
    { jobId: 'j8', jobName: 'AI边缘计算工程师', coverage: 38, coveredSkills: ['C++基础', '底层编程'] },
  ],
  cr5: [
    { jobId: 'j5', jobName: 'FPGA开发工程师', coverage: 30, coveredSkills: ['数学基础', 'DSP算法'] },
    { jobId: 'j8', jobName: 'AI边缘计算工程师', coverage: 28, coveredSkills: ['线性代数', '概率统计'] },
  ],
  cr6: [
    { jobId: 'j1', jobName: '嵌入式软件工程师', coverage: 90, coveredSkills: ['单片机外设驱动', '中断与定时器', '串口/SPI/I2C通信', 'GPIO编程', 'ADC采集'] },
    { jobId: 'j4', jobName: '物联网系统集成工程师', coverage: 55, coveredSkills: ['传感器接口', '边缘数据采集'] },
    { jobId: 'j3', jobName: '电子产品测试工程师', coverage: 42, coveredSkills: ['功能测试', '板级调试'] },
  ],
  cr7: [
    { jobId: 'j2', jobName: 'PCB设计工程师', coverage: 92, coveredSkills: ['PCB多层板设计', 'Altium Designer操作', '布局布线', 'DFM设计', 'Gerber输出'] },
    { jobId: 'j3', jobName: '电子产品测试工程师', coverage: 35, coveredSkills: ['PCB检测', '焊接质量'] },
  ],
  cr8: [
    { jobId: 'j3', jobName: '电子产品测试工程师', coverage: 72, coveredSkills: ['传感器测试', '信号采集', '检测方法'] },
    { jobId: 'j4', jobName: '物联网系统集成工程师', coverage: 68, coveredSkills: ['传感器选型集成', '数据采集', '信号调理'] },
    { jobId: 'j1', jobName: '嵌入式软件工程师', coverage: 40, coveredSkills: ['传感器驱动', '数据采集编程'] },
  ],
  cr9: [
    { jobId: 'j1', jobName: '嵌入式软件工程师', coverage: 88, coveredSkills: ['嵌入式Linux开发', 'Bootloader开发', '驱动编程', '交叉编译', '系统移植'] },
    { jobId: 'j8', jobName: 'AI边缘计算工程师', coverage: 52, coveredSkills: ['Linux嵌入式', 'ARM开发', '系统优化'] },
  ],
  cr10: [
    { jobId: 'j3', jobName: '电子产品测试工程师', coverage: 78, coveredSkills: ['SMT工艺检测', '焊接质量', '生产标准', '可靠性测试'] },
    { jobId: 'j6', jobName: '智能终端产品经理', coverage: 55, coveredSkills: ['生产工艺理解', '产品质量管控'] },
    { jobId: 'j7', jobName: '电子设备运维工程师', coverage: 48, coveredSkills: ['设备维护', '故障分析'] },
  ],
  cr11: [
    { jobId: 'j4', jobName: '物联网系统集成工程师', coverage: 75, coveredSkills: ['通信协议', '网络部署', '数据传输'] },
    { jobId: 'j7', jobName: '电子设备运维工程师', coverage: 62, coveredSkills: ['网络运维', '通信系统维护'] },
  ],
  cr12: [
    { jobId: 'j8', jobName: 'AI边缘计算工程师', coverage: 65, coveredSkills: ['Python编程', '数据处理', '特征工程'] },
    { jobId: 'j6', jobName: '智能终端产品经理', coverage: 35, coveredSkills: ['数据分析决策'] },
  ],
  cr13: [
    { jobId: 'j8', jobName: 'AI边缘计算工程师', coverage: 78, coveredSkills: ['模型训练', '算法理解', '模型评估', '调优方法'] },
  ],
  cr14: [
    { jobId: 'j8', jobName: 'AI边缘计算工程师', coverage: 92, coveredSkills: ['模型量化压缩', '边缘推理部署', 'TFLite部署', 'ARM/NPU优化', '性能分析调优'] },
    { jobId: 'j1', jobName: '嵌入式软件工程师', coverage: 42, coveredSkills: ['嵌入式应用', '性能优化'] },
  ],
  cr15: [
    { jobId: 'j6', jobName: '智能终端产品经理', coverage: 70, coveredSkills: ['需求分析', '项目管理', '产品交付', '方案设计'] },
    { jobId: 'j8', jobName: 'AI边缘计算工程师', coverage: 55, coveredSkills: ['AI应用集成', '项目实践'] },
    { jobId: 'j1', jobName: '嵌入式软件工程师', coverage: 45, coveredSkills: ['系统集成', '项目开发'] },
  ],
  cr16: [
    { jobId: 'j5', jobName: 'FPGA开发工程师', coverage: 88, coveredSkills: ['Verilog/VHDL编程', 'FPGA开发', '时序约束', 'IP核集成', '仿真验证'] },
  ],
  cr17: [
    { jobId: 'j4', jobName: '物联网系统集成工程师', coverage: 85, coveredSkills: ['MQTT/CoAP协议', '边缘网关配置', '云平台对接', '系统方案设计', 'IoT集成'] },
    { jobId: 'j7', jobName: '电子设备运维工程师', coverage: 40, coveredSkills: ['设备网络管理'] },
  ],
  cr18: [
    { jobId: 'j6', jobName: '智能终端产品经理', coverage: 45, coveredSkills: ['产业视野', '数字化转型'] },
    { jobId: 'j4', jobName: '物联网系统集成工程师', coverage: 30, coveredSkills: ['工业IoT理解'] },
  ],
  cr19: [
    { jobId: 'j6', jobName: '智能终端产品经理', coverage: 60, coveredSkills: ['需求调研', '产品方案', '商业模式', '创新思维'] },
  ],
  cr20: [
    { jobId: 'j1', jobName: '嵌入式软件工程师', coverage: 85, coveredSkills: ['岗位实践', '企业协作', '职业素养'] },
    { jobId: 'j2', jobName: 'PCB设计工程师', coverage: 85, coveredSkills: ['岗位实践', '企业协作', '职业素养'] },
    { jobId: 'j3', jobName: '电子产品测试工程师', coverage: 85, coveredSkills: ['岗位实践', '企业协作', '职业素养'] },
    { jobId: 'j4', jobName: '物联网系统集成工程师', coverage: 85, coveredSkills: ['岗位实践', '企业协作', '职业素养'] },
    { jobId: 'j7', jobName: '电子设备运维工程师', coverage: 85, coveredSkills: ['岗位实践', '企业协作', '职业素养'] },
  ],
  cr21: [
    { jobId: 'j1', jobName: '嵌入式软件工程师', coverage: 70, coveredSkills: ['综合设计', '独立研究', '技术文档'] },
    { jobId: 'j2', jobName: 'PCB设计工程师', coverage: 70, coveredSkills: ['综合设计', '独立研究', '技术文档'] },
    { jobId: 'j5', jobName: 'FPGA开发工程师', coverage: 70, coveredSkills: ['综合设计', '独立研究', '技术文档'] },
  ],
}

/** 课程学习任务映射 */
export const learningTaskMap: Record<string, LearningTask[]> = {
  // 电路分析基础
  cr1: [
    { id: 'lt-cr1-1', name: '直流电路分析与计算', knowledge: ['基尔霍夫定律', '欧姆定律', '节点电压法'], qualities: ['逻辑思维', '严谨性'], generalSkills: ['数学计算', '数据分析'], professionalSkills: ['电路分析', '电路仿真'] },
    { id: 'lt-cr1-2', name: '交流电路特性测量', knowledge: ['阻抗概念', '相量分析', '功率因数'], qualities: ['实验规范', '安全意识'], generalSkills: ['仪器操作', '实验记录'], professionalSkills: ['交流测量', '示波器使用'] },
  ],
  // C语言程序设计
  cr2: [
    { id: 'lt-cr2-1', name: '嵌入式C语言基础编程', knowledge: ['数据类型', '指针与数组', '结构体'], qualities: ['逻辑思维', '耐心细致'], generalSkills: ['代码调试', '文档编写'], professionalSkills: ['C/C++编程', '代码规范'] },
    { id: 'lt-cr2-2', name: '单片机GPIO控制程序开发', knowledge: ['寄存器操作', '位运算', 'GPIO配置'], qualities: ['动手能力', '问题解决'], generalSkills: ['编程调试', '版本管理'], professionalSkills: ['单片机开发', '嵌入式通信'] },
  ],
  // 电子技术基础
  cr3: [
    { id: 'lt-cr3-1', name: '模拟电路设计与仿真', knowledge: ['放大电路', '反馈原理', '运算放大器'], qualities: ['创新思维', '严谨性'], generalSkills: ['仿真验证', '数据分析'], professionalSkills: ['模拟电路设计', 'Multisim仿真'] },
    { id: 'lt-cr3-2', name: '数字逻辑电路搭建', knowledge: ['组合逻辑', '时序逻辑', '触发器'], qualities: ['逻辑思维', '规范意识'], generalSkills: ['实验操作', '故障排查'], professionalSkills: ['数字电路设计', '逻辑分析'] },
  ],
  // 单片机应用技术
  cr4: [
    { id: 'lt-cr4-1', name: 'STM32最小系统搭建', knowledge: ['ARM架构', '时钟系统', '启动流程'], qualities: ['动手能力', '安全意识'], generalSkills: ['焊接技术', '原理图阅读'], professionalSkills: ['单片机开发', '中断与定时器'] },
    { id: 'lt-cr4-2', name: '外设驱动开发与通信', knowledge: ['UART协议', 'SPI/I2C通信', '中断机制'], qualities: ['耐心细致', '持续学习'], generalSkills: ['技术文档阅读', '代码调试'], professionalSkills: ['嵌入式通信', 'Bootloader开发'] },
  ],
  // 传感器与检测技术
  cr5: [
    { id: 'lt-cr5-1', name: '温湿度传感器数据采集', knowledge: ['传感器原理', 'ADC转换', '信号调理'], qualities: ['严谨性', '数据敏感'], generalSkills: ['数据记录', '数据分析'], professionalSkills: ['传感器选型', '数据采集'] },
    { id: 'lt-cr5-2', name: '多传感器融合检测系统', knowledge: ['多传感器融合', '滤波算法', '标定方法'], qualities: ['系统思维', '创新意识'], generalSkills: ['方案设计', '项目报告'], professionalSkills: ['系统集成', '信号处理'] },
  ],
  // PCB设计与制作
  cr6: [
    { id: 'lt-cr6-1', name: '双层PCB原理图与布局', knowledge: ['原理图规则', '封装库', '布局原则'], qualities: ['审美能力', '细心严谨'], generalSkills: ['EDA工具操作', '规范执行'], professionalSkills: ['Altium设计', 'PCB布局'] },
    { id: 'lt-cr6-2', name: '高速信号PCB布线', knowledge: ['阻抗控制', '等长约束', 'EMC规则'], qualities: ['质量意识', '规范意识'], generalSkills: ['仿真验证', '设计评审'], professionalSkills: ['高速信号布线', '信号完整性'] },
  ],
  // 嵌入式系统开发
  cr7: [
    { id: 'lt-cr7-1', name: 'RTOS任务调度与管理', knowledge: ['FreeRTOS', '任务优先级', '信号量'], qualities: ['逻辑思维', '系统思维'], generalSkills: ['技术架构', '性能分析'], professionalSkills: ['RTOS开发', 'OTA远程升级'] },
    { id: 'lt-cr7-2', name: 'Linux嵌入式应用开发', knowledge: ['Linux系统调用', '进程管理', '文件IO'], qualities: ['持续学习', '问题解决'], generalSkills: ['Linux操作', '脚本编写'], professionalSkills: ['嵌入式Linux开发', 'API开发'] },
  ],
  // 物联网应用技术
  cr8: [
    { id: 'lt-cr8-1', name: 'MQTT物联网通信实践', knowledge: ['MQTT协议', 'Topic设计', 'QoS等级'], qualities: ['系统思维', '创新意识'], generalSkills: ['网络调试', '协议分析'], professionalSkills: ['MQTT开发', '数据可视化'] },
    { id: 'lt-cr8-2', name: '物联网云平台对接', knowledge: ['REST API', '设备影子', '数据模型'], qualities: ['项目管理', '团队协作'], generalSkills: ['接口调试', '文档编写'], professionalSkills: ['云平台对接', 'API开发'] },
  ],
  // 电子产品生产工艺
  cr9: [
    { id: 'lt-cr9-1', name: 'SMT贴片工艺实训', knowledge: ['SMT流程', '回流焊', '钢网设计'], qualities: ['质量意识', '安全意识'], generalSkills: ['工艺记录', '质量检验'], professionalSkills: ['SMT工艺', '可靠性测试'] },
    { id: 'lt-cr9-2', name: '电子产品整机装配', knowledge: ['装配工艺', '防静电', '工艺文件'], qualities: ['规范意识', '团队协作'], generalSkills: ['工艺文件编写', '故障排查'], professionalSkills: ['整机装配', 'DFM可制造性'] },
  ],
  // Python与数据分析
  cr10: [
    { id: 'lt-cr10-1', name: 'Python数据处理与可视化', knowledge: ['Pandas库', '数据清洗', 'Matplotlib'], qualities: ['逻辑思维', '创新思维'], generalSkills: ['数据分析', '图表制作'], professionalSkills: ['Python编程', '数据可视化'] },
    { id: 'lt-cr10-2', name: '设备数据分析报告', knowledge: ['统计方法', '异常检测', '趋势分析'], qualities: ['严谨性', '文档编写'], generalSkills: ['报告撰写', '数据解读'], professionalSkills: ['数据分析', '性能分析'] },
  ],
  // FPGA数字系统设计
  cr11: [
    { id: 'lt-cr11-1', name: 'Verilog组合逻辑设计', knowledge: ['Verilog语法', '组合电路', '综合约束'], qualities: ['逻辑思维', '规范意识'], generalSkills: ['HDL编码', '仿真验证'], professionalSkills: ['Verilog编程', 'FPGA综合'] },
  ],
  // AI边缘计算实训
  cr12: [
    { id: 'lt-cr12-1', name: 'TFLite模型部署实训', knowledge: ['模型量化', 'TFLite框架', '边缘推理'], qualities: ['创新思维', '持续学习'], generalSkills: ['模型评估', '性能分析'], professionalSkills: ['模型部署', '边缘计算'] },
  ],
  // 智能传感网络实训
  cr13: [
    { id: 'lt-cr13-1', name: '无线传感网络组网', knowledge: ['ZigBee协议', '网络拓扑', '功耗管理'], qualities: ['系统思维', '团队协作'], generalSkills: ['网络配置', '故障排查'], professionalSkills: ['WSN组网', '无线通信'] },
  ],
  // 机器视觉应用实训
  cr14: [
    { id: 'lt-cr14-1', name: 'OpenCV图像处理实践', knowledge: ['图像滤波', '边缘检测', '特征提取'], qualities: ['创新思维', '数学思维'], generalSkills: ['算法实现', '性能分析'], professionalSkills: ['图像处理', '数据可视化'] },
  ],
  // 智能产品项目实战
  cr15: [
    { id: 'lt-cr15-1', name: '智能产品原型设计与开发', knowledge: ['需求分析', '系统架构', '原型设计'], qualities: ['创新意识', '项目管理'], generalSkills: ['团队协作', '项目汇报'], professionalSkills: ['产品开发', '系统集成'] },
    // ↑ 产品开发、系统集成、需求分析 等与多个岗位技能重合
  ],
}

/** AI 推荐岗位 — 基于专业教学内容与产业趋势关联分析 */
export interface AiRecommendedJob {
  id: string
  name: string
  category: string
  matchRate: number
  salaryRange: string
  reason: string
  relatedCourses: string[]
  /** 建议新增的课程（添加该岗位后建议开设） */
  suggestedCourses?: { name: string; reason: string }[]
}

export const aiRecommendedJobMap: Record<string, AiRecommendedJob[]> = {
  m1: [
    {
      id: 'ai-j1',
      name: '智能硬件测试工程师',
      category: '质量检测',
      matchRate: 76,
      salaryRange: '8-14万/年',
      reason: '专业课程覆盖传感器、嵌入式、测试三大核心能力，与智能硬件测试岗位高度契合',
      relatedCourses: ['传感器与检测技术', '电子产品生产工艺', '嵌入式系统开发'],
      suggestedCourses: [
        { name: '智能硬件测试方法', reason: '覆盖硬件可靠性测试、自动化测试台架搭建等核心能力' },
      ],
    },
    {
      id: 'ai-j2',
      name: '工业视觉算法工程师',
      category: '人工智能',
      matchRate: 62,
      salaryRange: '15-28万/年',
      reason: 'AI边缘计算实训与嵌入式课程群为工业视觉部署提供了完整技能链',
      relatedCourses: ['AI边缘计算实训', '机器学习与智能算法', 'Python与数据分析'],
      suggestedCourses: [
        { name: '工业视觉系统设计', reason: '补充光源选型、相机标定、缺陷检测算法等工业视觉专用能力' },
        { name: '深度学习模型优化', reason: '强化模型量化、剪枝、蒸馏等部署优化技术' },
      ],
    },
    {
      id: 'ai-j3',
      name: '电子工艺工程师',
      category: '硬件设计',
      matchRate: 74,
      salaryRange: '7-12万/年',
      reason: 'PCB设计、生产工艺、模拟电子三门课程直接对标该岗位核心能力要求',
      relatedCourses: ['PCB设计与制作', '电子产品生产工艺', '模拟电子技术'],
      suggestedCourses: [
        { name: '先进封装与工艺管控', reason: '覆盖SiP封装、工艺FMEA、良率提升等进阶工艺能力' },
      ],
    },
    {
      id: 'ai-j4',
      name: '自动化测试开发工程师',
      category: '技术开发',
      matchRate: 58,
      salaryRange: '10-18万/年',
      reason: 'C语言与Python双语言基础，结合测试课程，可快速胜任自动化测试脚本开发',
      relatedCourses: ['C语言程序设计', 'Python与数据分析', '传感器与检测技术'],
      suggestedCourses: [
        { name: '自动化测试框架开发', reason: '补充TestStand、Robot Framework等自动化测试框架实操能力' },
      ],
    },
    {
      id: 'ai-j5',
      name: '信创适配工程师',
      category: '技术开发',
      matchRate: 70,
      salaryRange: '10-20万/年',
      reason: '嵌入式Linux、C/C++编程、硬件驱动开发等课程能力与信创国产化软硬件适配高度契合，国产替代政策持续驱动岗位需求增长',
      relatedCourses: ['嵌入式系统开发', 'C语言程序设计', '单片机应用技术'],
      suggestedCourses: [
        { name: '国产操作系统与芯片适配', reason: '覆盖麒麟/统信OS、飞腾/鲲鹏/龙芯芯片驱动适配及兼容性测试' },
        { name: '信创软件迁移与测试', reason: '补充国产数据库、中间件迁移适配及信创环境功能验证能力' },
      ],
    },
    {
      id: 'ai-j6',
      name: '智能体开发工程师',
      category: '人工智能',
      matchRate: 65,
      salaryRange: '18-35万/年',
      reason: 'Python编程、AI算法、嵌入式系统等课程为构建AI Agent（智能体）应用提供了编程与模型调用基础，大模型智能体是当前AI落地最热门方向之一',
      relatedCourses: ['Python与数据分析', '机器学习与智能算法', 'AI边缘计算实训'],
      suggestedCourses: [
        { name: '大模型应用与智能体开发', reason: '覆盖Prompt工程、RAG检索增强生成、Agent框架（LangChain/Claude SDK）、工具调用与多智能体编排等核心能力' },
        { name: 'API开发与云服务集成', reason: '补充RESTful API设计、云函数部署、向量数据库使用等智能体工程化落地技能' },
      ],
    },
  ],
}

/** 岗位库：所有可选岗位（含已分配和未分配的） */
export const jobCatalog: JobMatch[] = [
  // 已有的8个岗位会从 jobMatchMap 合并
  // 以下为额外可选岗位
  {
    id: 'jc1',
    name: '单片机开发工程师',
    category: '技术开发',
    matchRate: 86,
    salaryRange: '7-12万/年',
    demand: '高',
    skills: ['STM32', '51单片机', 'Keil开发', '外设驱动'],
    profile: { education: '大专及以上', experience: '0-2年', level: '初级岗位', demandCount: 19200, careerPath: '单片机工程师 → 嵌入式工程师 → 系统架构师', tasks: ['编写单片机程序', '调试外设接口', '硬件联调'], tools: ['Keil MDK', 'STM32CubeIDE', '示波器'], skills: ['STM32开发', 'C语言编程', '外设驱动'], qualities: ['逻辑思维', '动手能力', '细心'] },
  },
  {
    id: 'jc2',
    name: '电气工程师',
    category: '硬件设计',
    matchRate: 74,
    salaryRange: '8-14万/年',
    demand: '中',
    skills: ['电气设计', 'PLC编程', '电气安全', 'CAD制图'],
    profile: { education: '大专及以上', experience: '1-3年', level: '初级岗位', demandCount: 22000, careerPath: '电气工程师 → 高级电气工程师 → 电气主管', tasks: ['电气方案设计', 'PLC程序编写', '电气调试'], tools: ['AutoCAD', 'EPLAN', 'PLC编程器'], skills: ['电气设计', 'PLC编程', '电气安全规范'], qualities: ['安全意识', '责任心', '规范意识'] },
  },
  {
    id: 'jc3',
    name: '通信工程师',
    category: '技术开发',
    matchRate: 70,
    salaryRange: '8-16万/年',
    demand: '中',
    skills: ['通信协议', '射频设计', '网络规划', '信号处理'],
    profile: { education: '本科及以上', experience: '1-3年', level: '中级岗位', demandCount: 14500, careerPath: '通信工程师 → 高级通信工程师 → 通信架构师', tasks: ['通信系统设计', '协议调试', '网络规划优化'], tools: ['频谱分析仪', 'Wireshark', '仿真软件'], skills: ['通信协议', '射频调试', '网络优化'], qualities: ['分析能力', '英文能力', '学习能力'] },
  },
  {
    id: 'jc4',
    name: '技术支持工程师',
    category: '运维服务',
    matchRate: 76,
    salaryRange: '6-10万/年',
    demand: '高',
    skills: ['技术支持', '问题排查', '客户沟通', '文档编写'],
    profile: { education: '大专及以上', experience: '0-2年', level: '初级岗位', demandCount: 28000, careerPath: '技术支持 → 高级技术支持 → 技术支持经理', tasks: ['客户技术问题响应', '故障分析与解决', '技术文档编写'], tools: ['工单系统', '远程工具', 'Office'], skills: ['故障排查', '技术讲解', '文档编写'], qualities: ['服务意识', '耐心', '沟通能力'] },
  },
  {
    id: 'jc5',
    name: '自动化测试工程师',
    category: '质量检测',
    matchRate: 72,
    salaryRange: '8-15万/年',
    demand: '中',
    skills: ['自动化框架', 'Python脚本', 'LabVIEW', '测试方案'],
    profile: { education: '大专及以上', experience: '1-3年', level: '初级岗位', demandCount: 11000, careerPath: '自动化测试工程师 → 测试架构师 → 质量总监', tasks: ['搭建自动化测试平台', '编写测试脚本', '分析测试数据'], tools: ['LabVIEW', 'Python', 'TestStand', 'Jenkins'], skills: ['自动化脚本', '测试方案设计', '数据分析'], qualities: ['编程能力', '逻辑思维', '质量意识'] },
  },
  {
    id: 'jc6',
    name: '智能制造工程师',
    category: '系统集成',
    matchRate: 65,
    salaryRange: '9-16万/年',
    demand: '中',
    skills: ['MES系统', '工业机器人', '产线自动化', '工艺优化'],
    profile: { education: '本科及以上', experience: '2-5年', level: '中级岗位', demandCount: 9500, careerPath: '智能制造工程师 → 高级制造工程师 → 制造总监', tasks: ['产线自动化方案设计', 'MES系统实施', '工艺改善'], tools: ['MES系统', 'PLC', '工业机器人示教器'], skills: ['产线规划', 'MES配置', '工艺优化'], qualities: ['系统思维', '工程实践', '改善意识'] },
  },
  {
    id: 'jc7',
    name: '售前技术工程师',
    category: '产品管理',
    matchRate: 60,
    salaryRange: '8-15万/年',
    demand: '中',
    skills: ['方案设计', '技术演示', '客户需求', '招投标'],
    profile: { education: '大专及以上', experience: '1-3年', level: '中级岗位', demandCount: 7800, careerPath: '售前工程师 → 售前总监 → 解决方案VP', tasks: ['技术方案编写', '客户需求调研', '招投标支持'], tools: ['PowerPoint', 'Visio', 'Office'], skills: ['方案设计', '技术演示', '客户沟通'], qualities: ['表达能力', '商业敏感', '学习能力'] },
  },
  {
    id: 'jc8',
    name: '机器视觉工程师',
    category: '人工智能',
    matchRate: 62,
    salaryRange: '10-20万/年',
    demand: '高',
    skills: ['OpenCV', '图像处理', '深度学习', '缺陷检测'],
    profile: { education: '本科及以上', experience: '1-3年', level: '中级岗位', demandCount: 13000, careerPath: '视觉工程师 → 高级视觉工程师 → 算法总监', tasks: ['视觉算法开发', '缺陷检测系统搭建', '模型训练部署'], tools: ['OpenCV', 'PyTorch', 'Halcon', 'Python'], skills: ['图像处理', '深度学习', '模型部署'], qualities: ['数学基础', '创新思维', '持续学习'] },
  },
]

/** 已创建课程的 ID 集合（模拟状态，部分课程预设为已创建） */
export const createdCourseIds = ref(new Set([
  'c1', 'c2', 'c3', 'c5', 'c6', 'c8', 'c10', 'c13',
]))

/** 待定课程（AI 推荐岗位建议新增的课程） */
export const pendingCourses = ref<Course[]>([])

export const aiInsights = [
  '**嵌入式软件工程师**岗位匹配度最高（92%），是电子信息工程技术专业最对口的核心岗位，建议作为人才培养方案的主要对标岗位',
  '**PCB设计工程师**和**电子产品测试工程师**需求量大且稳定增长，高职可重点培养**硬件设计与测试**方向',
  '建议专业群培养重心向**嵌入式开发**和**PCB设计**方向倾斜，对接技术服务层岗位需求',
  '**AI边缘计算工程师**是最适合高职毕业生的新兴岗位（大专可，**12-22万/年**），需求量**8,600个**且持续增长',
]
