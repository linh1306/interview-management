import Api from "./api";
import { ApiListResponse, ApiResponse } from "@/vite-env";

class CandidateApi {
  private baseUrl: string;
  constructor() {
    this.baseUrl = "/candidate";
  }

  async createCandidate(data: any): Promise<ApiResponse<any>> {
    return Api.POST<ApiResponse<any>>(this.baseUrl, data);
  }

  async getCandidates(param: any): Promise<ApiListResponse<any>> {
    return Api.GET<ApiListResponse<any>>(this.baseUrl, param);
  }

  async updateCandidate(data: any, id: number): Promise<ApiResponse<any>> {
    return Api.PATCH<ApiResponse<any>>(this.baseUrl + `/${id}`, data);
  }

  async deleteCandidate(id: any): Promise<ApiListResponse<any>> {
    return Api.DELETE<ApiListResponse<any>>(this.baseUrl + `/${id}`, undefined);
  }
}

export default new CandidateApi();
