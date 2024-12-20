import Api from "./api";
import {ApiListResponse, ApiResponse} from "@/vite-env";

class InterviewApi {
  private baseUrl: string;
  constructor() {
    this.baseUrl = "/interview-schedule";
  }

  async createInterview(data: any): Promise<ApiResponse<any>> {
    return Api.POST<ApiResponse<any>>(this.baseUrl, data);
  }

  async getInterviews(param): Promise<ApiListResponse<any>> {
    return Api.GET<ApiListResponse<any>>(this.baseUrl, param);
  }

  async updateInterview(data: any, id: number): Promise<ApiResponse<any>> {
    return Api.PATCH<ApiResponse<any>>(this.baseUrl + `/${id}`, data);
  }

}

export default new InterviewApi();
