import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUserService,
  logoutService,
  verifyOtpService,
} from "../../../service/Auth/AuthServices";
import { profileUpdateService } from "../../../service/Profile/ProfileServices";

const initialState = {
  loading: false,
  token: "",
  refreshToken: "",
  profileDetails: {},
  notificationList: [],
  isProfileModalOpen: false,
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

export const profileUpdate = createAsyncThunk(
  "auth/profileUpdate",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await profileUpdateService(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Profile update failed",
        },
      );
    }
  },
);

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
    setIsProfileModalOpen: (state, action) => {
      state.isProfileModalOpen = action?.payload;
    },

    updateAccessToken: (state, action) => {
      state.token = action.payload;
    },

    logoutSuccess: (state) => {
      state.loading = false;
      state.token = "";
      state.refreshToken = "";
      state.profileDetails = {};
      state.notificationList = [];
      state.isProfileModalOpen = false;
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
    builder.addCase(profileUpdate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(profileUpdate.fulfilled, (state, action) => {
      state.loading = false;
      const user = action?.payload?.user;
      if (user) {
        state.profileDetails = user;
      }
      state.error = "";
    });
    builder.addCase(profileUpdate.rejected, (state, action) => {
      state.loading = false;
      state.profileDetails = {};
      state.error = action.payload;
    });
    //------------------------------------------------------------------
  },
});

export const { setIsProfileModalOpen, updateAccessToken, logoutSuccess } =
  AuthSlice.actions;
export default AuthSlice.reducer;
