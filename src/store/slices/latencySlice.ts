import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export const fetchAllServersData = createAsyncThunk(
  "latency/fetchAll",
  async () => {
    const res = await fetch("/api/latency", { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to load latency");

    const data = await res.json();
    
    return data;
  }
);

/* ------------------------------------------------------------------
   REDUX TYPES
------------------------------------------------------------------- */
export interface LatencyEntry {
  name: string;
  host: string;
  latency_ms: number | null;
  provider: "AWS" | "GCP" | "Azure";
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
  };
}

interface LatencyState {
  data: LatencyEntry[];
  loading: boolean;
}

const initialState: LatencyState = {
  data: [],
  loading: false,
};

/* ------------------------------------------------------------------
   SLICE
------------------------------------------------------------------- */
export const latencySlice = createSlice({
  name: "latency",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllServersData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllServersData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllServersData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default latencySlice.reducer;
