export enum UserStatus {
  Active = 'Active',
  Deactivated = 'Deactivated',
  Pending = 'Pending',
}
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum UserRole {
  Interviewer = 'Interviewer',
  HR = 'HR',
  Manager = 'Manager',
  Admin = 'Admin',
}
export enum UserDepartment {
  IT = 'IT',
  HR = 'HR',
  AF = 'AF', // Thêm AF thay cho Finance
  Marketing = 'Marketing',
  Purchasing = 'Purchasing', // Thêm Purchasing thay cho Communication 
  PR = 'PR' // Thêm PR thay cho Accounting
}
export const OfferPosition = [
  'Backend Developer',
  'Bussiness Analyst',
  'Tester',
  'HR',
  'Project Manager',
  'Frontend Developer',
  'Fullstack Developer',
  'Devops',
]

export const OfferPositionByDepartment: Record<UserDepartment, { value: string; label: string }[]> = {
  [UserDepartment.HR]: [
    { value: 'hr_manager', label: 'HR Manager' },
    { value: 'recruitment_specialist', label: 'Recruitment Specialist' },
    { value: 'training_specialist', label: 'Training Specialist' },
    { value: 'administrative_specialist', label: 'Administrative Specialist' }
  ],
  [UserDepartment.AF]: [
    { value: 'chief_accountant', label: 'Chief Accountant' },
    { value: 'accountant_specialist', label: 'Accountant Specialist' },
    { value: 'financial_specialist', label: 'Financial Specialist' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'legal_manager', label: 'Legal Manager' },
    { value: 'contract_specialist', label: 'Contract Specialist' }
  ],
  [UserDepartment.IT]: [
    { value: 'it_manager', label: 'IT Manager' },
    { value: 'software_engineer', label: 'Software Engineer' },
    { value: 'system_engineer', label: 'System Engineer' },
    { value: 'backend_developer', label: 'Backend Developer' },
    { value: 'frontend_developer', label: 'Frontend Developer' },
    { value: 'fullstack_developer', label: 'Fullstack Developer' },
    { value: 'tester', label: 'Tester' },
    { value: 'quality_inspector', label: 'Quality Inspector' }
  ],
  [UserDepartment.Marketing]: [
    { value: 'marketing_manager', label: 'Marketing Manager' },
    { value: 'sales_executive', label: 'Sales Executive' },
    { value: 'business_executive', label: 'Business Executive' },
    { value: 'content_marketing', label: 'Content Marketing' },
    { value: 'content_creator', label: 'Content Creator' }
  ],
  [UserDepartment.Purchasing]: [
    { value: 'purchasing_manager', label: 'Purchasing Manager' },
    { value: 'sourcing_specialist', label: 'Sourcing Specialist' },
    { value: 'warehouse_staff', label: 'Warehouse Staff' },
    { value: 'supply_chain_specialist', label: 'Supply Chain Specialist' }
  ],
  [UserDepartment.PR]: [
    { value: 'pr_manager', label: 'PR Manager' },
    { value: 'pr_executive', label: 'PR Executive' },
    { value: 'media_specialist', label: 'Media Specialist' },
    { value: 'event_specialist', label: 'Event Specialist' }
  ]
};

export enum JobStatus {
  Closed = 'Closed',
  Open = 'Open',
}

export enum JobLevel {
  Fresher = 'Fresher',
  Junior = 'Junior',
  Senior = 'Senior',
  Leader = 'Leader',
  Trainer = 'Trainer',
  Mentor = 'Mentor',
}

export const HEADER_TABS = [
  {
    id: 0,
    name: 'Home',
    link: '/',
  },
  {
    id: 1,
    name: 'Job',
    link: '/job',
  },
  {
    id: 2,
    name: 'Candidate',
    link: '/candidate',
  },
  {
    id: 3,
    name: 'Interview',
    link: '/interview',
  },
  {
    id: 4,
    name: 'Report',
    link: '/report',
  },
  {
    id: 5,
    name: 'Setting',
    link: '/setting',
  },
];



export const HighestLevelCandidate = [
  'High School',
  `Bachelor's Degree`,
  'Master Degree',
  'PhD',
]

export const CandidateStatus = [
  'Banned',
  'Waiting for interview',
  'Open',
  'Cancelled interview',
  'Passed interview',
  'Approved offer',
]

export enum InterviewStatus {
  //   Open = 'Open',
  Invited = 'Invited',
  Interviewed = 'Interviewed',
  Cancelled = 'Cancelled',
}

export enum OfferStatus {
  Waiting = 'Waiting for approval',
  Approved = 'Approved offer',
  Reject = 'Rejected offer',
  Cancelled = 'Cancelled offer',
}

export enum OfferLevel {
  Fresher1 = 'Fresher 1',
  Junior1 = 'Junior 2.1',
  Junior2 = 'Junior 2.2',
  Senior1 = 'Senior 3.1',
  Senior2 = 'Senior 3.2',
  Delivery = 'Delivery',
  Leader = 'Leader',
  Manager = 'Manager',
  ViceHead = 'Vice Head',
}

export enum OfferType {
  Fulltime = 'Full-time',
  Parttime = 'Part-time',
  Remote = 'Remote',
  Onsite = 'On-site',
  Hybrid = 'Hybrid'  // Thêm tùy chọn Hybrid vì đây cũng là hình thức làm việc phổ biến
}
