import { IUser } from "@/interfaces";
import Api from "./api";
import { ApiListResponse, ApiResponse } from "@/vite-env";

class UserApi {
  private baseUrl: string;
  constructor() {
    this.baseUrl = "/user";
  }

  async getUsers(param: any): Promise<ApiListResponse<IUser>> {
    return Api.GET<ApiListResponse<IUser>>(this.baseUrl, param);
  }

  async createUser(data: any): Promise<ApiResponse<IUser>> {
    return Api.POST<ApiResponse<IUser>>(this.baseUrl + "/create", data);
  }

  async updateUser(data: any, id: number): Promise<ApiResponse<IUser>> {
    return Api.PUT<ApiResponse<IUser>>(this.baseUrl + `/${id}`, data);
  }

  async deleteUser(id: number): Promise<ApiResponse<IUser>> {
    return Api.DELETE<ApiResponse<IUser>>(this.baseUrl + `/${id}`, {});
  }
}

export default new UserApi();
