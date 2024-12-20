import Api from "./api";
import {ApiListResponse} from "@/vite-env";
import {Skill} from "@/interfaces/job.interface.ts";

class SkillApi {
  private baseUrl: string;
  constructor() {
    this.baseUrl = "/skill";
  }

  async getSkills(): Promise<ApiListResponse<Skill>> {
    return Api.GET<ApiListResponse<Skill>>(this.baseUrl);
  }
}

export default new SkillApi();
