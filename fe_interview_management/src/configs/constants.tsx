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
    { value: 'HR Manager', label: 'HR Manager' },
    { value: 'Recruitment Specialist', label: 'Recruitment Specialist' },
    { value: 'Training Specialist', label: 'Training Specialist' },
    { value: 'Administrative Specialist', label: 'Administrative Specialist' }
  ],
  [UserDepartment.AF]: [
    { value: 'Chief Accountant', label: 'Chief Accountant' },
    { value: 'Accountant Specialist', label: 'Accountant Specialist' },
    { value: 'Financial Specialist', label: 'Financial Specialist' },
    { value: 'Cashier', label: 'Cashier' },
    { value: 'Legal Manager', label: 'Legal Manager' },
    { value: 'Contract Specialist', label: 'Contract Specialist' }
  ],
  [UserDepartment.IT]: [
    { value: 'IT Manager', label: 'IT Manager' },
    { value: 'Software Engineer', label: 'Software Engineer' },
    { value: 'System Engineer', label: 'System Engineer' },
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Fullstack Developer', label: 'Fullstack Developer' },
    { value: 'Tester', label: 'Tester' },
    { value: 'Quality Inspector', label: 'Quality Inspector' }
  ],
  [UserDepartment.Marketing]: [
    { value: 'Marketing Manager', label: 'Marketing Manager' },
    { value: 'Sales Executive', label: 'Sales Executive' },
    { value: 'Business Executive', label: 'Business Executive' },
    { value: 'Content Marketing', label: 'Content Marketing' },
    { value: 'Content Creator', label: 'Content Creator' }
  ],
  [UserDepartment.Purchasing]: [
    { value: 'Purchasing Manager', label: 'Purchasing Manager' },
    { value: 'Sourcing Specialist', label: 'Sourcing Specialist' },
    { value: 'Warehouse Staff', label: 'Warehouse Staff' },
    { value: 'Supply Chain Specialist', label: 'Supply Chain Specialist' }
  ],
  [UserDepartment.PR]: [
    { value: 'PR Manager', label: 'PR Manager' },
    { value: 'PR Executive', label: 'PR Executive' },
    { value: 'Media Specialist', label: 'Media Specialist' },
    { value: 'Event Specialist', label: 'Event Specialist' }
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
  // 'Open',
  'Cancelled interview',
  'Passed interview',
  'Approved offer',
]

export enum InterviewStatus {
  //   Open = 'Open',
  Invited = 'Invited',
  Passed = 'Passed',
  Failed = 'Failed',
  // Interviewed = 'Interviewed',
  Cancelled = 'Cancelled',
}

export enum OfferStatus {
  Waiting = 'Waiting for approval',
  Approved = 'Approved offer',
  Reject = 'Rejected offer',
  // Cancelled = 'Cancelled offer',
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
