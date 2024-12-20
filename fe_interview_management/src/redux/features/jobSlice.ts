import { toastOption } from "@/configs/notification.config";
import { LoadingStatus } from "@/enums/enum";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ErrorResponse } from "@/vite-env";
import jobApi from "@/api/jobApi.ts";
import { Benefit, IJob, Skill } from "@/interfaces/job.interface.ts";
import skillApi from "@/api/skillApi.ts";

export const getJobs = createAsyncThunk(
  "jobs/getJobs",
  async (param: any | undefined | null, { rejectWithValue }) => {
    try {
      const response = await jobApi.getJobs(param);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await jobApi.updateJob(data.payload, data.id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (ids: any, { rejectWithValue }) => {
    try {
      const response = await jobApi.deleteJob(ids);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSkills = createAsyncThunk(
  "jobs/getSkills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await skillApi.getSkills();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await jobApi.createJob(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface JobState {
  jobs: IJob[];
  skills: Skill[];
  benefits: Benefit[];
  error: ErrorResponse | null;
  loading: LoadingStatus;
}

const initialState: JobState = {
  jobs: [],
  skills: [],
  benefits: [],
  error: null,
  loading: LoadingStatus.Pending,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getJobs.fulfilled, (state, action) => {
        if (action.payload == null) return;
        state.jobs = action.payload.results;
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        if (action.payload == null) return;
        state.skills = action.payload.results;
      })
      .addCase(createJob.fulfilled, () => {
        toast("Create job successfully");
      })
      .addCase(updateJob.fulfilled, () => {
        toast("Update job successfully");
      })
      .addCase(deleteJob.fulfilled, () => {
        toast("Delete job successfully");
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("jobs/") && action.type.includes("/rejected"),
        (state, action) => {
          state.error = {
            message: action.payload?.message ?? action.error.message,
            errorCode: action.payload?.errorCode ?? action.error.code,
          };
          state.loading = LoadingStatus.Rejected;
          toast.error(action.payload?.response.data.message ?? action.error.message, toastOption);
        }
      )
      .addMatcher(
        (action) => action.type.includes("fulfilled"),
        (state, _) => {
          state.error = null;
          state.loading = LoadingStatus.Fulfilled;
        }
      );
  },
});
export default jobSlice.reducer;
