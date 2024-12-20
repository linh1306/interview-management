import Api from "./api";
import {ApiListResponse, ApiResponse} from "@/vite-env";
import {IJob} from "@/interfaces/job.interface.ts";

class JobApi {
  private baseUrl: string;
  constructor() {
    this.baseUrl = "/job";
  }

  async getJobs(param): Promise<ApiListResponse<IJob>> {
    return Api.GET<ApiListResponse<IJob>>(this.baseUrl, param);
  }

  async createJob(data: any): Promise<ApiResponse<IJob>> {
    return Api.POST<ApiResponse<IJob>>(this.baseUrl, data);
  }

  async updateJob(data: any, id: number): Promise<ApiListResponse<IJob>> {
    return Api.PATCH<ApiListResponse<IJob>>(this.baseUrl + `/${id}`, data);
  }

  async deleteJob(ids: any): Promise<ApiListResponse<IJob>> {
    return Api.DELETE<ApiListResponse<IJob>>(this.baseUrl, ids);
  }
}

export default new JobApi();
