import { LoadingStatus } from "@/enums/enum";
import { IUser } from "@/interfaces";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ErrorResponse } from "@/vite-env";
import userApi from "@/api/userApi.ts";

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (param: any, { rejectWithValue }) => {
    try {
      const response = await userApi.getUsers(param);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await userApi.updateUser(data.payload, data.id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await userApi.deleteUser(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export interface UserState {
  users: IUser[];
  error: ErrorResponse | null;
  loading: LoadingStatus;
}

const initialState: UserState = {
  users: [],
  error: null,
  loading: LoadingStatus.Pending,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload.results;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.users.push(action.payload);
          toast("User created successfully", {
            position: "bottom-right",
            autoClose: 2000,
          });

        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload.id);
        toast("User deleted successfully", {
          position: "bottom-right",
          autoClose: 2000,
        });
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
          toast.error(state.error.message, {
            position: "bottom-right",
            autoClose: 3000,
          });

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
export default userSlice.reducer;
