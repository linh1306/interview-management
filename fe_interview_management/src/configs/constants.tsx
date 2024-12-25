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
  Finance = 'Finance',
  Communication = 'Communication',
  Marketing = 'Marketing',
  Accounting = 'Accounting',
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
  [UserDepartment.IT]: [
    { value: 'backend_developer', label: 'Backend Developer' },
    { value: 'frontend_developer', label: 'Frontend Developer' },
    { value: 'fullstack_developer', label: 'Fullstack Developer' },
    { value: 'devops', label: 'DevOps' },
  ],
  [UserDepartment.HR]: [
    { value: 'hr_manager', label: 'HR Manager' },
    { value: 'recruiter', label: 'Recruiter' },
  ],
  [UserDepartment.Finance]: [
    { value: 'financial_analyst', label: 'Financial Analyst' },
    { value: 'accountant', label: 'Accountant' },
  ],
  [UserDepartment.Communication]: [
    { value: 'pr_manager', label: 'PR Manager' },
    { value: 'content_specialist', label: 'Content Specialist' },
  ],
  [UserDepartment.Marketing]: [
    { value: 'marketing_manager', label: 'Marketing Manager' },
    { value: 'seo_specialist', label: 'SEO Specialist' },
  ],
  [UserDepartment.Accounting]: [
    { value: 'auditor', label: 'Auditor' },
    { value: 'accounting_manager', label: 'Accounting Manager' },
  ],
};

export enum JobStatus {
  Closed = 'Closed',
  Open = 'Open',
  Draft = 'Draft',
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
  'In progress',
  'Open',
  'Cancelled interview',
  'Passed interview',
  'Approved offer',
]

export enum InterviewStatus {
  Open = 'Open',
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
  Trial2Months = 'Trial 2 months',
  Trainee = 'Trainee 3 months',
  OneYear = 'One Year',
  Three = 'Three years',
  Unlimited = 'Unlimited',
}
