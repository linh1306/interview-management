import authApi from "@/api/authApi";
import { toastOption } from "@/configs/notification.config";
import { LoadingStatus } from "@/enums/enum";
import { ILoginData, IRegisterData, IUser } from "@/interfaces";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ErrorResponse } from "@/vite-env";

export const requestLogin = createAsyncThunk(
  "users/login",
  async (input: ILoginData, _) => {
    const response = await authApi.login(input);
    if (!response.success)
      throw { message: response.message, errorCode: response.errorCode };
    return response.data;
  }
);

export const requestRegister = createAsyncThunk(
  "users/register",
  async (input: IRegisterData, _) => {
    const response = await authApi.register(input);
    if (!response.success)
      throw { message: response.message, errorCode: response.errorCode };
    return response.data;
  }
);

export const requestLogout = createAsyncThunk("users/logout", async () => {
  await authApi.logout();
});

export const requestForgotPassword = createAsyncThunk(
  "users/forgotPassword",
  async (email: string, _) => {
    const response = await authApi.forgotPassword(email);
    if (!response.success)
      throw { message: response.message, errorCode: response.errorCode };
    return response.data;
  }
);

export const getMe = createAsyncThunk("users/getMe", async () => {
  const response = await authApi.getMe();
  return response.data;
});

export const updatePassword = createAsyncThunk(
  "users/updatePassword",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await authApi.updatePassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface AuthState {
  currentUser: IUser | null | undefined;
  user: any;
  error: ErrorResponse | null;
  loading: LoadingStatus;
}

const initialState: AuthState = {
  currentUser: null,
  error: null,
  user: null,
  loading: LoadingStatus.Pending,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(requestLogin.fulfilled, (state, action) => {
        if (action.payload == null) return;
        state.currentUser = action.payload;
      })
      .addCase(requestForgotPassword.fulfilled, (_, action) => {
        if (action.payload == null) return;
        toast("Please check your email to reset password");
      })
      .addCase(getMe.fulfilled, (state, action) => {
        if (action.payload == null) return;
        state.user = action.payload;
      })
      .addCase(updatePassword.fulfilled, () => {
        toast("Update password successfully");
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("users/") && action.type.includes("/rejected"),
        (state, action) => {
          console.log(action);

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
export default authSlice.reducer;
