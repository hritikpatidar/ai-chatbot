import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteClientTicketService,
  getClientTicketsService,
  updateClientTicketService,
} from "../../../service/Client/ticketServices";

const initialState = {
  tickets: [],
  selectedTicket: null,

  loading: false,
  updateLoading: false,
  deleteLoading: false,

  error: null,
  success: false,

  updateSuccess: false,
  deleteSuccess: false,

  message: "",
};

/* =========================================================
   GET CLIENT TICKETS
========================================================= */

export const getClientTickets = createAsyncThunk(
  "ticket/getClientTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getClientTicketsService();

      if (response?.data?.success === false) {
        return rejectWithValue(
          response?.data?.message || "Failed to fetch tickets",
        );
      }

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch tickets",
      );
    }
  },
);

/* =========================================================
   UPDATE CLIENT TICKET
========================================================= */

export const updateClientTicket = createAsyncThunk(
  "ticket/updateClientTicket",
  async ({ ticketId, data }, { rejectWithValue }) => {
    try {
      const response = await updateClientTicketService(ticketId, data);

      if (response?.data?.success === false) {
        return rejectWithValue(
          response?.data?.message || "Failed to update ticket",
        );
      }

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update ticket",
      );
    }
  },
);

/* =========================================================
   DELETE CLIENT TICKET
========================================================= */

export const deleteClientTicket = createAsyncThunk(
  "ticket/deleteClientTicket",
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await deleteClientTicketService(ticketId);

      if (response?.data?.success === false) {
        return rejectWithValue(
          response?.data?.message || "Failed to delete ticket",
        );
      }

      return {
        ticketId,
        response: response?.data,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete ticket",
      );
    }
  },
);

const ticketSlice = createSlice({
  name: "ticket",

  initialState,

  reducers: {
    clearTicketError: (state) => {
      state.error = null;
    },

    clearTicketMessage: (state) => {
      state.message = "";
    },

    clearTicketSuccess: (state) => {
      state.success = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },

    setSelectedTicket: (state, action) => {
      state.selectedTicket = action.payload;
    },

    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =====================================================
         GET CLIENT TICKETS
      ===================================================== */

      .addCase(getClientTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(getClientTickets.fulfilled, (state, action) => {
        debugger;
        state.loading = false;
        state.success = true;
        state.error = null;
        state.tickets = action.payload?.data?.tickets || [];
      })

      .addCase(getClientTickets.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Failed to fetch tickets";
      })

      /* =====================================================
         UPDATE CLIENT TICKET
      ===================================================== */

      .addCase(updateClientTicket.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })

      .addCase(updateClientTicket.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.error = null;

        const updatedTicket = action.payload?.ticket || action.payload?.data;

        if (updatedTicket?._id) {
          const index = state.tickets.findIndex(
            (ticket) => ticket._id === updatedTicket._id,
          );

          if (index !== -1) {
            state.tickets[index] = updatedTicket;
          }
        }

        state.message =
          action.payload?.message || "Ticket updated successfully";
      })

      .addCase(updateClientTicket.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = false;
        state.error = action.payload || "Failed to update ticket";
      })

      /* =====================================================
         DELETE CLIENT TICKET
      ===================================================== */

      .addCase(deleteClientTicket.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })

      .addCase(deleteClientTicket.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.error = null;

        const ticketId = action.payload?.ticketId;

        state.tickets = state.tickets.filter(
          (ticket) => ticket._id !== ticketId,
        );

        state.message =
          action.payload?.response?.message || "Ticket deleted successfully";
      })

      .addCase(deleteClientTicket.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = false;
        state.error = action.payload || "Failed to delete ticket";
      });
  },
});

export const {
  clearTicketError,
  clearTicketMessage,
  clearTicketSuccess,
  setSelectedTicket,
  clearSelectedTicket,
} = ticketSlice.actions;

export default ticketSlice.reducer;
