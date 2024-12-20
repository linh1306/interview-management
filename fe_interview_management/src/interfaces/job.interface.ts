import {IUser} from "@/interfaces/auth.interface.ts";

export interface IJob {
  id: number;
  created_date: string;
  last_modified_date: string;
  deleted?: any;
  description: string;
  end_date: string;
  level: string[];
  title: string;
  salary_from: number;
  salary_to: number;
  start_date: string;
  working_address: string;
  status: string;
  skills: JobSkill[];
  benefit: string[];
  created_by: IUser;
  last_modified_by?: any;
}
export interface JobBenefit {
  id: number;
  created_date: string;
  last_modified_date: string;
  deleted?: any;
  benefit_name: string;
  benefit: Benefit;
}
export interface Benefit {
  id: number;
  created_date: string;
  last_modified_date: string;
  deleted?: any;
  name: string;
}
export interface JobSkill {
  id: number;
  created_date: string;
  last_modified_date: string;
  deleted?: any;
  skill: Skill;
}
export interface Skill {
  id: number;
  created_date: string;
  last_modified_date: string;
  deleted?: any;
  name: string;
}
