import Api from "./api";
import { ApiListResponse, ApiResponse } from "@/vite-env";
import { IJob } from "@/interfaces/job.interface.ts";

class OfferApi {
  private baseUrl: string;
  constructor() {
    this.baseUrl = "/offer";
  }

  async getOffers(param): Promise<ApiListResponse<IJob>> {
    return Api.GET<ApiListResponse<IJob>>(this.baseUrl, param);
  }

  async createOffer(data: any): Promise<ApiResponse<IJob>> {
    return Api.POST<ApiResponse<IJob>>(this.baseUrl, data);
  }

  async updateOffer(data: any, id: number): Promise<ApiListResponse<IJob>> {
    return Api.PATCH<ApiListResponse<IJob>>(this.baseUrl + `/${id}`, data);
  }
  async deleteOffer(id: number): Promise<ApiListResponse<IJob>> {
    return Api.DELETE<ApiListResponse<IJob>>(`${this.baseUrl}/${id}`);
  }
}

export default new OfferApi();
