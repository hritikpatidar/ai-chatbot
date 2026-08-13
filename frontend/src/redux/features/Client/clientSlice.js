import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createClientService,
  getClientByIdService,
  updateClientService,
} from "../../../service/Client/clientServices";
import {
  createProductService,
  deleteProductService,
  getProductsService,
  updateProductService,
} from "../../../service/Client/productServices";
import {
  createFAQService,
  deleteFAQService,
  getFAQsService,
  updateFAQService,
} from "../../../service/Client/faqServices";

const initialState = {
  client: null,
  products: [],
  faqs: [],
  loading: false,
  clientLoading: false,
  productLoading: false,
  faqLoading: false,
  error: "",
  clientError: "",
  productError: "",
  faqError: "",
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
  async ({ clientId, payload }, { rejectWithValue }) => {
    try {
      const response = await updateClientService(clientId, payload);

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

// Create Product
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async ({ clientId, payload }, { rejectWithValue }) => {
    try {
      const response = await createProductService(clientId, payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create product",
        },
      );
    }
  },
);

// Get Products
export const getProducts = createAsyncThunk(
  "admin/getProducts",
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await getProductsService(clientId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch products",
        },
      );
    }
  },
);

// Update Product
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ productId, payload }, { rejectWithValue }) => {
    try {
      const response = await updateProductService(productId, payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update product",
        },
      );
    }
  },
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await deleteProductService(productId);

      return {
        productId,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete product",
        },
      );
    }
  },
);

// Create FAQ
export const createFAQ = createAsyncThunk(
  "admin/createFAQ",
  async ({ clientId, payload }, { rejectWithValue }) => {
    try {
      const response = await createFAQService(clientId, payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create FAQ",
        },
      );
    }
  },
);

// Get FAQs
export const getFAQs = createAsyncThunk(
  "admin/getFAQs",
  async (clientId, { rejectWithValue }) => {
    try {
      const response = await getFAQsService(clientId);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch FAQs",
        },
      );
    }
  },
);

// Update FAQ
export const updateFAQ = createAsyncThunk(
  "admin/updateFAQ",
  async ({ faqId, payload }, { rejectWithValue }) => {
    try {
      const response = await updateFAQService(faqId, payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to update FAQ",
        },
      );
    }
  },
);

// Delete FAQ
export const deleteFAQ = createAsyncThunk(
  "admin/deleteFAQ",
  async (faqId, { rejectWithValue }) => {
    try {
      const response = await deleteFAQService(faqId);

      return {
        faqId,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to delete FAQ",
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
      state.products = [];
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
      });
    // -----------------------------------------------------
    builder
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
      });
    // -----------------------------------------------------
    builder
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
    builder
      .addCase(createProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = "";
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        const product = action.payload?.product;
        if (product) {
          state.products.unshift(product);
        }
        state.productError = "";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError =
          action.payload?.message || "Failed to create product";
      });

    // -----------------------------------------------------
    builder
      .addCase(getProducts.pending, (state) => {
        state.productLoading = true;
        state.productError = "";
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.products = action.payload?.products || [];
        state.productError = "";
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.productLoading = false;
        state.products = [];
        state.productError =
          action.payload?.message || "Failed to fetch products";
      });

    // -----------------------------------------------------
    builder
      .addCase(updateProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = "";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        const updatedProduct = action.payload?.product;
        if (updatedProduct) {
          state.products = state.products.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product,
          );
        }
        state.productError = "";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError =
          action.payload?.message || "Failed to update product";
      });

    // -----------------------------------------------------
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = "";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        const productId = action.payload?.productId;
        state.products = state.products.filter(
          (product) => product._id !== productId,
        );
        state.productError = "";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError =
          action.payload?.message || "Failed to delete product";
      });
    // -----------------------------------------------------
    builder
      .addCase(createFAQ.pending, (state) => {
        state.faqLoading = true;
        state.faqError = "";
      })
      .addCase(createFAQ.fulfilled, (state, action) => {
        state.faqLoading = false;
        const faq = action.payload?.faq;
        if (faq) {
          state.faqs.unshift(faq);
        }
        state.faqError = "";
      })
      .addCase(createFAQ.rejected, (state, action) => {
        state.faqLoading = false;
        state.faqError = action.payload?.message || "Failed to create FAQ";
      });
    // -----------------------------------------------------
    builder
      .addCase(getFAQs.pending, (state) => {
        state.faqLoading = true;
        state.faqError = "";
      })
      .addCase(getFAQs.fulfilled, (state, action) => {
        state.faqLoading = false;
        state.faqs = action.payload?.faqs || [];
        state.faqError = "";
      })
      .addCase(getFAQs.rejected, (state, action) => {
        state.faqLoading = false;
        state.faqs = [];
        state.faqError = action.payload?.message || "Failed to fetch FAQs";
      });
    // -----------------------------------------------------
    builder
      .addCase(updateFAQ.pending, (state) => {
        state.faqLoading = true;
        state.faqError = "";
      })
      .addCase(updateFAQ.fulfilled, (state, action) => {
        state.faqLoading = false;
        const updatedFAQ = action.payload?.faq;
        if (updatedFAQ) {
          state.faqs = state.faqs.map((faq) =>
            faq._id === updatedFAQ._id ? updatedFAQ : faq,
          );
        }
        state.faqError = "";
      })
      .addCase(updateFAQ.rejected, (state, action) => {
        state.faqLoading = false;
        state.faqError = action.payload?.message || "Failed to update FAQ";
      });
    // -----------------------------------------------------
    builder
      .addCase(deleteFAQ.pending, (state) => {
        state.faqLoading = true;
        state.faqError = "";
      })
      .addCase(deleteFAQ.fulfilled, (state, action) => {
        state.faqLoading = false;
        const faqId = action.payload?.faqId;
        state.faqs = state.faqs.filter((faq) => faq._id !== faqId);
        state.faqError = "";
      })
      .addCase(deleteFAQ.rejected, (state, action) => {
        state.faqLoading = false;
        state.faqError = action.payload?.message || "Failed to delete FAQ";
      });
    // -----------------------------------------------------
  },
});

export const { clearAdminError, clearAdminData } = clientSlice.actions;

export default clientSlice.reducer;
