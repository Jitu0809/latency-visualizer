"use client";

import { configureStore } from "@reduxjs/toolkit";
import userLocationReducer from "./slices/userLocationSlice";
import latencyReducer from "./slices/latencySlice";

export const store = configureStore({
  reducer: {
    userLocation: userLocationReducer,
    latency: latencyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
