import { toastOption } from "@/configs/notification.config";
import { LoadingStatus } from "@/enums/enum";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ErrorResponse } from "@/vite-env";
import offerApi from "@/api/offerApi.ts";

export const getOffers = createAsyncThunk(
  "offer/getOffers",
  async (param: any | undefined | null, { rejectWithValue }) => {
    try {
      const response = await offerApi.getOffers(param);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createOffer = createAsyncThunk(
  "offer/createOffer",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await offerApi.createOffer(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateOffer = createAsyncThunk(
  "offer/updateOffer",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await offerApi.updateOffer(data.payload, data.id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteOffer = createAsyncThunk(
  "offer/deleteOffer",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await offerApi.deleteOffer(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export interface OfferState {
  offers: any[];
  error: ErrorResponse | null;
  loading: LoadingStatus;
}

const initialState: OfferState = {
  offers: [],
  error: null,
  loading: LoadingStatus.Pending,
};

const jobSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getOffers.fulfilled, (state, action) => {
        if (action.payload == null) return;
        state.offers = action.payload.results;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        toast("Create offer successfully");
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        toast("Update offer successfully");
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        toast("Delete offer successfully"); // Thêm toast thông báo khi xóa thành công
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("offer/") && action.type.includes("/rejected"),
        (state, action) => {
          state.error = {
            message: action.payload?.message ?? action.error.message,
            errorCode: action.payload?.errorCode ?? action.error.code,
          };
          state.loading = LoadingStatus.Rejected;
          toast.error(state.error.message, toastOption);
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
