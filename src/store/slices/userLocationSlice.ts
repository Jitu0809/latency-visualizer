import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const getUserLocation = createAsyncThunk('get-user-location', async (info, thunkAPI)=>{
    try {
        const res = await fetch("https://speed.cloudflare.com/meta");

        if (!res.ok) {
            return Response.json({ error: "Cloudflare fetch failed" }, { status: 500 });
        }

        const data = await res.json();
        return data; 
    } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 });
    }
})

interface UserLocationState {
  asOrganization: string | null;
  asn: number | null;
  city: string | null;
  clientIp: string | null;
  colo: string | null;
  country: string | null;
  hostname: string | null;
  httpProtocol: string | null;
  latitude: number | null;
  longitude: number | null;
  postalCode: string | null;
  region: string | null;
//   loading: boolean;
  error?: string | null;
}

const initialState: UserLocationState = {
  asOrganization: "Cogent Communications, LLC",
  asn: 133982,
  city: "New Delhi",
  clientIp: "205.254.175.238",
  colo: "DEL",
  country: "IN",
  hostname: "speed.cloudflare.com",
  httpProtocol: "HTTP/1.1",
  latitude: 28.62137,
  longitude: 77.21480,
  postalCode: "110001",
  region: "Delhi",
//   loading: true,
  error: null,
};

export const userLocationSlice = createSlice({
  name: "userLocation",
  initialState,
  reducers: {
    // setLoading(state, action: PayloadAction<boolean>) {
    //   state.loading = action.payload;
    // },
  },
  extraReducers: builder => {
    builder
    .addCase(getUserLocation.fulfilled, (state, action) => {
        state.asOrganization = action.payload.asOrganization;
        state.asn = action.payload.asn;
        state.city = action.payload.city;
        state.clientIp = action.payload.clientIp;
        state.colo = action.payload.colo;
        state.country = action.payload.country;
        state.hostname = action.payload.hostname;
        state.httpProtocol = action.payload.httpProtocol;
        state.latitude = Number(action.payload.latitude);
        state.longitude = Number(action.payload.longitude);
        state.postalCode = action.payload.postalCode;
        state.region = action.payload.region;
    })
  }
});

// export const { setUserLocation, setLoading } = userLocationSlice.actions;
export const { } = userLocationSlice.actions;
export default userLocationSlice.reducer;
