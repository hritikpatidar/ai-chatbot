import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUserService,
  logoutService,
  verifyOtpService,
} from "../../../service/Auth/AuthServices";

const initialState = {
  loading: false,
  token: "",
  refreshToken: "",
  profileDetails: {},
  notificationList: [],
  error: "",
};

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (payload) => {
  const response = await verifyOtpService(payload);
  return response.data || {};
});

export const loginUser = createAsyncThunk("auth/loginUser", async (payload) => {
  const response = await loginUserService(payload);
  return response.data || {};
});

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await logoutService(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Logout failed" },
      );
    }
  },
);

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutSuccess: (state) => {
      state.loading = false;
      state.token = "";
      state.refreshToken = "";
      state.profileDetails = {};
      state.notificationList = [];
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifyOtp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action?.payload?.accessToken || "";
      state.refreshToken = action?.payload?.refreshToken || "";
      state.profileDetails = action?.payload?.user || {};
      state.error = "";
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.token = "";
      state.profileDetails = {};
      state.error = action.payload;
    });
    //------------------------------------------------------------------
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action?.payload?.accessToken || "";
      state.refreshToken = action?.payload?.refreshToken || "";
      state.profileDetails = action?.payload?.user || {};
      state.error = "";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.token = "";
      state.profileDetails = {};
      state.error = action.payload;
    });
    //------------------------------------------------------------------
  },
});

export const { logoutSuccess } = AuthSlice.actions;
export default AuthSlice.reducer;
