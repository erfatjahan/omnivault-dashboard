import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// ১. সমস্ত প্রোডাক্ট ফেচ করা
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/product");
      return res.data.products || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch products.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ২. নতুন প্রোডাক্ট তৈরি (Create New Product)
export const createNewProduct = createAsyncThunk(
  "products/createNewProduct",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/product/admin/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message || "Product created successfully!");
      return res.data.product || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create product.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ৩. প্রোডাক্ট আপডেট (Update Product)
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, formData }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/product/admin/update/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res.data.message || "Product updated successfully!");
      return res.data.updatedProduct || res.data.product || res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update product.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ৪. প্রোডাক্ট ডিলিট (Delete Product)
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/product/admin/delete/${productId}`);
      toast.success(res.data.message || "Product deleted successfully!");
      return productId;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete product.";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    products: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Product
      .addCase(createNewProduct.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createNewProduct.fulfilled, (state, action) => {
        state.isCreating = false;
        state.products.unshift(action.payload);
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updated = action.payload;
        const index = state.products.findIndex(
          (p) => String(p.id || p._id) === String(updated.id || updated._id)
        );
        if (index !== -1) {
          state.products[index] = updated;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.products = state.products.filter(
          (p) => String(p.id || p._id) !== String(action.payload)
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;