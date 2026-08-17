import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createClientService,
  getClientByIdService,
  updateClientService,
} from "../../../service/Client/clientServices";

const initialState = {
  client: null,
  loading: false,
  clientLoading: false,
  error: "",
  clientError: "",
};

// Create Client
export const createClient = createAsyncThunk(
  "admin/createClient",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await createClientService(payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create client",
        },
      );
    }
  },
);

// Get Client
export const getClientById = createAsyncThunk(
  "admin/getClientById",
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await getClientByIdService(clientId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch client",
        },
      );
    }
  },
);

// Update Client
export const updateClient = createAsyncThunk(
  "admin/updateClient",
  async ({ clientId, data }, { rejectWithValue }) => {
    try {
      const response = await updateClientService(clientId, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update client",
        },
      );
    }
  },
);

const clientSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = "";
      state.clientError = "";
      state.productError = "";
      state.faqError = "";
    },

    clearAdminData: (state) => {
      state.client = null;
      state.faqs = [];
      state.error = "";
      state.clientError = "";
      state.productError = "";
      state.faqError = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createClient.pending, (state) => {
        state.clientLoading = true;
        state.clientError = "";
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.clientLoading = false;
        state.client = action.payload?.client || null;
        state.clientError = "";
      })
      .addCase(createClient.rejected, (state, action) => {
        state.clientLoading = false;
        state.clientError =
          action.payload?.message || "Failed to create client";
      })
      .addCase(getClientById.pending, (state) => {
        state.clientLoading = true;
        state.clientError = "";
      })
      .addCase(getClientById.fulfilled, (state, action) => {
        state.clientLoading = false;
        state.client = action.payload?.client || null;
        state.clientError = "";
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.clientLoading = false;

        state.clientError = action.payload?.message || "Failed to fetch client";
      })
      // -----------------------------------------------------
      .addCase(updateClient.pending, (state) => {
        state.clientLoading = true;
        state.clientError = "";
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.clientLoading = false;
        state.client = action.payload?.client || state.client;
        state.clientError = "";
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.clientLoading = false;
        state.clientError =
          action.payload?.message || "Failed to update client";
      });

    // -----------------------------------------------------
  },
});

export const { clearAdminError, clearAdminData } = clientSlice.actions;

export default clientSlice.reducer;
