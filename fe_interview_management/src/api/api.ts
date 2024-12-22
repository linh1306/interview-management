import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

class Api {
  private async AXIOS(): Promise<AxiosInstance> {
    let instance: AxiosInstance;

    const config = this.getConfig();
    instance = axios.create(config);

    instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (localStorage.getItem("token")) {
          config.headers["Authorization"] = `Bearer ${localStorage.getItem("token") ?? ""}`;
        }
        return config;
      },
      async (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      async (error) => {
        const originalRequest = error?.config;
        if (error?.response?.status === 401 && !originalRequest._retry) {
          // Kiểm tra mã trạng thái 401 (Unauthorized) và chưa thử lại request
          // Gửi yêu cầu refresh token để lấy token mới
          const newToken = "";
          if (newToken) {
            // Thử lại request ban đầu với token mới
            originalRequest._retry = true;
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }

  private getConfig() {
    return {
      baseURL: "http://103.56.158.135:8086/api/v1/",
      headers: {
        // ContentType: "application/json",
        // // ContentType: 'multipart/form-data',
        // Accept: "application/json",
      },
    };
  }

  public getBaseUrl() {
    return this.getConfig().baseURL;
  }

  public async GET<T>(url: string, params?: any): Promise<T> {
    const api = await this.AXIOS();
    return api.get(url, { params: params });
  }

  public async POST<T>(url: string, body: any, params?: any): Promise<T> {
    const api = await this.AXIOS();
    return api.post(url, body, { params: params });
  }

  public async PUT<T>(url: string, body: any, params?: any): Promise<T> {
    const api = await this.AXIOS();
    return api.put(url, body, { params: params });
  }

  public async PATCH<T>(url: string, body: any, params?: any): Promise<T> {
    const api = await this.AXIOS();
    return api.patch(url, body, { params: params });
  }

  public async DELETE<T>(url: string, body: any, params?: any): Promise<T> {
    const api = await this.AXIOS();
    return api.delete(url, { params: params, data: body });
  }
}

export default new Api();
