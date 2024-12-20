import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { LoadingStatus } from "@/enums/enum.ts";
import { toastOption } from "@/configs/notification.config.ts";
import requestApi from "@/api/requestApi.ts";

export const createRequest = createAsyncThunk(
    "requests/createRequest",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await requestApi.createRequest(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getRequests = createAsyncThunk(
    "requests/getRequests",
    async (param: any | undefined | null, { rejectWithValue }) => {
        try {
            const response = await requestApi.getRequests(param);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateRequest = createAsyncThunk(
    "requests/updateRequest",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await requestApi.updateRequest(
                data.payload,
                data.id
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteRequest = createAsyncThunk(
    "requests/deleteRequest",
    async (ids: any, { rejectWithValue }) => {
        try {
            const response = await requestApi.deleteRequest(ids);
            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export interface RequestState {
    requests: any[];
    request: any;
    loading: LoadingStatus;
    error: any;
}

const initialState: RequestState = {
    requests: [],
    request: {},
    loading: LoadingStatus.Pending,
    error: null,
};

const requestSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(createRequest.fulfilled, () => {
                toast.success("Create request successfully");
            })
            .addCase(updateRequest.fulfilled, () => {
                toast.success("Update request successfully");
            })
            .addCase(deleteRequest.fulfilled, () => {
                toast.success("Delete request successfully");
            })
            .addCase(getRequests.fulfilled, (state, action) => {
                state.requests = action.payload.results;
                state.metadata = action.payload.data.metadata;
            })
            .addMatcher(
                (action) =>
                    action.type.startsWith("requests/") &&
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

export default requestSlice.reducer;