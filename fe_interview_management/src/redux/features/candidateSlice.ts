import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { LoadingStatus } from "@/enums/enum.ts";
import { toastOption } from "@/configs/notification.config.ts";
import candidateApi from "@/api/candidateApi.ts";

export const createCandidate = createAsyncThunk(
  "candidates/createCandidate",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await candidateApi.createCandidate(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCandidates = createAsyncThunk(
  "candidates/getCandidates",
  async (param: any | undefined | null, { rejectWithValue }) => {
    try {
      const response = await candidateApi.getCandidates(param);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCandidate = createAsyncThunk(
  "candidates/updateCandidate",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await candidateApi.updateCandidate(
        data.payload,
        data.id
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  "candidates/deleteCandidate",
  async (ids: any, { rejectWithValue }) => {
    try {
      const response = await candidateApi.deleteCandidate(ids);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface CandidateState {
  candidates: any[];
  candidate: any;
  loading: LoadingStatus;
  error: any;
}

const initialState: CandidateState = {
  candidates: [],
  candidate: {},
  loading: LoadingStatus.Pending,
  error: null,
};

const jobSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createCandidate.fulfilled, () => {
        toast("Create candidate successfully");
      })
      .addCase(updateCandidate.fulfilled, () => {
        toast("Update candidate successfully");
      })
      .addCase(deleteCandidate.fulfilled, () => {
        toast("Delete candidate successfully");
      })
      .addCase(getCandidates.fulfilled, (state, action) => {
        state.candidates = action.payload.results;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("candidates/") &&
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
