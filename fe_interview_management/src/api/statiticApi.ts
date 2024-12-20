import { ApiListResponse, ApiResponse, Query } from "@/vite-env";
import Api from "./api";

class StatiticApi {
  private baseUrl: string;
  constructor() {
    this.baseUrl = "/statitic/";
  }

  async dashboard(): Promise<any> {
    return Api.GET<any>(this.baseUrl + "dashboard");
  }

  async candidateDistribution(): Promise<ApiResponse<any>> {
    return Api.GET<any>(this.baseUrl + "candidate-distribution");
  }

  async candidateStatus(params: Query): Promise<ApiListResponse<any>> {
    return Api.GET<any>(this.baseUrl + "candidate-status", params);
  }

  async jobStatitics(year: number): Promise<any> {
    return Api.GET<any>(this.baseUrl + `job/${year}`);
  }
}

export default new StatiticApi();
