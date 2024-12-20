import Api from "./api";
import { ApiListResponse, ApiResponse } from "@/vite-env";

class RequestApi {
    private baseUrl: string;
    constructor() {
        this.baseUrl = "/request";
    }

    async createRequest(data: any): Promise<ApiResponse<any>> {
        return Api.POST<ApiResponse<any>>(this.baseUrl, data);
    }

    async getRequests(param: any): Promise<ApiListResponse<any>> {
        return Api.GET<ApiListResponse<any>>(this.baseUrl, param);
    }

    async updateRequest(data: any, id: number): Promise<ApiResponse<any>> {
        return Api.PATCH<ApiResponse<any>>(this.baseUrl + `/${id}`, data);
    }

    async deleteRequest(id: any): Promise<ApiListResponse<any>> {
        return Api.DELETE<ApiListResponse<any>>(this.baseUrl + `/${id}`, undefined);
    }
}

export default new RequestApi();