import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { LoadingStatus } from "@/enums/enum.ts";
import { toastOption } from "@/configs/notification.config.ts";
import interviewApi from "@/api/interviewApi.ts";

export const createInterview = createAsyncThunk(
  "interview/createInterview",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await interviewApi.createInterview(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getInterviews = createAsyncThunk(
  "interview/getInterviews",
  async (param: any | undefined | null, { rejectWithValue }) => {
    try {
      const response = await interviewApi.getInterviews(param);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateInterview = createAsyncThunk(
  "interview/updateInterview",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await interviewApi.updateInterview(
        data.payload,
        data.id
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface InterviewState {
  interviews: any[];
  interview: any;
  loading: LoadingStatus;
  error: any;
}

const initialState: InterviewState = {
  interviews: [],
  interview: {},
  loading: LoadingStatus.Pending,
  error: null,
};

const jobSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createInterview.fulfilled, (state, action) => {
        toast("Create interview successfully");
      })
      .addCase(getInterviews.fulfilled, (state, action) => {
        if (action.payload == null) return;
        state.interviews = action.payload.results;
      })
      .addCase(updateInterview.fulfilled, () => {
        toast("Update interview successfully");
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("interview/") &&
          action.type.includes("/rejected"),
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
