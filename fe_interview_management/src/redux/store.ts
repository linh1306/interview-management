import { configureStore, combineReducers } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  Persistor,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import authSlice from "./features/authSlice";
import userSlice from "@/redux/features/userSlice.ts";
import jobSlice from "@/redux/features/jobSlice.ts";
import candidateSlice from "@/redux/features/candidateSlice.ts";
import interviewSlice from "@/redux/features/interviewSlice.ts";
import offerSlice from "@/redux/features/offerSlice.ts";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};
const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  job: jobSlice,
  candidate: candidateSlice,
  interview: interviewSlice,
  offer: offerSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<(typeof store)["getState"]>;
export type AppDispatch = (typeof store)["dispatch"];
export const persistor: Persistor = persistStore(store);
