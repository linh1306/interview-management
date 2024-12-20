import { Moment } from "moment";

export interface IUser {
  username: string;
  full_name: string;
  address: string;
  phone: string;
  email: string;
  avatar: string;
  role: string;
  accessToken?: string;
  dob?: Date | Moment;
  status: string;
  gender: string;
  created_at: Date;
  department: string;
  id: number;
  note: string;
}

export interface IToken {
  accessToken?: string;
  refreshToken?: string;
}

export interface ILoginData {
  email?: string;
  password: string;
}

export interface IRegisterData {
  name?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  phone?: string;
}

export interface IForgetPassword {
  email?: string;
  phone?: string;
  username?: string;
}

export interface IOTP {
  otp: number;
}

export const ROLE = ["Interviewer", "HR", "Admin", "Manager"];
