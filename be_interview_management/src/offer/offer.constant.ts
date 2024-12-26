export enum WorkingType {
  Trial2Months = 'Trial 2 months',
  Trainee = 'Trainee 3 months',
  OneYear = 'One Year',
  Three = 'Three years',
  Unlimited = 'Unlimited',
}

export enum OfferType {
  Fulltime = 'Full-time',
  Parttime = 'Part-time',
  Remote = 'Remote',
  Onsite = 'On-site',
  Hybrid = 'Hybrid'
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

export enum OfferPosition {
  Be = 'Backend Developer',
  Ba = 'Bussiness Analyst',
  // HR Department
  HrManager = 'HR Manager',
  RecruitmentSpecialist = 'Recruitment Specialist',
  TrainingSpecialist = 'Training Specialist',
  AdministrativeSpecialist = 'Administrative Specialist',

  // A&F Department
  ChiefAccountant = 'Chief Accountant',
  AccountantSpecialist = 'Accountant Specialist',
  FinancialSpecialist = 'Financial Specialist',
  Cashier = 'Cashier',
  LegalManager = 'Legal Manager',
  ContractSpecialist = 'Contract Specialist',

  // IT Department
  ItManager = 'IT Manager',
  SoftwareEngineer = 'Software Engineer',
  SystemEngineer = 'System Engineer',
  BackendDeveloper = 'Backend Developer',
  FrontendDeveloper = 'Frontend Developer',
  FullstackDeveloper = 'Fullstack Developer',
  Tester = 'Tester',
  QualityInspector = 'Quality Inspector',
  Devops = 'Devops',

  // Marketing Department
  MarketingManager = 'Marketing Manager',
  SalesExecutive = 'Sales Executive',
  BusinessExecutive = 'Business Executive',
  ContentMarketing = 'Content Marketing',
  ContentCreator = 'Content Creator',

  // Purchasing Department
  PurchasingManager = 'Purchasing Manager',
  SourcingSpecialist = 'Sourcing Specialist',
  WarehouseStaff = 'Warehouse Staff',
  SupplyChainSpecialist = 'Supply Chain Specialist',

  // PR Department
  PrManager = 'PR Manager',
  PrExecutive = 'PR Executive',
  MediaSpecialist = 'Media Specialist',
  EventSpecialist = 'Event Specialist',
}

export enum OfferStatus {
  Waiting = 'Waiting for approval',
  Approved = 'Approved offer',
  Reject = 'Rejected offer',
  Cancelled = 'Cancelled offer',
}
