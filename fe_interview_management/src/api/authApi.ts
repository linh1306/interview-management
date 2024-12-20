import { ILoginData, IRegisterData, IToken, IUser } from "@/interfaces";
import Api from "./api";
import {ApiResponse} from "@/vite-env";

class AuthApi {
  private baseUrl: string;
  constructor() {
    this.baseUrl = "/auth";
  }

  async login(
    loginInfomation: ILoginData
  ): Promise<ApiResponse<IUser & IToken>> {
    return Api.POST<ApiResponse<IUser & IToken>>(
      this.baseUrl + "/login",
      // @ts-ignore
      new URLSearchParams(loginInfomation)
    );
  }

  async register(singupInfomation: IRegisterData): Promise<ApiResponse<any>> {
    return Api.POST<ApiResponse<any>>(
      this.baseUrl + "/register",
      singupInfomation
    );
  }

  async refreshToken(): Promise<ApiResponse<IToken>> {
    return Api.POST<ApiResponse<IToken>>(this.baseUrl + "/refresh", {});
  }

  async logout() {
    return Api.POST(this.baseUrl + "/logout", {});
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return Api.POST(this.baseUrl + "/fogot-password", { email });
  }

  async getMe(): Promise<ApiResponse<any>> {
    return Api.GET<ApiResponse<any>>(this.baseUrl + "/me");
  }

  async updatePassword(data: any): Promise<ApiResponse<any>> {
    return Api.PATCH<ApiResponse<any>>(this.baseUrl + "/update-password", data);
  }
}

export default new AuthApi();
